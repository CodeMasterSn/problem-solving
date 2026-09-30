import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'syabdourahim9@gmail.com';

/**
 * Expéditeur utilisé tant que le domaine solvix.com n'est pas vérifié dans
 * Resend. Une adresse non vérifiée est refusée par Resend : on ne tente donc
 * pas d'utiliser une adresse @solvix.com avant la vérification DNS.
 * Une fois le domaine vérifié, remplacer par : 'Solvix <contact@solvix.com>'
 * (ou <no-reply@solvix.com>).
 */
const MAIL_FROM = 'onboarding@resend.dev';

const PROJECT_TYPES = [
  'Site web',
  'Application',
  'Outil métier',
  'Plateforme',
  'Automatisation',
  'Autre',
];

const BUDGETS = [
  'Moins de 500 000 FCFA',
  '500 000 – 1 000 000 FCFA',
  '1 000 000 – 3 000 000 FCFA',
  'Plus de 3 000 000 FCFA',
  'Je ne sais pas encore',
];

const MAX_BODY_BYTES = 16 * 1024;
const LIMITS = { name: 120, email: 254, phone: 30, company: 160, need: 4000 };
const MIN_NEED = 20;
const RATE_LIMIT_MAX = 4;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 2500;

const RATE_LIMIT_MAP = new Map();

const EMAIL_RE = /^[^\s@"'<>()[\]\\,;:]+@[^\s@"'<>()[\]\\,;:]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+()\d\s./-]+$/;
const PHONE_MIN_DIGITS = 6;

const GENERIC_ERROR = {
  success: false,
  message: 'Une erreur est survenue. Veuillez réessayer.',
};

const GENERIC_CLIENT_ERROR = {
  success: false,
  message: 'Une erreur est survenue lors de l’envoi. Vérifiez vos informations et réessayez.',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').trim();
}

function reply(res, status, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(payload);
}

/**
 * Rate limiting en mémoire, par instance.
 *
 * LIMITE ASSUMÉE : ce store vit dans la mémoire d'une instance serverless, il
 * n'est ni partagé ni durable. Vercel peut router la même IP vers des instances
 * différentes, et une instance peut être détruite entre deux requêtes. Ce
 * mécanisme freine donc les rafales qui ciblent une même instance, il ne
 * constitue pas un rate limiter distribué. La barrière réelle et persistante
 * reste à activer dans Vercel : Project Settings > Firewall > Rate Limiting,
 * sur la route /api/contact.
 */
function isRateLimited(key, now) {
  if (RATE_LIMIT_MAP.size > 2000) {
    for (const [entryKey, entryHits] of RATE_LIMIT_MAP) {
      if (!entryHits.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) RATE_LIMIT_MAP.delete(entryKey);
    }
  }

  const hits = (RATE_LIMIT_MAP.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    RATE_LIMIT_MAP.set(key, hits);
    return true;
  }
  hits.push(now);
  RATE_LIMIT_MAP.set(key, hits);
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('BODY_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function buildEmailHtml(data) {
  const rows = [
    ['Nom', data.name],
    ['Email', data.email],
    ['Téléphone', data.phone || 'Non renseigné'],
    ['Entreprise', data.company || 'Non renseignée'],
    ['Type de projet', data.project_type],
    ['Budget estimatif', data.budget || 'Non renseigné'],
  ];

  const label = (text) =>
    `<td style="padding:8px 16px 8px 0;color:#666666;font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(text)}</td>`;
  const value = (text) =>
    `<td style="padding:8px 0;color:#333333;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(text)}</td>`;

  return [
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#333333;">',
    '<h1 style="font-size:20px;margin:0 0 4px;">Nouveau projet — Solvix</h1>',
    '<p style="font-size:14px;color:#666666;margin:0 0 24px;">Une demande a été envoyée depuis le formulaire de contact.</p>',
    '<table style="width:100%;border-collapse:collapse;border-top:1px solid #F0F0F0;">',
    rows
      .map(
        ([rowLabel, rowValue]) =>
          `<tr style="border-bottom:1px solid #F0F0F0;">${label(rowLabel)}${value(rowValue)}</tr>`
      )
      .join(''),
    '</table>',
    '<h2 style="font-size:16px;margin:28px 0 8px;">Besoin</h2>',
    `<div style="padding:16px;background:#F0F0F0;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.need)}</div>`,
    '<p style="font-size:12px;color:#888888;margin:24px 0 0;">Répondez directement à cet email pour joindre le prospect.</p>',
    '</div>',
  ].join('');
}

function buildEmailText(data) {
  return [
    'Nouveau projet — Solvix',
    '',
    `Nom : ${data.name}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.phone || 'Non renseigné'}`,
    `Entreprise : ${data.company || 'Non renseignée'}`,
    `Type de projet : ${data.project_type}`,
    `Budget estimatif : ${data.budget || 'Non renseigné'}`,
    '',
    'Besoin :',
    data.need,
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, GENERIC_ERROR);
  }

  const now = Date.now();
  const clientKey =
    (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || 'unknown';

  if (isRateLimited(clientKey, now)) {
    return reply(res, 429, GENERIC_ERROR);
  }

  const declaredLength = Number(req.headers['content-length'] || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return reply(res, 413, GENERIC_ERROR);
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch {
    return reply(res, 413, GENERIC_ERROR);
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return reply(res, 400, GENERIC_CLIENT_ERROR);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return reply(res, 400, GENERIC_CLIENT_ERROR);
  }

  if (clean(payload['bot-field'])) {
    return reply(res, 200, { success: true, message: 'Merci pour votre demande.' });
  }

  const renderedAt = Number(payload.rendered_at);
  if (Number.isFinite(renderedAt) && renderedAt > 0 && now - renderedAt < MIN_FILL_MS) {
    return reply(res, 200, { success: true, message: 'Merci pour votre demande.' });
  }

  const data = {
    name: clean(payload.name),
    email: clean(payload.email),
    company: clean(payload.company),
    phone: clean(payload.phone),
    project_type: clean(payload.project_type),
    need: clean(payload.need),
    budget: clean(payload.budget),
  };

  const phoneIsValid =
    data.phone === '' ||
    (data.phone.length <= LIMITS.phone &&
      PHONE_RE.test(data.phone) &&
      (data.phone.match(/\d/g) || []).length >= PHONE_MIN_DIGITS);

  const invalid =
    data.name.length < 2 ||
    data.name.length > LIMITS.name ||
    !EMAIL_RE.test(data.email) ||
    data.email.length > LIMITS.email ||
    !phoneIsValid ||
    data.company.length > LIMITS.company ||
    data.need.length < MIN_NEED ||
    data.need.length > LIMITS.need ||
    !PROJECT_TYPES.includes(data.project_type) ||
    (data.budget !== '' && !BUDGETS.includes(data.budget));

  if (invalid) {
    return reply(res, 400, GENERIC_CLIENT_ERROR);
  }

  if (!RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY manquant.');
    return reply(res, 500, GENERIC_ERROR);
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [CONTACT_TO_EMAIL],
      replyTo: data.email,
      subject: 'Nouveau projet — Solvix',
      html: buildEmailHtml(data),
      text: buildEmailText(data),
    });

    if (error) {
      console.error('[contact] échec Resend:', error?.name || 'erreur inconnue');
      return reply(res, 502, GENERIC_ERROR);
    }
  } catch (err) {
    console.error('[contact] exception Resend:', err?.name || 'erreur inconnue');
    return reply(res, 502, GENERIC_ERROR);
  }

  return reply(res, 200, { success: true, message: 'Merci pour votre demande.' });
}
