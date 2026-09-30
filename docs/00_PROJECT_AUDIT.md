# Solvix — Audit complet du projet existant

**Date :** 30 septembre 2026
**Périmètre :** état actuel du dépôt avant refonte
**Nature :** audit en lecture seule. Aucun fichier existant modifié, supprimé, renommé ou déplacé. Aucune dépendance installée. Aucun commit. Le seul fichier créé est celui-ci.

---

## 1. Architecture actuelle

### 1.1 Nature du projet

Site vitrine **statique**, sans build, sans framework, sans gestionnaire de dépendances. Il n'existe **ni `package.json`, ni `node_modules`, ni lockfile, ni bundler, ni configuration de build** (hors `netlify.toml`). Tout est du HTML/CSS/JS vanilla servi tel quel.

### 1.2 Stack technique

| Couche | Technologie |
|---|---|
| Structure | HTML5 statique multi-fichier |
| Styles | **Un seul** fichier CSS handwritten — `style.css` (2 158 lignes / 56 Ko) |
| Comportement | **Un seul** fichier JS vanilla — `main.js` (82 lignes) |
| Polices | Google Fonts via `<link>` — **Manrope** + **DM Sans** |
| Icônes | **Aucun système d'icônes.** Quelques SVG inline + caractères Unicode (`↗` `→` `↓`) |
| Formulaire | Netlify Forms (`data-netlify="true"`, `method="POST"`, `action="/merci.html"`) |
| Hébergement | Netlify — `netlify.toml` (headers de cache uniquement, **aucune redirection/rewrite**) |
| Déploiement | Push Git (voir `solvix-website-build.md`, étape 8) |

### 1.3 Modèle de rendu

Aucune logique serveur, aucun rendu dynamique, aucun appel réseau côté client, aucun stockage navigateur. Le HTML est intégralement pré-écrit. Le JS se limite à 3 initialiseurs au `DOMContentLoaded`.

### 1.4 Organisation générale

Le site est un **one-pager long** (`index.html`, 219 lignes) qui regroupe sur une seule URL : Hero → Projets → Expertise → Méthode → Témoignages → Studio/Fondateur → Contact → Footer. Les autres pages sont des **pages satellites** (4 pages légales + 1 page de confirmation), sans contenu marketing.

Point structurant : **la navigation principale ne comporte aucun lien vers une autre page que `index.html` et des ancres.** Le site est mono-URL.

---

## 2. Structure des fichiers

```
solvix-portfolio/
├── index.html                     ← page unique, 219 lignes, tout le site marketing
├── main.js                        ← 82 lignes, 3 fonctions
├── style.css                      ← 2 158 lignes, monolithique
├── netlify.toml                   ← en-têtes Cache-Control (3 règles)
├── solvix-website-build.md        ← spec de build de l'ancienne version (441 lignes)
│
├── conditions-generales.html      ← 183 lignes, page légale
├── mentions-legales.html          ← 183 lignes, page légale
├── politique-confidentialite.html ← 178 lignes, page légale
├── politique-cookies.html         ← 166 lignes, page légale
├── merci.html                     ← 133 lignes, confirmation d'envoi
│
├── identite-couleurs-prisme.html  ← 108 lignes, piste de design (non liée au site)
├── identite-symbole-options.html  ← 106 lignes, piste de design (non liée au site)
│
├── assets/
│   ├── logo.png                   ← 145 Ko, nouveau logo Solvix (non encore branché)
│   ├── typo/
│   │   ├── Plus_Jakarta_Sans.zip
│   │   └── Plus_Jakarta_Sans/
│   │       ├── OFL.txt, README.txt
│   │       ├── PlusJakartaSans-VariableFont_wght.ttf
│   │       ├── PlusJakartaSans-Italic-VariableFont_wght.ttf
│   │       └── static/  (10 poids : ExtraLight → ExtraBold, + italiques)
│   ├── images/
│   │   ├── rahime-about.jpeg     ← 253 Ko, utilisée
│   │   ├── rahime-hero.PNG        ← 1,8 Mo, NON utilisée
│   │   └── projets/  (11 captures)
│   │       ├── xam-xam.png        ← 1,4 Mo, utilisée
│   │       ├── samadesk.jpeg      ← 715 Ko, NON utilisée
│   │       ├── matvilla.jpeg      ← 607 Ko, utilisée
│   │       ├── mytima-love.jpeg   ← 553 Ko, NON utilisée
│   │       ├── mohamigroup.jpeg   ← 534 Ko, utilisée
│   │       ├── lettouna.jpeg      ← 470 Ko, NON utilisée
│   │       ├── jokkoevents.jpeg   ← 382 Ko, utilisée
│   │       ├── cle-de-la-reussite.jpeg ← 341 Ko, NON utilisée
│   │       ├── billio.jpeg        ← 337 Ko, utilisée
│   │       ├── rekrut-cv.jpeg     ← 332 Ko, utilisée
│   │       └── darling-body.jpeg  ← 283 Ko, NON utilisée
│   ├── new-brand/                 ← références visuelles Stitch (non fonctionnelles)
│   │   ├── solvix_agence_digitale_homepage/  (code.html 379 l. + screen.png)
│   │   ├── solvix_agence_digitale_solutions/  (code.html 368 l. + screen.png)
│   │   ├── solvix_agence_digitale_projets/    (code.html 374 l. + screen.png)
│   │   ├── solvix_agence_digitale_process/    (code.html 262 l. + screen.png)
│   │   ├── solvix_agence_digitale_propos/     (code.html 338 l. + screen.png)
│   │   ├── solvix_agence_digitale_contact/    (code.html 239 l. + screen.png)
│   │   ├── solvix_design_system/DESIGN.md      (247 l.)
│   │   └── 7 dossiers d'images isolées (xam_xam, billio, jokkoevents,
│   │       matvilla, mohamigroup, rekrut_cv, + portrait placeholder)
│   │
│   └── design/design-model/       ← SUPPRIMÉ (non commité)
│       ├── Solvix.html
│       ├── assets/abdourahime.png
│       └── uploads/FE3F1DA8-….PNG
│
└── docs/                          ← vide avant cet audit
```

### 2.1 Fichiers nécessaires au déploiement

`index.html`, `style.css`, `main.js`, les 4 pages légales, `merci.html`, et `assets/images/**` (uniquement les 7 images référencées). `new-brand/`, `typo/`, les 2 pages `identite-*.html`, `solvix-website-build.md`, `logo.png` et les 6 images non utilisées **ne sont pas nécessaires**.

### 2.2 État Git au moment de l'audit

Modifications de l'utilisateur, non commitées :

| État | Fichier |
|---|---|
| Supprimé | `assets/images/solvix-prism.svg` |
| Supprimé | `assets/images/solvix-prism-social.svg` |
| Supprimé | `assets/design/design-model/**` (4 fichiers) |
| Nouveau | `assets/logo.png` |
| Nouveau | `assets/new-brand/**` |
| Nouveau | `assets/typo/**` |
| Nouveau | `identite-couleurs-prisme.html` |
| Nouveau | `identite-symbole-options.html` |
| Modifié | `.DS_Store` (×3) |

---

## 3. Pages existantes

| # | Page | Fichier | Lignes | Rôle | État |
|---|---|---|---|---|---|
| 1 | Accueil | `index.html` | 219 | **Toute la page marketing** | Active, en ligne |
| 2 | Mentions légales | `mentions-legales.html` | 183 | Éditeur, hébergeur, PI | Active, `noindex` |
| 3 | Politique de confidentialité | `politique-confidentialite.html` | 178 | Collecte, cookies, droits | Active, `noindex` |
| 4 | Conditions générales | `conditions-generales.html` | 183 | Relations contractuelles | Active, `noindex` |
| 5 | Politique cookies | `politique-cookies.html` | 166 | Traceurs, consentement | Active, `noindex` |
| 6 | Confirmation | `merci.html` | 133 | Redirection après envoi | Active, `noindex` |
| 7 | *Couleurs du prisme* | `identite-couleurs-prisme.html` | 108 | **Piste de design** : 3 palettes | Non liée, aucun lien entrant |
| 8 | *Pistes pour le symbole* | `identite-symbole-options.html` | 106 | **Piste de design** : 3 logos + favicon | Non liée, aucun lien entrant |

### 3.1 Pages **manquantes** par rapport au nouveau design

`Solutions` · `Projets` (page autonome) · `Process` · `À propos` · `Contact` (page autonome) · `Design System`.
Ces contenus existent aujourd'hui **uniquement comme sections/ancres** dans `index.html` (`#expertise`, `#projets`, `#methode`, `#studio`, `#contact`).

### 3.2 Détail de la page unique

`index.html` — 8 sections, ordre exact :

| # | Section | id | Contenu |
|---|---|---|---|
| 1 | Hero | `#accueil` | Kicker, H1, lead, 2 CTA, 3 meta, showcase XAM XAM |
| 2 | Projets | `#projets` | 3 projets SaaS/plateformes + 2 sites vitrines |
| 3 | Expertise | `#expertise` | 3 capacités (Comprendre / Concevoir / Développer) |
| 4 | Méthode | `#methode` | 4 étapes numérotées 01→04 |
| 5 | Témoignages | — | 2 citations clients |
| 6 | Studio | `#studio` | Portrait fondateur + texte + signature |
| 7 | Contact | `#contact` | Email, WhatsApp, formulaire 5 champs |
| 8 | Footer | — | Logo, nav, contact, mentions légales |

Dépendances : `style.css`, `main.js`, Google Fonts, 7 images locales, 6 liens sortants `target="_blank"`.
Composants réutilisables : `.studio-header`, `.studio-footer`, `.studio-button`, `.studio-reveal`, `.studio-form`, `.studio-section-wrap`.

---

## 4. Audit HTML

### 4.1 Structure générale

Sémantique **correcte et propre** : `header` > `nav` > `ul/li` > `a`, `main#contenu`, `section` avec `aria-labelledby`, `footer` avec `nav` et `aria-label`. C'est le point le plus solide du projet.

### 4.2 Points positifs

- **1 seul `<h1>` par page** ✓
- Hiérarchie H1 → H2 → H3 cohérente, sans saut de niveau ✓
- **9 images sur 9 ont un `alt`** (y compris `alt=""` correct sur les logos décoratifs) ✓
- Lien d'évitement `.studio-skip` → `#contenu` sur `index.html` ✓
- `aria-labelledby` sur chaque `<section>` ✓
- `aria-expanded` / `aria-controls` sur le burger ✓
- Tous les liens externes en `target="_blank"` portent `rel="noopener noreferrer"` ✓
- 15 headings sur `index.html`, tous avec du contenu réel ✓

### 4.3 Problèmes relevés (non corrigés)

| Problème | Détail |
|---|---|
| **Logos 404** | `solvix-prism.svg` et `solvix-prism-social.svg` ont été **supprimés** mais sont référencés **2 à 3 fois par page** (marque header, marque footer, favicon). Sur les 6 pages : logo et favicon cassés. |
| Favicon mort | `<link rel="icon" href="…/solvix-prism-social.svg">` pointe un fichier inexistant, aucun repli (`logo.png`) n'est déclaré. |
| Icônes en texte | `↗` `→` `↓` comme glyphes, en `aria-hidden="true"` ✓ mais ce ne sont pas des icônes vectorielles. |
| SVG inline dupliqués | Coche de confirmation + 4 logos sociaux en SVG inline, répétés dans les 5 pages satellites (~40 lignes × 5). |
| Liens sociaux vides | `href="#"` sur Instagram, TikTok, LinkedIn, Twitter/X, GitHub. Liens morts. |
| `&nbsp;` dans le H1 | `Vos processus ont dépassé les outils standard&nbsp;?` — espace insécable codée en dur, fragile pour un texte traduit ou responsive. |
| Formulaire dupliqué | `<form name="contact" netlify hidden>` en fin d'`index.html` (l.209-216) : déclaration Netlify Forms obligatoire, mais elle **duplique les 5 champs** du formulaire visible. Toute évolution doit être répercutée deux fois. |
| Classes mixtes | `<a class="navbar__brand studio-brand">` — ancien système BEM (`.navbar__*`) mélangé au nouveau (`.studio-*`). |
| **Deux design systems header/footer** | `index.html` = `.studio-header`/`.studio-footer` ; les 5 autres = `.navbar`/`.footer`. Aucune cohérence. |

### 4.4 Éléments dupliqués

Le bloc **header + burger** est dupliqué dans les 6 pages (25-30 lignes chacune), avec **deux conventions de classes différentes** pour le même composant. Idem pour le **footer** (~60 lignes × 5 pages) et les **4 logos sociaux SVG** (~20 lignes × 5 pages). Aucun mécanisme d'inclusion : ni templating, ni include PHP, ni web component. Tout est figé.

---

## 5. Audit CSS

### 5.1 Organisation

**Un seul fichier : `style.css`, 2 158 lignes, 56 Ko, non minifié.** Aucune architecture (pas de `@layer`, pas de fichiers de composants, pas de variables par fichier). Aucune dépendance.

| Lignes | Bloc |
|---|---|
| 1-19 | **`:root` #1 — variables du nouveau système `studio-*`** |
| 21-504 | **Design « studio »** (header, hero, projets, expertise, méthode, témoignages, fondateur, contact, footer) |
| 428-503 | Media queries studio : 960px / 760px / 420px + `prefers-reduced-motion` |
| **506-2158** | **~1 650 lignes de CSS legacy** en 9 blocs commentés : Hero, Services, Réalisations, Navbar, Témoignages, Contact, Footer, Pages légales, Mobile 375px |
| 506-520 | **`:root` #2 — variables legacy `--color-bg`, `--color-accent`, `--font-display: Sora`…** |

### 5.2 Variables CSS

`:root` #1 — 12 variables, utilisées par `index.html` :

| Variable | Valeur | Rôle |
|---|---|---|
| `--studio-paper` | `#F5F5F1` | Fond gris chaud |
| `--studio-white` | `#FFFFFF` | Fond principal |
| `--studio-ink` | `#1D2D48` | Texte principal (bleu nuit) |
| `--studio-muted` | `#586879` | Texte secondaire |
| `--studio-blue` | `#4168F4` | Accent principal |
| `--studio-cyan` | `#19C4CE` | Accent secondaire |
| `--studio-blue-soft` | `#E5ECF8` | **Déclarée, jamais utilisée** |
| `--studio-line` | `#D8E0EA` | Bordures |
| `--studio-coral` | `#D85872` | Accent tertiaire + focus ring |
| `--studio-display` | `'Manrope', sans-serif` | Titres |
| `--studio-body` | `'DM Sans', sans-serif` | Corps |
| `--studio-width` | `1220px` | Largeur max de conteneur |

`:root` #2 — 10 variables legacy **entièrement mortes** : `--color-bg`, `--color-bg-alt`, `--color-text`, `--color-text-light`, `--color-accent`, `--color-accent-dark`, `--color-border`, `--font-display` (référence **`Sora`, jamais chargée**), `--font-body`, `--navbar-height` (seule exception : utilisée par `.merci-page main`).

### 5.3 Code mort — point le plus important de cet audit

**Environ 100 classes CSS sur 210 (~48 %) ne sont référencées dans aucun fichier HTML.** Le bloc legacy BEM complet est du code fantôme :

- `hero__*` (13), `services__*` (9), `service-card__*` (6)
- `projects__*` (5), `project-card`, `project-image`, `project-overlay`, `project-stack`, `project-link`, `project-info`, `project-category`
- `about__*` (13)
- `contact__*` (17), `contact-card__*` (5)
- `testimonials__*` (4), `testimonial-card__*` (4)
- `section--placeholder`, `navbar__brand-name`, `hero-image`

Également morts : `.studio-work__note`, `.visually-hidden`, `.highlight`, `.section-label`, et `.reveal` / `.reveal.visible` / `.reveal-delay-1/2/3`.

> `initScrollReveal()` (`main.js:10`) cible `.reveal`, mais **aucune page ne porte cette classe** → la fonction est inerte.
> `initNavActiveState()` est **annoncé dans l'en-tête de `main.js`** mais **n'existe pas dans le fichier**.

### 5.4 Système de composition

Bon Bones : un seul conteneur réutilisé partout.

```css
.studio-header__inner,
.studio-section-wrap,
.studio-hero__inner { width: min(1220px, calc(100% - 64px)); margin: 0 auto; }
```

Grille de sections : `grid-template-columns` + `gap` (`.studio-capabilities` en `repeat(3, 1fr)`, `.studio-work-grid` en `repeat(3, minmax(0,1fr))` avec séparateurs `border-left`). Cartes projet : `aspect-ratio: 1.78` + `object-fit` — **pattern directement réutilisable** pour la future page Projets.

### 5.5 SVG de marque : règle à noter

```css
.studio-brand__mark path   { fill: none; stroke: var(--studio-blue); stroke-width: 4.5; }
.studio-brand__mark circle { fill: var(--studio-coral); }
```

Le CSS **interne** les couleurs du logo SVG. Toute nouvelle marque impose de revoir ces deux règles, sinon l'ancien logo sera repeint dans l'ancienne palette.

### 5.6 Motifs visuels à supprimer (contredisent le nouveau design)

| Élément actuel | Ligne | Nouvelle règle `DESIGN.md` |
|---|---|---|
| `linear-gradient(112deg, blue, cyan)` sur les CTA | 145 | « **No Gradients** — flat planes only » |
| `border-radius: 999px` (pilules) sur tous les boutons | 149 | « Circular or pill shapes are **avoided** » → 4px |
| `border-radius: 24px 7px 24px 7px` (angles asymétriques) | 320, 337 | « absolute sharpness », 8px max |
| Glows décoratifs : `.studio-hero::after` avec `blur(8px)` + radial-gradient | 162-164 | « **no colored neon blurs or glow halos under any condition** » |
| Ombres larges : `0 12px 30px`, `0 8px 20px` | 320, 145 | Blur ≤ 16px : `0 4px 12px rgba(51,51,51,.06)` |
| `--studio-coral: #D85872` (rose) + `--studio-blue: #4168F4` | 11, 15 | `#333333` anthracite + `#FF6B4A` corail |
| `backdrop-filter: blur(14px)` sur le header | 65 | autorisé, mais sur `#f9f9f9/90` |
| Fonts Manrope + DM Sans | 21 | **Plus Jakarta Sans exclusivement** |
| Conteneur `1220px` | 18 | `1280px` (12 col), marge externe 48px |
| Pas de numérotation de section | — | `01 //` / `01 / LABEL` obligatoire |

### 5.7 Frictions dans le CSS

1. **Surcharges en fin de bloc** : `.studio-button` défini l.129 puis **redéfini** l.149 ; `.studio-button--nav` défini l.144 puis **redéfini** l.147. `.studio-brand__word`, `.studio-showcase`, `.studio-hero__inner`, `.studio-site` : tous définis 2×. Ce sont des **patches ajoutés après coup** — ordre de cascade non intuitif.
2. **`:root` #2 déclare `--font-display: Sora`**, police jamais chargée. Piège.
3. **Le style de H1 n'existe que dans `.studio-hero h1`.** Tout H1 hors hero n'aura aucun style. Même problème pour les H2 : 5 sélecteurs listés pour un seul style (`.studio-section-heading h2, .studio-work__heading h2, .studio-method h2, .studio-founder h2, .studio-contact h2`).
4. **Pas de reset minimal** : ni `box-sizing`, ni `margin: 0` sur `h1..h6`, `p`, `ul`. Chaque composant gère ses marges.
5. **Rayons incohérents** : `999px`, `24px 7px`, `7px 26px`, `42% 14px 37% 14px`, `7px`, `50%`. **Six langages de formes distincts.**

---

## 6. Audit JavaScript

### 6.1 Inventaire

**Un seul fichier : `main.js`, 82 lignes. Aucune dépendance, aucun CDN, aucun framework, aucune library tierce.** Chargé en `<script src="main.js">` en fin de `<body>` sur les 6 pages.

### 6.2 Fonctionnalités

| Fonction | Emplacement | Déclenchement | Comportement |
|---|---|---|---|
| `initBurgerMenu()` | `main.js:41-76` | clic sur `#burger-btn` | Bascule `.is-open` sur `#navbar`, met à jour `aria-expanded` et `aria-label` (« Ouvrir » → « Fermer »). Ferme au clic sur un lien (`:69-71`) et sur `Escape` (`:73-75`). **Pas de piège de focus**, pas de fermeture au clic extérieur, pas d'`inert`. |
| `initScrollReveal()` | `main.js:10-21` | `DOMContentLoaded` | `IntersectionObserver` (threshold 0.15) ajoute `.visible` aux `.reveal`. **Inopérant : aucune page ne porte `.reveal`.** Code mort. |
| `initStudioMotion()` | `main.js:23-39` | `DOMContentLoaded` | La seule animation réelle du site. Ajoute `studio-motion-ready` sur `<html>`, puis un `IntersectionObserver` (threshold 0.12, `rootMargin: 0 0 -24px 0`) ajoute `.is-visible` + `unobserve` à chaque `.studio-reveal`. **Respecte `prefers-reduced-motion`** (`:26`). |

Initialisation unique via `document.addEventListener('DOMContentLoaded', …)` (`:78-82`).

### 6.3 Ce qui n'existe pas

- ❌ Smooth scroll (les ancres donnent un saut brutal — aucune règle `scroll-behavior`)
- ❌ Menu actif au scroll (annoncé en commentaire, non implémenté)
- ❌ Validation de formulaire côté client
- ❌ `fetch` / AJAX / API
- ❌ `localStorage` / `sessionStorage` / cookies JS
- ❌ `innerHTML`, `eval`, `document.write`
- ❌ Système de components
- ❌ Gestion d'erreur / `try/catch`
- ❌ Internationalisation

### 6.4 Défaut d'architecture à corriger en priorité

`initBurgerMenu()` utilise `document.getElementById('navbar')` et ajoute `.is-open`. Or **le même `id="navbar"` porte deux classes différentes selon la page** :

| Page | `id="navbar"` porte | Règle CSS déclenchée |
|---|---|---|
| `index.html` | `class="studio-header"` | `.studio-header.is-open .studio-nav { display:flex }` (l.447) |
| 5 pages satellites | `class="navbar"` | `.navbar.is-open .navbar__nav { … }` (l.2056) |

Le JS fonctionne **parce que `id` et `class` portent le même nom**. C'est une coïncidence, pas un contrat. Toute refonte du header (ex. `id="site-header"`) **casserait silencieusement le menu mobile des 5 pages satellites**.

### 6.5 Bug d'ancrage

Le header est `position: sticky` (76px). **Aucune section ne porte de `scroll-margin-top`** → les ancres `#projets`, `#expertise`… atterrissent **sous le header**, titre masqué. Le bug touche `index.html` **et** les 5 pages satellites (qui utilisent `index.html#expertise` etc.).

---

## 7. Audit des assets

### 7.1 Images

| Fichier | Poids | Utilisée | Format | Problème |
|---|---|---|---|---|
| `projets/xam-xam.png` | **1,4 Mo** | ✅ Hero (`fetchpriority="high"`) | PNG | **Image la plus lourde, chargée en priorité haute, non compressée** |
| `projets/matvilla.jpeg` | 607 Ko | ✅ | JPEG | Non compressée |
| `projets/mohamigroup.jpeg` | 534 Ko | ✅ | JPEG | Non compressée |
| `projets/jokkoevents.jpeg` | 382 Ko | ✅ | JPEG | Non compressée |
| `projets/billio.jpeg` | 337 Ko | ✅ | JPEG | Non compressée |
| `projets/rekrut-cv.jpeg` | 332 Ko | ✅ | JPEG | Non compressée |
| `images/rahime-about.jpeg` | 253 Ko | ✅ Studio | JPEG | Non compressée |
| `images/rahime-hero.PNG` | **1,8 Mo** | ❌ | PNG | **Non utilisée** — 1,8 Mo de déchet |
| `projets/samadesk.jpeg` | 715 Ko | ❌ | JPEG | Non utilisée |
| `projets/mytima-love.jpeg` | 553 Ko | ❌ | JPEG | Non utilisée |
| `projets/lettouna.jpeg` | 470 Ko | ❌ | JPEG | Non utilisée |
| `projets/cle-de-la-reussite.jpeg` | 341 Ko | ❌ | JPEG | Non utilisée |
| `projets/darling-body.jpeg` | 283 Ko | ❌ | JPEG | Non utilisée |
| `logo.png` | 145 Ko | ❌ **Non branché** | PNG | Le nouveau logo existe mais n'est référencé nulle part |

**Images inutilisées : ~4,2 Mo. Images du dossier : ~7,5 Mo pour 7 images réellement utilisées (~3,8 Mo).**

Aucun attribut `width`/`height` sur les `<img>` → **CLS garanti** sur les 8 images. `loading="lazy"` (6 images) et `fetchpriority="high"` (1 image) sont correctement utilisés.

### 7.2 Logos et icônes

- **Logos SVG** (`solvix-prism.svg`, `solvix-prism-social.svg`) : **supprimés**, toujours référencés → 404 sur les 6 pages (header, footer, favicon).
- **Nouveau logo** : `assets/logo.png` (145 Ko, PNG) — non utilisé, non optimisé.
- **Icônes** : **aucune**. Pas de SVG, pas d'icon font, pas de sprite. Tout passe par des caractères Unicode (`↗` `→` `↓`) et ~5 SVG inline (coche `merci.html` + 4 logos sociaux, dupliqués 5 fois).
- Pas de `.webmanifest`, pas d'icône retina, pas d'`apple-touch-icon`.

### 7.3 Polices

**`Manrope` + `DM Sans`** via `fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap` (2 familles, 9 graisses). `preconnect` sur `fonts.googleapis.com` et `fonts.gstatic.com` ✓, `display=swap` ✓.

Le nouveau design exige **Plus Jakarta Sans exclusivement**. Les fichiers sont **déjà disponibles localement** dans `assets/typo/Plus_Jakarta_Sans/` :
- `PlusJakartaSans-VariableFont_wght.ttf` (variable, italique séparé)
- `static/` — 10 poids fixes (200 → 800) + 2 italiques
- `OFL.txt` (SIL Open Font License — **l'auto-hébergement est autorisé et recommandé**)

**Aucune installation n'a été faite.** L'auto-hébergement via `@font-face` est possible immédiatement : il supprimerait 2 requêtes externes et la latence `fonts.gstatic.com`.

### 7.4 Dossier `new-brand` — références visuelles Stitch

6 pages de référence + un design system. **Ce ne sont pas du code à copier** : ce sont des exports Tailwind Play CDN, non fonctionnels en production. Ce qui y est réellement exploitable, ce sont **les valeurs de design** et **les textes validés**.

Les 7 dossiers d'images isolées (`billio.jpeg/`, `xam_xam.png/`, `jokkoevents.jpeg/`, `matvilla.jpeg/`, `mohamigroup.jpeg/`, `rekrut_cv.jpeg/`, + portrait placeholder) contiennent chacun un `screen.png` — ce sont des **captures d'une itération de design**, pas des images de projet exploitables.

> **Important :** tous les `new-brand/*/code.html` pointent leurs images vers `lh3.googleusercontent.com` (CDN Google). Ce sont des **assets éphémères de génération Stitch, sans garantie de stabilité**. Le logo de référence doit être **reconstruit en SVG**, pas téléchargé depuis ces liens.

### 7.5 `typo/`

Uniquement Plus Jakarta Sans. Aucune police de l'ancien design (Manrope / DM Sans) n'est stockée localement.

---

## 8. Nouveau branding / références Stitch

### 8.1 Le design system validé (`DESIGN.md`)

**Concept directeur :** progression linéaire **PROBLÈME → RÉFLEXION → SOLUTION**. Posture « anti-gimmick » : **zéro glow néon, zéro dégradé violet/cyan, zéro artefact 3D.** La technologie est présentée comme un instrument d'exécution.

**Marque de fabrique : le « X »** — croisement d'axes à 45°, utilisé comme dispositif de cadrage, connecteur de process et filigrane structurel.

**Palette — règle 60/30/10 :**

| Rôle | Couleur | Hex | Usage |
|---|---|---|---|
| Canvas (60 %) | Blanc pur | `#FFFFFF` | Fond de lecture principal |
| Structure (30 %) | Anthracite | `#333333` | Titres, texte, filets, footer |
| Accent (10 %) | **Corail** | `#FF6B4A` | **≤ 10 % du viewport.** CTA, phase « Solution », feedback |
| Fondation | Gris pâle | `#F0F0F0` | Sous-panneaux, conteneurs, backdrops d'inputs |

Règle d'accessibilité : texte `#333333` sur `#FFFFFF`/`#F0F0F0` → **WCAG AAA**.

> ⚠️ **Divergence à trancher.** Le frontmatter YAML de `DESIGN.md` contient un jeu de tokens **Material Design 3** (`#f9f9f9`, `#ae3115`, `#1a1c1c`, `#5f5e5e`…) **en contradiction directe** avec la section prose (`#FFFFFF`, `#333333`, `#FF6B4A`, `#F0F0F0`). **Point à valider en priorité à l'étape 2 du plan** : la prose est la plus cohérente avec les maquettes, mais la divergence doit être tranchée explicitement.

**Formes :** `border-radius: 4px` de base (boutons/inputs), `8px` pour cartes et modales. **Formes circulaires et pilules proscrites.** Angles chanfreinés à 45° hérités du « X ».

**Élévation :** pas d'ombres floutées exagérées ; profondeur par **tonalités** et bordures `1px solid #F0F0F0` ou `rgba(51,51,51,.08)`. Blur max 16px. Ombre d'interaction : `0 4px 12px rgba(51,51,51,.06), 0 1px 2px rgba(51,51,51,.04)`.

**Grille :** Desktop ≥ 1200px → **12 colonnes**, gutters 24px, marge externe 48px, conteneur **1280px**. Tablette 768-1199px → 8 col, 20px, 32px. Mobile ≤ 767px → 4 col, 16px, 20px.

**Composants clés :**
- **CTA primaire** corail `#FF6B4A`, texte blanc, `font-weight: 600`, rayon 4px. Hover : assombrit de 6 %, **sans translation verticale**.
- **CTA secondaire** anthracite `#333333`. **CTA tertiaire** blanc + bordure anthracite, hover fond `#F0F0F0`.
- **Inputs** : hauteur 44px, fond `#FFFFFF`, bordure `1px solid #F0F0F0`, rayon 4px. Focus : bordure `1px solid #FF6B4A` + ring `0 0 0 1px #FF6B4A`. Placeholder `rgba(51,51,51,0.4)`.
- **Chips** : 24px de haut, uppercase `label-sm`, padding `0 8px`, rayon **2px**. Chip standard `#F0F0F0`/`#333333`. Chip solution `rgba(255,107,74,0.1)`/`#FF6B4A`.
- **Cards** : fond `#FFFFFF`, bordure `1px solid #F0F0F0`, rayon 8px, padding 24px.
- **Tri-fold process** : Problème (blanc + rail gauche `#333333`) → Réflexion (`#F0F0F0`) → Solution (cadrage contrasté + accents corail).

**Typographie :** titres 700/600, tracking négatif (-0.03em à -0.01em) ; corps 400 à 1.5-1.55× ; labels 500/600 uppercase tracking positif (0.02em → 0.05em) pour les **trackers de phase** (`01 / PROBLÈME`).

### 8.2 Cohérence interne des 6 maquettes

Les 6 exports partagent **exactement le même jeu de tokens** (vérifié par hachage : les 6 blocs `tailwind.config` sont identiques à 89 clés, **0 différence de valeur**).

Points de vigilance relevés :

- **Aucun menu mobile dans les 6 maquettes** (`hidden md:flex` sans hamburger) → à concevoir, ce n'est pas un acquis.
- **Deux systèmes de conteneur** : `max-w-7xl` (homepage/solutions/projets) vs `max-w-[1280px]` (process/propos/contact). Même largeur finale (1280px), padding différent.
- **Wordmark incohérent** : `SOLVIX` uppercase (homepage/solutions) vs `Solvix` (process/propos/contact) ; `<span>` vs `<a>` cliquable.
- **Footer variants** : homepage/solutions/process/propos/contact = clair mono-rangée ; **projets = footer inversé sombre** (`bg-inverse-surface`), sans logo image.
- **`rounded-full` est remappé à 12px** dans la config Tailwind → les « cercles » des maquettes ne sont pas ronds. Artefact Stitch, à corriger.
- **Typo** : le footer de `contact` contient un caractère parasite (`· Dakar, Sénégal"`).
- Incohérences mineures : `projets` utilise `text-secondary` là où les autres utilisent `text-on-surface-variant` ; `border-neutral-200/80` (couleur Tailwind par défaut) fuit hors du système de tokens.
- `propos` est le seul fichier **sans `preconnect`** ; `contact` duplique son lien Material Symbols.

### 8.3 Contenu éditorial validé dans les maquettes (à récupérer)

- **Homepage** — H1 « Votre problème mérite une **vraie solution** digitale. » · badge « SOLVIX — Agence Digitale Opérationnelle » · sections numérotées `01 //` … `04 //` · tri-fold « État initial / Friction constatée / Processus fragmenté & manuel » → pivot « PROBLÈME → OUTIL » → « Résultat Solvix / Opérationnel en production » avec KPI (+68 % efficacité, 0 ressaisie, 100 % adoption).
- **Solutions** — 5 typologies numérotées : `01 / VISIBILITÉ DE POINTE` Sites Web d'Impact · `02 / MOBILITÉ & TERRAIN` Applications Web & Mobiles · `03 / BACK-OFFICES` Outils Métier Sur-Mesure · `04 / ÉCOSYSTÈME TIERS` Plateformes Digitales & B2B · `05 / INTERCONNEXION` Automatisation & Flux API. Bandeau de preuve : `< 0.8s`, `-90 %`, `100 %` hors-connexion, `Souverain`. Bloc « Du besoin à la solution » avec 3 paires blocage → outil.
- **Projets** — H1 « Des projets construits autour de vrais besoins. » · taxonomie « ARCHETYPE 01-04 » · index de filtres par type de produit · mise en avant JOKKO Events · portfolio éditorial asymétrique (5/7 puis 2×2) · matrice « PROBLÈME IDENTIFIÉ / SOLUTION CONÇUE ».
- **Process** — H1 « Un processus simple pour construire la bonne solution. » · cadence `01 • Déclencheur / Problème` → `02 • Architecture / Réflexion` → `03 • Résultat / Solution` · **timeline verticale à 4 jalons alternés** (Comprendre / Concevoir / Construire / Déployer) avec le **X comme pivot central** · principe fondateur en citation.
- **À propos** — H1 « Construire le digital autour des **vrais besoins.** » · 3 valeurs (Pragmatisme technique / Artisanat numérique / Dakar & Monde) · diagramme circulaire « SOLVIX CORRIDOR » (Friction réelle → Architecture → Impact mesuré) · 3 étapes en cascade · portrait fondateur + badges.
- **Contact** — H1 « Parlons de votre projet. » · champs : Nom complet\*, Adresse email\*, Entreprise/Organisation (facultatif), **Type de projet** (6 pastilles), Votre besoin\* (textarea), **Budget** (5 pastilles). Réassurance : « Réponse sous 24h ouvrées », « Confidentialité garantie », « Dakar & International ».

> **À valider avant publication :** les chiffres marketing des maquettes (`< 0.8s`, `-90 % de double saisie`, `+68 %`, `100 % adoption`) ne sont étayés par aucune source. Le même contenu apparaît sur les pages Solutions et Projets — il faut le confirmer ou l'amender.

---

## 9. Comparaison ancien site / nouveau design

### 9.1 Vue d'ensemble

| Axe | Actuel | Nouveau | Verdict |
|---|---|---|---|
| Pages | 1 marketing + 5 légales | 6 marketing + légales | **Reconstruction** |
| Navigation | 4 ancres sur une page | 5 liens inter-pages | **Reconstruction** |
| Polices | Manrope + DM Sans | Plus Jakarta Sans (excl.) | **Remplacement** (police déjà locale) |
| Palette | Bleu `#4168F4` + cyan + rose | Anthracite `#333333` + corail `#FF6B4A` | **Remplacement** |
| Fonds | `#F5F5F1` gris chaud | `#FFFFFF` / `#F0F0F0` | **Remplacement** |
| Formes | Pilules 999px, angles 24px/7px | 4px / 8px, chanfreins 45° | **Remplacement** |
| Dégradés | `linear-gradient` sur les CTA | **Interdits** | **Suppression** |
| Ombres | `0 12px 30px`, glows radiaux | `0 4px 12px rgba(51,51,51,.06)` | **Réduction** |
| Logo | SVG prisme supprimé (404) | « X » + wordmark | **Reconstruction SVG** |
| Composants | ~40 (studio + legacy) | Système documenté | **Refonte partielle** |
| Numérotation | Absente | `01 //` / `01 / LABEL` obligatoire | **Nouveau** |

### 9.2 Page par page

#### Homepage

- **Ce qui existe déjà** : hero avec H1 fort, showcase projet mis en avant, grille projets (3 + 2), compétences (3), méthode (4 étapes), témoignages, bloc fondateur, formulaire, footer.
- **Ce qui peut être conservé** : **la copywriting existante** — les H1/H2 actuels sont solides et validés. Le pattern de showcase projet. La structure de formulaire. Les témoignages.
- **Ce qui doit être adapté** : toute la couche visuelle — couleurs, formes, typo, espacements, numérotation. Passer de 8 sections empilées à 4 sections numérotées (`01 //` … `04 //`) : Hero → Promesse → Aperçu solutions → Sélection réalisations → CTA final.
- **Ce qui doit être reconstruit** : le hero (badge, H1 avec `vraie solution` en corail, double CTA, **puis tri-fold 12 colonnes avec pivot X central**), les sections numérotées, le panneau CTA final anthracite avec filigrane X.
- **Ce qui manque** : badge « SOLVIX — Agence Digitale Opérationnelle », pivot X central, bloc KPI, section « Notre promesse » à 3 pastilles, section « Aperçu des solutions » à 5 cartes, numérotation de sections.
- **Composants réutilisables** : `.studio-button`, `.studio-reveal` (la mécanique d'animation fonctionne), `.studio-section-wrap` (à redimensionner 1220 → 1280px), données des 5 projets.
- **Conflits** : le hero repose sur un showcase asymétrique à bordure 7px + pseudo-éléments glow → incompatible avec l'esthétique plate. Les CTA dégradés doivent être remplacés. `.studio-hero::before/::after` (l.162-164) sont à supprimer.

#### Solutions

- **Ce qui existe déjà** : la section `#expertise` (3 cartes : Comprendre / Concevoir / Développer et lancer) — contenu différent, structure différente.
- **Ce qui peut être conservé** : le ton et la logique « comprendre le métier avant de choisir une solution ».
- **Ce qui doit être adapté** : la section expertise actuelle pourrait devenir l'**aperçu des solutions** sur la homepage.
- **Ce qui doit être reconstruit** : la page entière. Grille 12 colonnes asymétrique **6/6/4/4/4**, 5 typologies numérotées, bandeau de preuve chiffrée (4 métriques), bloc « Du besoin à la solution » (3 paires blocage → outil), CTA anthracite avec X en filigrane.
- **Ce qui manque** : page dédiée, 5 typologies de services, métriques de preuve, le vocabulaire « PROBLÈME / OUTIL ».
- **Composants réutilisables** : `.studio-capability` (socle de carte), `.studio-text-link`.
- **Conflits** : la nouvelle page utilise un `border-t-2` corail et des rails `border-l-4` — motifs absents du CSS actuel, à créer.

#### Projets

- **Ce qui existe déjà** : section `#projets` avec 3 projets principaux + 2 sites vitrines, données réelles (URL, images, descriptions, catégories).
- **Ce qui peut être conservé** : **100 % du contenu données** — les 5 projets avec URLs, captures, descriptions et catégories. C'est le principal actif de la future page.
- **Ce qui doit être adapté** : `aspect-ratio: 1.78` + `object-fit` (déjà dans le CSS, à garder) ; passer à un layout éditorial asymétrique (5/7 dominant puis 2×2) au lieu de la grille uniforme 3 colonnes.
- **Ce qui doit être reconstruit** : la page, la taxonomie « ARCHETYPE 01-04 », la bande de filtres par type, la mise en avant plein écran JOKKO Events, la matrice « PROBLÈME IDENTIFIÉ / SOLUTION CONÇUE », le CTA double.
- **Ce qui manque** : index de filtres (6 chips), figure « archétype », matrice problème/solution.
- **Composants réutilisables** : `.studio-project`, `.studio-project__image` (le pattern `aspect-ratio` est bon), `.studio-project__link`.
- **Conflits** : le rayon `24px 7px 24px 7px` des cartes actuelles est **explicitement interdit** par le nouveau design. `.studio-project-mini` est un composant à supprimer au profit d'un composant unique.

#### Process

- **Ce qui existe déjà** : la section `#methode` avec 4 étapes (Comprendre / Cadrer / Concevoir et développer / Préparer la mise en ligne). **Le contenu est bon, la structure ne l'est pas.**
- **Ce qui peut être conservé** : le texte des 4 étapes — plus précis et plus crédible que « 01 • Déclencheur / 02 • Architecture / 03 • Résultat ».
- **Ce qui doit être adapté** : passer de 4 étapes numérotées simples à la **timeline verticale à 4 jalons alternés**, rail central 2px, nœuds circulaires.
- **Ce qui doit être reconstruit** : la page entière, la cadence hero `01 • 02 • 03`, le bloc « Notre principe » avec rail corail, les numéros fantômes `01-04` en `display-xl` à 30 % d'opacité, et surtout **le « X » comme pivot central du process** (nœud anthracite contenant une croix à 2.5px de trait).
- **Ce qui manque** : page dédiée, timeline verticale, concept de pivot, cadence hero.
- **Composants réutilisables** : les 4 textes d'étapes, la structure `article > span (numéro) + div > h3 + p`.
- **Conflits** : la timeline alternée gauche/droite est un tout nouveau pattern CSS. `.studio-steps` actuel est une simple liste flex.

#### À propos

- **Ce qui existe déjà** : la section `#studio` (portrait + texte + signature) — plus courte que la maquette.
- **Ce qui peut être conservé** : la photo du fondateur, le nom, la mention Dakar.
- **Ce qui doit être adapté** : le bloc a besoin d'une biographie développée.
- **Ce qui doit être reconstruit** : la page entière — hero 7/5 avec **diagramme circulaire « SOLVIX CORRIDOR »** (X construit en CSS avec deux barres croisées), section « L'intention fondatrice » avec 3 étapes en cascade, section « Notre vision en trois temps » avec carte centrale surélevée, bloc portrait avec légende glass, bande « Solvix en une phrase » avec **X géant `font-black` 280px à 5 % d'opacité**, CTA avec accent de coin.
- **Ce qui manque** : page dédiée, intentions, vision 3 temps, badges du fondateur, la bande signature.
- **Composants réutilisables** : `rahime-about.jpeg` (à recompresser), le texte du fondateur existant.
- **Conflits** : la maquette charge le portrait depuis un CDN Google éphémère → il faut redécouper/optimiser la photo locale. Le wordmark est en casse mixte dans la maquette mais en `UPPERCASE` avec `letter-spacing: .095em` dans le CSS actuel → à trancher.

#### Contact

- **Ce qui existe déjà** : la section `#contact` avec email, WhatsApp, localisation et un formulaire 5 champs **fonctionnel** (Netlify).
- **Ce qui peut être conservé** : **tout le fonctionnement du formulaire** — `data-netlify="true"`, `method="POST"`, `action="/merci.html"`, le `<input type="hidden" name="form-name">`, le bloc de détection Netlify en fin de page, et `merci.html` qui est la page de confirmation. **C'est l'élément le plus critique à préserver.**
- **Ce qui doit être adapté** : ajouter les 2 nouveaux champs de la maquette (**Type de projet** — 6 pastilles + input caché `project_type` ; **Budget** — 5 pastilles). Repenser la mise en page en `lg:col-span-7` (formulaire) / `lg:col-span-5` (infos).
- **Ce qui doit être reconstruit** : le design du formulaire (44px de haut, bordure `#F0F0F0`, focus corail), les sélecteurs à pastilles, les 3 cartes d'information (Agence / Réassurance / Récap), la section de clôture avec le **X vectoriel à angles chanfreinés** dessiné en SVG.
- **Ce qui manque** : sélecteur de type de projet, sélecteur de budget, liens LinkedIn/Twitter/GitHub, blocs de réassurance, page dédiée.
- **Composants réutilisables** : `studio-form`, `studio-form__privacy`, la structure label/input avec `autocomplete` (`name`, `organization`, `email` — déjà corrects et accessibles).
- **Conflits** : l'implémentation de la maquette est **100 % JavaScript simulée** (`onsubmit="handleSubmit()"` avec `preventDefault()` et un panneau de succès caché). **Ce code ne doit pas être repris** : il casserait la soumission Netlify réelle. Il faut reproduire le visuel des pastilles tout en conservant la soumission HTML native.
- **Point produit** : `budget` est actuellement un `<input type="text">` (champ libre). Le passer à des pastilles fermées est un choix qui modifie la collecte de données.

---

## 10. Header / Footer

### 10.1 État actuel — deux systèmes distincts

| | `index.html` | 5 autres pages |
|---|---|---|
| Classes header | `.studio-header`, `.studio-nav`, `.studio-menu-button` | `.navbar`, `.navbar__nav`, `.navbar__burger` |
| Classes footer | `.studio-footer` | `.footer`, `.footer__social`, `.footer__whatsapp` |
| Navigation | 4 ancres : `#projets` `#expertise` `#methode` `#studio` | 5 liens : `index.html#studio` `#expertise` `#projets` `#methode` `#contact` |
| CTA | « Parler de votre projet » (ancre) | « Parler de votre projet » (vers index) |
| Logo | `.studio-brand` + `.studio-brand__word` | `.navbar__brand studio-brand` + `.studio-brand__word` |
| Burger | `<span>` ×3 sans classe | `<span class="navbar__burger-line">` ×3 |
| CSS | l.58-151, 437-447 | l.1312-1429, 1399-1427, 2033-2056 |
| Position | `sticky` top 0, h 76px, `backdrop-filter: blur(14px)` | idem + `--navbar-height: 72px` |

### 10.2 Réutilisation

**Aucune.** Le header est dupliqué dans les 6 pages (25-30 lignes), le footer dans 5 pages (~60 lignes). Aucun mécanisme d'inclusion : ni templating, ni web component, ni génération. Toute correction doit être répliquée 5-6 fois à la main — **source principale de dérive** (ex. : les pages légales ont 5 liens de nav, la homepage 4).

Le footer actuel comporte : logo + baseline, nav de 4 liens, email, WhatsApp, localisation, copyright, et un rang de 4 pages légales. **Les logos sociaux SVG n'existent que dans le footer des pages légales**, pas sur la homepage (incohérence).

### 10.3 Responsive

- **Desktop (> 960px)** : nav inline horizontale, CTA visible, burger masqué. Fonctionnel.
- **≤ 760px** : CTA masqué, burger affiché (42×42), nav en panneau plein largeur sous le header (`top: 67px`, `background: white`), animation burger → croix.
- **≤ 420px** : ajustements de largeur de conteneur (32px de marge).

Défauts : le panneau mobile n'a **ni `max-height` ni scroll** (sur iPhone SE avec clavier, les liens du bas deviennent inaccessibles) ; **pas de `scroll-margin-top`** ; pas d'ombre au scroll ; le burger ne se ferme ni au clic extérieur ni au scroll ; pas d'`inert` ni de focus trap.

### 10.4 Comparaison avec le nouveau design

| Élément | Actuel | Maquette | Action |
|---|---|---|---|
| Hauteur | 76px (sticky) | 80px (`h-20`) | Adapter |
| Position | `sticky` | `fixed` + `main pt-20` | Choisir un seul mode |
| Fond | `rgba(255,255,255,.96)` | `bg-surface-container-lowest/90` ou `bg-surface/90` | Adapter |
| Blur | `backdrop-filter: blur(14px)` | `backdrop-blur-xl` | Garder l'intention |
| Ombre | aucune | `shadow-[0_1px_8px_rgba(0,0,0,0.04)]` | Ajouter |
| Wordmark | `SOLVIX` uppercase, `ls .095em` | `SOLVIX`/`Solvix` selon page | **Trancher la casse** |
| Nav | 4 ancres | 5 liens : Solutions · Projets · Process · À propos · Contact | Reconstruire |
| Libellé CTA | « Parler de votre projet » | **« Parlons de votre projet »** | Modifier (× 6 pages) |
| CTA style | dégradé bleu/cyan, rayon 999px | corail `#FF6B4A`, rayon 4px, hover sans translation | Reconstruire |
| État actif | inexistant | 3 variantes selon la page | Choisir **une seule** |
| Avatar | absent | `w-8 h-8` cercle corail + icône `person` | À trancher |
| Menu mobile | burger + panneau (fonctionnel) | **inexistant dans les maquettes** | **Conserver le burger actuel comme base** |

**Footer :**

| Élément | Actuel | Maquette | Action |
|---|---|---|---|
| Structure | 3 blocs + rang légal | Rang unique 3 parties | Reconstruire |
| Fond | blanc | blanc, **sauf Projets (anthracite inversé)** | Trancher (clair partout = plus cohérent) |
| Liens | 4 ancres | 5 pages | Reconstruire |
| Réseaux sociaux | SVG inline (pages légales seulement) + liens morts | 3 chips (LinkedIn / Twitter / GitHub) | Ajouter / nettoyer |
| Copyright | `© 2026 Solvix` | `© 2025 Solvix. Tous droits réservés.` | Uniformiser |
| **Mentions légales** | rang dédié, 4 liens | **absent des maquettes** | **Préserver (obligation légale)** |
| WhatsApp | `+221 77 677 87 47` | absent | Préserver |

### 10.5 À uniformiser en priorité

1. **Une seule classe pour un seul composant** — le dualisme `.navbar` / `.studio-header` doit disparaître. Le JS s'appuie dessus par coïncidence `id`=`class` → risque de casser au premier renommage.
2. **Un seul jeu de 5 liens de navigation**, cohérent sur les 6 pages.
3. **Un seul libellé de CTA** (« Parlons de votre projet ») sur les 6 pages.
4. **Un seul traitement du wordmark** (casse, taille, tracking).
5. **Un seul état de lien actif**, appliqué par JS sur la page courante.
6. **Ajouter `scroll-margin-top: 96px`** sur toutes les sections cibles.
7. **Ajouter le rang de mentions légales** au footer (obligatoire, absent des maquettes).
8. **Piège de focus et fermeture au clic extérieur** sur le menu mobile.

---

## 11. Responsive

### 11.1 Media queries existantes

**16 blocs `@media`**, dont **5 pour le nouveau système `studio-*`** :

| Breakpoint | Rôle | Contenu |
|---|---|---|
| `max-width: 960px` | Tablette | Conteneur `100% - 44px`, hero 2 colonnes resserrées, `gap: 55px` |
| `max-width: 760px` | Mobile | **Bloc principal (~55 règles)** : header 68px, burger, panneaux, grilles 1 colonne, footer empilé |
| `max-width: 420px` | Petit mobile | Ajustements fins (~7 règles) |
| `prefers-reduced-motion` | Accessibilité | Neutralise animations et transitions |
| `max-width: 768px` (×5) | **Legacy** | l.588, 793, 975, 1131, 1297 |
| `max-width: 1024px` | **Legacy** | l.1290 |
| `max-width: 768px` (×3) | **Legacy** | l.1818, 2009, 2028 |
| `max-width: 768px` | **Legacy** | l.2153 |

**Les deux design systems n'utilisent pas les mêmes breakpoints** — `studio-*` casse à 960/760/420, le legacy à 1024/768. Un site à deux breakpoints est difficile à maintenir.

### 11.2 Ce qui est correctement structuré

- Approche **mobile-first par `max-width`** cohérente dans le bloc studio.
- `clamp()` pour les titres : `clamp(2.85rem, 11vw, 4.4rem)` — le H1 s'adapte sans sauts ✓
- Conteneur fluide `min(1220px, calc(100% - 64px))` avec paliers 44px / 40px / 32px ✓
- `minmax(0, 1fr)` sur les grilles de cartes — évite le débordement des images ✓
- Testé sans simulateur : les largeurs sont assignées dans les 3 paliers, donc le risque de débordement horizontal est faible.
- `prefers-reduced-motion` correctement implémenté (CSS **et** JS) ✓

### 11.3 Éléments à risque

| Risque | Détail |
|---|---|
| **Images sans `width`/`height`** | Toutes les `<img>` → **CLS sur les 8 images**, sur mobile comme desktop |
| **Images trop lourdes** | `xam-xam.png` 1,4 Mo en `fetchpriority="high"` : sur 4G mobile (~1,6 Mo/s), **~0,9 s de blocage du LCP** avant le rendu du texte |
| **Panneau mobile sans scroll** | `.studio-nav` : pas de `max-height` ni `overflow` → débordement sur très petit écran |
| **Grille projets à 2 colonnes entre 421-760px** | 2 colonnes de captures + texte (~160px/colonne), quite serré. À tester à 480px |
| **Hero à 2 colonnes entre 761-960px** | `1fr .86fr` + H1 à `clamp(3rem, 6.5vw, 4.25rem)` → colonne texte étroite, H1 très serré |
| **Aucune règle entre 960 et 1200px** | saut de marge 44px → 64px peu harmonieux |
| **Header sticky + ancres** | Pas de `scroll-margin-top` → titres masqués au clic, sur les 6 pages |
| **H1 à 2.7rem en 420px** | peut produire 3-4 lignes sur un iPhone SE |

### 11.4 Manques responsive

- ❌ Pas de menu mobile dans les maquettes → **le burger actuel est le seul pattern à conserver tel quel** pour la navigation.
- ❌ Pas de breakpoint « très large » (≥ 1440px) : le conteneur 1220px (1280px attendu) laisse de grandes marges.
- ❌ Pas de traitement `hover` sur mobile (les effets `scale(1.035)` s'appliquent au tap sur iOS).
- ❌ Pas de feuille de style `print` pour les pages légales.

---

## 12. SEO

### 12.1 État des lieux

| Élément | `index.html` | Pages légales / merci | Verdict |
|---|---|---|---|
| `<title>` | « Solvix — Plateformes métier et produits web sur mesure » (60 car.) | « X — Solvix » | ✓ |
| `meta description` | 189 car. — **au-dessus de la limite (~155-160)** | courtes ✓ | ⚠️ À raccourcir |
| `lang="fr"` | ✓ | ✓ | ✓ |
| `viewport` / `charset` | ✓ | ✓ | ✓ |
| `meta robots` | `index, follow` | `noindex, follow` | ✓ |
| `meta author` | « Abdourahime SY » | absent | ✓ / à ajouter |
| `theme-color` | `#1D2D48` | idem | ⚠️ À changer (couleur abandonnée) |
| **`rel="canonical"`** | ❌ **absent sur les 8 pages** | ❌ | ⚠️ **Manquant partout** |
| **Open Graph** | `og:title`, `og:description`, `og:image`, `og:type`, `og:locale`, `og:site_name` | ❌ | ⚠️ **Pas de `og:url`** |
| `og:image` | `projets/xam-xam.png` — **1,4 Mo**, **URL relative** | — | ⚠️ **Non absolue, trop lourde, et c'est une capture de projet** |
| Twitter Card | `summary_large_image` sans `twitter:title/description/image` | ❌ | ⚠️ Incomplet |
| **Favicon** | **fichier supprimé → 404** | idem | ❌ **Cassé partout** |
| **`robots.txt`** | ❌ **n'existe pas** | — | ⚠️ **Absent** |
| **`sitemap.xml`** | ❌ **n'existe pas** | — | ⚠️ **Absent** |
| **Données structurées** | ❌ aucun `application/ld+json` | ❌ | ⚠️ **Absent** |

### 12.2 Points forts

- Hiérarchie de titres parfaite sur `index.html` : 1 `h1`, 6 `h2`, 8 `h3`, aucun saut de niveau.
- URLs en minuscules avec tirets (`politique-confidentialite.html`) ✓
- Pages légales correctement `noindex` ✓
- `preconnect` Google Fonts présent ✓
- Maillage interne cohérent (footer → 4 pages légales) ✓
- 9 `alt` sur 9 images, globalement descriptifs ✓

### 12.3 Manques SEO

1. **Aucune donnée structurée** — opportunités : `Organization` / `LocalBusiness` (Dakar), `WebSite`, `Person` (Abdourahime SY), `BreadcrumbList` sur les pages légales, `ContactPoint`.
2. **`og:url` et URLs absolues manquants** — Facebook/LinkedIn ne peuvent pas résoudre les URL relatives.
3. **`og:image` inadapté** : 1,4 Mo, PNG, et surtout une capture de projet comme image de partage. Il faut une image de marque dédiée, idéalement 1200×630.
4. **`canonical` absent** sur toutes les pages.
5. **Pas de `sitemap.xml` / `robots.txt`** — à créer, idéalement générés par Netlify.
6. **Pas de `twitter:title` / `twitter:description` / `twitter:image`**.
7. **Meta description de 189 caractères** → sera tronquée dans Google (~155).
8. **Favicon 404** — impact visuel sur l'onglet et signal de qualité.
9. **Absence de maillage inter-pages** : une seule URL indexable aujourd'hui. La refonte créera 6 URL indexables et un vrai maillage.
10. **Incohérence de domaine/email** : les pages légales mentionnent `contact@solvix.com`, les maquettes Stitch utilisent `contact@solvix.io` et `contact@solvix.sn` → à trancher (voir §16).

---

## 13. Performance

### 13.1 Budget actuel

| Ressource | Poids | Statut |
|---|---|---|
| `style.css` | 56 Ko (non minifié) | ⚠️ ~1 650 lignes de code mort |
| `main.js` | 2,5 Ko | ✓ Négligeable |
| `index.html` | 19 Ko | ✓ |
| **Images chargées sur la homepage** | **~2,0 Mo** | ❌ **Principal goulot** |
| Google Fonts | 2 familles, 9 graisses | ⚠️ 2 requêtes externes + latence |
| Scripts tiers | **0** | ✓ Excellent |

**Poids total de la homepage : ~2,1 Mo, dont 95 % d'images.**

### 13.2 Images — le goulot principal

| Problème | Détail | Gravité |
|---|---|---|
| `xam-xam.png` **1,4 Mo** | Format **PNG** pour une capture (devrait être JPEG/WebP). Chargé en `fetchpriority="high"` → bloque le LCP | 🔴 Critique |
| Aucune image en `WebP`/`AVIF` | 0 image dans un format moderne | 🔴 Élevé |
| JPEG non compressés | 253-607 Ko chacun, alors que 60-100 Ko est atteignable sans perte visible | 🟠 Élevé |
| 4,2 Mo d'images non utilisées | Alourdissent le dépôt et le déploiement | 🟡 Moyen |
| Pas de `srcset` / `sizes` | Aucune image responsive → les petits écrans téléchargent les grands fichiers | 🔴 Élevé |
| Pas de `width`/`height` | CLS garanti | 🟠 Élevé |
| `loading="lazy"` | ✅ Correct sur les 6 images sous le fold | ✓ |
| `decoding="async"` | ❌ absent | 🟡 Faible |

### 13.3 CSS

- Fichier monolithique de 2 158 lignes / 56 Ko, **non minifié**, livré tel quel (pas de build).
- **~48 % de classes mortes** (≈ 1 650 lignes) : le navigateur les parse et les ignore. Le poids pourrait être divisé par ~2.
- Pas de `content-visibility`, pas de `@layer`, pas de feuille `print`.
- `backdrop-filter: blur(14px)` sur le header : coûteux sur mobiles d'entrée de gamme, actif en permanence.
- Deux blocs `:root` : le second déclare une police (`Sora`) non chargée — inerte.
- `display=swap` délégué à Google ✓.

### 13.4 JavaScript

- 2,5 Ko, 82 lignes, 3 fonctions, 0 dépendance, 0 requête réseau. **Impact négligeable.**
- Pas de `defer` mais script en fin de `<body>` → pas de blocage de parsing.
- `initScrollReveal()` ne fait pas `unobserve` (fuité potentielle) — sans impact car la fonction est inerte.
- `initStudioMotion()` fait correctement `unobserve` ✓.

### 13.5 Scripts externes

- **Zéro** script tiers. **Zéro** analytics. **Zéro** pixel de tracking. **Zéro** CDN. **Excellent point de départ — à préserver.**
- Seules requêtes externes : Google Fonts (2). Les images `lh3.googleusercontent.com` n'existent **que** dans les maquettes Stitch (jamais chargées en production).

### 13.6 Configuration réseau

`netlify.toml` — 3 règles, toutes correctes :
- `/assets/images/*` → `max-age=31536000, immutable`
- `/*.css` → idem
- `/*.js` → idem

**Manques et risques :**
- Pas de règle de cache pour les `.html` (devraient être `no-cache` ou `max-age=0`).
- **Attention :** `immutable` sur `/*.css` et `/*.js` avec un nom de fichier **non haché** est risqué — après une modification, les navigateurs peuvent garder l'ancien CSS/JS jusqu'à **1 an**. À corriger pendant la refonte (versionner les fichiers ou changer la stratégie).

### 13.7 Ce qui manque pour une performance correcte

- Formats modernes (WebP/AVIF) + `srcset`/`sizes`
- Dimensions sur les images
- Auto-hébergement de Plus Jakarta Sans (`@font-face` sur les `.ttf` locaux) → supprime 2 requêtes externes + la latence `gstatic`
- Suppression du bloc CSS legacy
- Minification (via un plugin Netlify, sans toucher au code source)
- Preload du LCP (nouvelle image de hero)
- Vérification de `Content-Encoding: br` (Netlify le fait par défaut)

---

## 14. Accessibilité

### 14.1 Points positifs

- Lien d'évitement `.studio-skip` → `#contenu` sur `index.html` ✓
- Sémantique correcte : `header` / `nav` / `main` / `section` / `article` / `footer` / `blockquote` + `footer` de citation
- Un seul `h1` par page, hiérarchie sans saut ✓
- `aria-labelledby` sur chaque `<section>` ✓
- 3 `<nav>` avec `aria-label` distincts (« Navigation principale », « Liens du pied de page », « Informations légales ») ✓
- Burger : `aria-expanded`, `aria-controls`, `aria-label` dynamique ✓
- **9 images / 9 ont un `alt`** ; logos décoratifs en `alt=""` (correct) ✓
- Formulaire : **chaque champ a un `<label for>` associé** ✓
- `autocomplete` correct : `name`, `organization`, `email` ✓
- `required` sur les 4 champs obligatoires ✓
- Ring de focus visible et cohérent : `:focus-visible { outline: 3px solid var(--studio-coral); outline-offset: 4px }` sur `a`, `button`, `input`, `textarea` ✓
- Glyphes décoratifs (`↗` `→` `↓`) enveloppés dans `aria-hidden="true"` ✓
- SVG inline de `merci.html` en `aria-hidden="true"` ✓
- `prefers-reduced-motion` respecté en CSS **et** en JS ✓
- Fil d'Ariane sur les pages légales ✓
- `target="_blank"` toujours avec `rel="noopener noreferrer"` ✓

### 14.2 Problèmes

| Problème | Gravité | Détail |
|---|---|---|
| **Menu mobile : pas de piège de focus** | 🔴 | Le focus clavier peut tabuler dans le contenu sous le menu ouvert |
| **Menu mobile : pas d'`inert` / masquage** | 🟠 | Le contenu derrière n'est pas masqué pour les lecteurs d'écran |
| **Menu mobile : pas de fermeture au clic extérieur** | 🟠 | Ergonomie |
| **Menu mobile : pas de `max-height` / scroll** | 🟠 | Uniquement petits écrans avec clavier |
| **Logo 404** | 🔴 | Image cassée dans le header et le footer de 6 pages |
| **Contraste** | 🟠 | `--studio-muted #586879` sur blanc ≈ **5,2:1** (AA, **pas AAA**). Le nouveau design exige AAA avec `#333333` → 12,6:1 |
| **`.studio-kicker` / `.studio-section-index`** | 🟡 | Corps `.69rem`–`.73rem` en `#4168F4` sur blanc ≈ **4,0:1** — **sous AA** pour texte < 18px (4,5:1 requis) |
| **Petits corps** | 🟡 | `.studio-capability__detail`, `.studio-project__type` à `.72rem` (11,5 px) |
| **Ancres sans `scroll-margin-top`** | 🟠 | Le focus suit l'ancre, le titre est masqué par le header sticky |
| **Liens sociaux `href="#"`** | 🟠 | 3 liens inopérants annoncés aux lecteurs d'écran |
| **Pas de `aria-live`** | 🟡 | `merci.html` n'annonce pas la confirmation (page plein → acceptable) |
| **Pas de skip-link sur les 5 pages satellites** | 🟡 | Incohérent avec `index.html` |

### 14.3 Le nouveau design est plus exigeant — et meilleur

- Contraste **WCAG AAA** exigé (l'implémentation actuelle est à AA) → gain réel.
- Corps de texte **18 px minimum** pour `body-lg` (l'actuel descend à `.69rem` = 11 px pour les kickers) → **amélioration nette**.
- Mais : Plus Jakarta Sans à 11 px en uppercase avec tracking `0.05em` reste petit → à surveiller.

---

## 15. Sécurité

**Aucun problème de sécurité détecté.** Résultats de l'analyse :

| Vérification | Résultat |
|---|---|
| Clés API / tokens / secrets (HTML, CSS, JS) | ✅ **Aucune occurrence** (`api_key`, `secret`, `token`, `password`, `bearer`, `private_key`, `sk_live`, `pk_live`, `AIza` testés) |
| `innerHTML` / `outerHTML` | ✅ Absent |
| `eval()` / `new Function()` | ✅ Absent |
| `document.write()` | ✅ Absent |
| `localStorage` / `sessionStorage` / `document.cookie` | ✅ Absent |
| `fetch()` / `XMLHttpRequest` / WebSocket | ✅ Absent — **aucun appel réseau** |
| `target="_blank"` sans `rel="noopener"` | ✅ **0 occurrence** (11 vérifiés, tous protégés) |
| Scripts tiers / CDN | ✅ **Aucun** (hors Google Fonts) |
| Bibliothèques externes | ✅ **Aucune** |
| `http://` en clair | ✅ Aucun (seul `http://www.w3.org/2000/svg`, un namespace XML) |
| Attributs `on*` inline | ✅ Aucun (`onsubmit` n'existe que dans les maquettes Stitch, jamais déployées) |
| Formulaires | ✅ Soumission native Netlify avec `netlify-honeypot="bot-field"` (anti-spam) — **pas de `fetch` custom, donc pas de surface XSS côté JS** |
| Points d'injection HTML | ✅ Aucun (aucune donnée dynamique injectée) |
| HTTPS | ✅ Netlify force le HTTPS |
| `netlify.toml` | ✅ Aucune directive dangereuse |

### 15.1 Réserves (bruit faible, pas de vulnérabilité)

- **Défaillance de marque** : le header et le footer s'appuient sur un SVG **supprimé** → rendu cassé. C'est un défaut d'intégrité, pas une faille.
- **`netlify-honeypot="bot-field"`** est déclaré sur le formulaire caché, mais **aucun champ `bot-field` n'existe** dans le HTML. Le pot de miel est donc **inopérant** — le formulaire n'est en réalité **pas protégé contre le spam**.
- **La page `merci.html` est accessible en accès direct** (pas de jeton). Un visiteur peut la voir sans avoir envoyé de message. Sans conséquence, mais à noter.
- **Les liens projets (`netlify.app`, `vercel.app`) pointent vers des sous-domaines de démonstration** — s'ils ne sont pas보호 par mot de passe, ils exposent des produits non finalisés publiquement. **À vérifier hors de ce dépôt.**

---

## 16. Dette technique

Par ordre de priorité. Chaque point indique **pourquoi** il bloque la refonte.

### 16.1 Bloquants

| # | Problème | Pourquoi c'est bloquant |
|---|---|---|
| 1 | **Logos SVG supprimés mais toujours référencés** | Le logo et le favicon sont cassés sur les 6 pages. La nouvelle identité exige un logo « X » **reconstruit en SVG** (les assets Stitch pointent vers un CDN éphémère). Il faut décider du SVG final avant toute page. |
| 2 | **48 % de CSS mort + 2 blocs `:root` contradictoires** | Impossible de faire évoluer le design de façon fiable tant qu'un token actif peut être redéfini 30 lignes plus bas. Le bloc legacy sera supprimé, mais il contient aussi `.legal-*` et `.merci-*` **qui sont encore utilisées** → il faut les **extraire avant de purger**. |
| 3 | **Deux design systems header/footer** | Le JS dépend de la coïncidence `id="navbar"` = `class="navbar"`. Renommer le header casse le menu mobile des 5 pages satellites, silencieusement. À résoudre **en premier**, avant toute page. |
| 4 | **Formulaire Netlify à préserver absolument** | `data-netlify`, `action="/merci.html"`, le champ caché `form-name`, et le formulaire de détection dupliqué en fin de page. Toute erreur = perte de tous les leads. La maquette Contact utilise un `onsubmit` simulé qui **casserait** la soumission réelle. |

### 16.2 Structurants

| # | Problème | Pourquoi |
|---|---|---|
| 5 | **Pas de mutualisation header/footer** | 6 copies du header, 5 du footer, 4 logos sociaux SVG dupliqués. Toute évolution de la navigation = 5-6 modifications manuelles, avec le risque de divergence déjà visible (4 vs 5 liens). |
| 6 | **`&nbsp;` dans le H1** | Espace insécable codée en dur dans le titre le plus visible du site. Will break on translation and on narrow viewports. |
| 7 | **Pas de `scroll-margin-top`** | Bug d'ancrage sur les 6 pages. Invisible en desktop, visible au clic sur mobile. |
| 8 | **`initScrollReveal()` inerte + `initNavActiveState()` fantôme** | `main.js` décrit un plan qui ne correspond plus au code. Le commentaire d'en-tête induit en erreur sur ce qui existe réellement. |
| 9 | **`:root` #2 déclare `--font-display: Sora`** | Police jamais chargée. UnToken qui renvoie `sans-serif` sans que personne ne s'en aperçoive. |
| 10 | **Surcharges CSS en fin de bloc** (`.studio-button` 2×, `.studio-brand__word` 2×, `.studio-showcase` 2×, etc.) | Ordre de cascade non intuitif. Toute modification du bouton principal doit être faite à deux endroits. |

### 16.3 Qualité & contenu

| # | Problème | Pourquoi |
|---|---|---|
| 11 | **`~4,2 Mo` d'images inutilisées** (6 captures + `rahime-hero.PNG`) | Le dépôt est alourdi, le déploiement Netlify ralenti, l'exploration du projet confuse. À nettoyer **après** avoir vérifié qu'aucun n'est prévue pour la refonte (voir §17). |
| 12 | **Images sans `width`/`height`, sans `srcset`, en PNG/JPEG lourds** | CLS garanti + 2 Mo sur la homepage. Lasset principal de la refonte est la page Projets : sans optimisation, elle pèsera 3-4 Mo. |
| 13 | **Cache `immutable` sur `/*.css` et `/*.js` non versionnés** | Après la première mise en production du nouveau CSS, certains navigateurs peuvent servir l'ancien pendant 1 an. **Risque de rollback très pénible pendant la refonte itérative.** |
| 14 | **Pas de `robots.txt`, `sitemap.xml`, `canonical`, données structurées** | Le site n'est que très partiellement indexable. À traiter à l'étape SEO. |
| 15 | **3 liens sociaux `href="#"` + e-mails incohérents** (`solvix.com` / `solvix.io` / `solvix.sn`) | Liens morts visibles + incohérence de marque. |
| 16 | **Honeypot Netlify non fonctionnel** (champ `bot-field` absent) | Le formulaire est en réalité non protégé. |
| 17 | **Wordmark et CTA incohérents entre les 6 pages** | `SOLVIX`/`Solvix`, « Parler de »/« Parlons de », 4 vs 5 liens de nav. |

### 16.4 Embarras (faible impact, mais à connaître)

- `solvix-website-build.md` (441 lignes) décrit l'ancienne architecture (`#hero`, `#services`, `#about`, `#projects`) qui **ne correspond plus** au HTML actuel. C'est un document d'historique, pas une spec. source de vérité.
- `identite-couleurs-prisme.html` et `identite-symbole-options.html` ne sont liées nulle part. Elles portent des palettes et des logos **abandonnés** (vert jade `#2E7772`, clay `#C77C5D`, bleu `#4168F4`) — risque de confusion avec le nouveau branding.
- `assets/logo.png` (145 Ko) n'est référencé nulle part.
- `backdrop-filter: blur(14px)` permanent sur le header : coût GPU sur mobiles d'entrée de gamme.

---

## 17. À préserver

Liste de tout ce qui **doit continuer à fonctionner** pendant la refonte.

### 17.1 Fonctionnalités critiques

| Élément | Emplacement | Règle |
|---|---|---|
| **Soumission du formulaire de contact** | `index.html:178-192` + `index.html:209-216` | Conserver **à la lettre** : `name="contact"`, `method="POST"`, `data-netlify="true"`, `action="/merci.html"`, `<input type="hidden" name="form-name" value="contact">`, et le formulaire `netlify hidden` de détection. |
| **Page de confirmation** | `merci.html` | Ne pas toucher au fonctionnement. Adapter seulement le style. |
| **Noms de champs du formulaire** | `index.html` | `nom`, `structure`, `email`, `budget`, `projet` — les changer casse les enregistrements Netlify existants. |
| **Anti-spam honeypot** | `index.html:209` | `netlify-honeypot="bot-field"` est déclaré mais le champ n'existe pas → **à compléter**, pas à supprimer. |

### 17.2 Logique JavaScript

| Fonction | Fichier | Règle |
|---|---|---|
| `initBurgerMenu()` | `main.js:41-76` | Fonctionnel. À porter sur le nouveau header, **avec un contrat d'ID explicite** (ne plus dépendre de `id`=`class`). Conserver la gestion `Escape` et la fermeture au clic lien. |
| `initStudioMotion()` | `main.js:23-39` | Fonctionnel et correctly accessible (respecte `prefers-reduced-motion`, `unobserve` après déclenchement). **À conserver tel quel**, seule la liste des sélecteurs est à ajuster. |
| `initScrollReveal()` | `main.js:10-21` | Inerte. À **supprimer** (avec son bloc CSS `.reveal*`) — ou à rebrancher si des classes `.reveal` sont introduites. |
| Bloc `DOMContentLoaded` | `main.js:78-82` | Point d'entrée unique à conserver. |

### 17.3 Contenu éditorial à préserver

- **Les 5 projets** (nom, URL, description, catégorie, capture) : Billio, JOKKO Events, Rekrut CV, Mat Villa, MOH AMI Group + XAM XAM en showcase. **C'est l'actif de données principal.**
- **Les 6 URLs de projets** : `xamxam-sn.com`, `billio-sn.netlify.app`, `jokkoevents.com`, `rekrut-sn.vercel.app`, `matvilla.com`, `mohamigroup.com`.
- **Les 2 témoignages clients** (Dara / Mat Villa, Cheikh SY / MOH AMI Group) — non repris dans les maquettes, mais réels.
- **Les 4 textes d'étapes de la méthode** (Comprendre / Cadrer / Concevoir et développer / Préparer la mise en ligne) — plus précis que la version Stitch.
- **Les 3 textes de capacités** (Comprendre le métier / Concevoir le produit / Développer et lancer).
- **Le bloc fondateur** : `rahime-about.jpeg`, nom, mention Dakar, principe du pilotage direct.
- **Les coordonnées** : `contact@solvix.com`, WhatsApp `+221 77 677 87 47`, « Dakar, Sénégal ».
- **Les 4 pages légales** et leurs contenus (elles sont en ligne et indexées par les moteurs malgré `noindex`).

### 17.4 Assets utiles

| Asset | Usage |
|---|---|
| `assets/images/projets/*.jpeg` (6) | Captures projets — à **optimiser**, pas à remplacer |
| `assets/images/rahime-about.jpeg` | Portrait fondateur — à recompresser |
| `assets/typo/Plus_Jakarta_Sans/` | **Complet** : variable + 10 poids statiques + italiques + `OFL.txt` |
| `assets/new-brand/solvix_design_system/DESIGN.md` | Spec de référence |
| `assets/new-brand/*/screen.png` | Références visuelles pour la comparaison étape par étape |
| `assets/new-brand/*/code.html` | Références de **valeurs** (tokens, textes, structure) — **pas à copier** |

### 17.5 Infrastructure

- `netlify.toml` — conserver la politique de cache des images ; **revoir `/*.css` et `/*.js`** (voir §16.3-13).
- Le fait que le site soit **100 % statique sans build ni dépendance** : c'est un avantage (déploiement instantané, zéro surface d'attaque, zéro maintenance). **À préserver.**
- Zéro analytics, zéro script tiers, zéro tracking : **à préserver**.

---

## 18. À reconstruire / adapter

### 18.1 Fondations (préalables)

| Élément | Action |
|---|---|
| **Logo « X » en SVG** | Reconstruire (le CDN Stitch est éphémère). Fournir : version SVG symbol, version favicon, version PNG optimisée. **Bloquant pour tout le reste.** |
| **Bloc `:root` de variables** | Réécrire : `#FFFFFF` / `#F0F0F0` / `#333333` / `#FF6B4A` + `#333333` pour les variantes de surface. Supprimer le `:root` legacy. **Trancher la divergence DESIGN.md (M3 vs prose).** |
| **Échelle typographique** | 13 rôles `display-xl` → `label-sm` en Plus Jakarta Sans, auto-hébergée via `@font-face` sur les `.ttf` locaux. |
| **Suppression du CSS legacy** | ~1 650 lignes. **Attention : extraire d'abord `.legal-*` et `.merci-*`.** |
| **Suppression du JS mort** | `initScrollReveal()` + CSS `.reveal*`. |
| **Stratégie de cache** | Ne plus mettre `immutable` sur `/*.css` et `/*.js` non versionnés, ou versionner les fichiers. |

### 18.2 Composants à reconstruire

| Composant | Notes |
|---|---|
| **Header** | Classes unifiées, 5 liens, CTA « Parlons de votre projet », wordmark à trancher, état actif, ombre `0 1px 8px`, burger conservé. |
| **Footer** | Rang unique 3 parties + **rang de mentions légales conservé**. Variante claire partout. |
| **Boutons** | 3 variantes (primaire corail / secondaire anthracite / tertiaire blanc-bordure). Rayon 4px. **Hover sans translation verticale.** |
| **Inputs & champs** | 44px, bordure `#F0F0F0`, focus corail + ring 1px, labels, chips 24px radius 2px. |
| **Carte projet** | Rayon 8px (au lieu de `24px 7px`), `aspect-ratio` conservé, bordure `1px solid #F0F0F0`. |
| **Carte de solution** | `border-t-2` corail, rails `border-l-4`, numéro `01 / LABEL` en uppercase. |
| **Étapes de process** | Timeline verticale alternée, rail 2px, nœuds circulaires, pivot X. |
| **Chiffres ghost** | `01-04` en `display-xl` à 30 % d'opacité. |
| **Chiffres KPI** | Cartes « +68 % / 0 / 100 % ». |
| **Bloc d'index de filtres** (Projets) | 6 chips, état actif. **À implémenter en vrai ou en statique — décision à prendre.** |
| **Pastilles de sélection** (Contact) | 6 pastilles type de projet + 5 pastilles budget. **Accessibles au clavier**, `input` caché alimenté. |
| **Filigrane X** | 3 média possibles (SVG à deux diagonales, barres CSS croisées, glyphe `font-black` 280px). Choisir un composant unique. |

### 18.3 Pages à créer

| Page | Fichier | Contenu validé disponible |
|---|---|---|
| Solutions | `solutions.html` | 5 typologies + bandeau de preuve + 3 paires blocage/outil |
| Projets | `projets.html` | 6 projets (données existantes) + taxonomie + filtres + matrice problème/solution |
| Process | `process.html` | 4 étapes (textes existants) + cadence + timeline + principe |
| À propos | `a-propos.html` | Valeurs, diagramme SOLVIX CORRIDOR, 3 temps, portrait, signature |
| Contact | `contact.html` | Formulaire (2 champs à ajouter) + 3 cartes d'info + réassurance |

`index.html` devient la **homepage** uniquement (Hero → Promesse → Aperçu solutions → Réalisations → CTA).

### 18.4 À adapter (pas reconstruire)

| Élément | Adaptation |
|---|---|
| `merci.html` | Nouveau style, **même fonctionnement**. |
| 4 pages légales | Nouveau header/footer, `legal-*` conservé ou refactorisé, `<title>` + `description` + canonical. |
| `main.js` | Nouveau contrat d'ID, ajout du menu actif au scroll, ajout de la logique des pastilles, ajout d'un système de reveals propre. |
| `netlify.toml` | Politique de cache corrigée. |
| `assets/logo.png` | Optimiser (145 Ko → < 20 Ko) et convertir en SVG. |

### 18.5 Images

| Action | Détail |
|---|---|
| Convertir en WebP/AVIF | Les 7 images utilisées |
| Recompresser | Objectif < 100 Ko par capture |
| Ajouter `width`/`height` | Sur toutes les `<img>` |
| Ajouter `srcset`/`sizes` | Responsive |
| Nettoyer | 6 images inutilisées + `rahime-hero.PNG` (**après confirmation** qu'aucune n'est prévue pour la refonte) |
| Image OG dédiée | 1200×630, < 300 Ko, URL absolue |
| `logo.png` | Vectoriser |

---

## 19. Plan de refonte

12 étapes, **une par une**. Cycle constant à chaque étape :

> **implémentation → aperçu → comparaison avec Stitch → corrections → validation → étape suivante**

Aucune refonte massive. Chaque étape produit un livrable reviewable.

### Étape 1 — Fondations du design system

- Créer `docs/` (fait) et l'arborescence cible.
- **Trancher la divergence `DESIGN.md`** (tokens M3 du frontmatter vs prose `#FFFFFF`/`#333333`/`#FF6B4A`/`#F0F0F0`). Décision à documenter.
- Extraire et documenter le jeu de tokens définitif (couleurs, typo, espacements, rayons, ombres, grille).
- **Reconstruire le logo « X » en SVG** (favicon + version complète). Remplace `solvix-prism.svg` / `solvix-prism-social.svg` / `logo.png`.
- Définir la stratégie de fichiers (naming, Feather : `tokens.css` / `base.css` / `components.css` / `layout.css` / `pages.css`, ou un seul `style.css` réécrit — à trancher ici).
- **Livrable :** un document de décision + le logo SVG + la structure de fichiers vide prête à l'emploi.
- **Validation :** logo affiché correctement en haut à toutes les tailles ; aucun CDN externe.

### Étape 2 — Typographie + couleurs + variables CSS

- Auto-héberger Plus Jakarta Sans via `@font-face` (`static/` ou la variable) — supprimer Google Fonts.
- Écrire le `:root` définitif. **Supprimer le `:root` legacy.**
- Écrire l'échelle typographique (13 rôles) + les règles de contraste AAA.
- Écrire l'échelle de couleurs + la règle 60/30/10.
- Reset minimal propre (`box-sizing`, marges, `img`).
- **Livrable :** variables + typo + reset en place, visibles dans le navigateur.
- **Validation :** Plus Jakarta Sans s'affiche sans requêtes externes ; toutes les combinaisons de couleur/texte passent AAA ; `nettify`/DevTools : 0 requête `fonts.googleapis.com`.

### Étape 3 — Header + Footer

- **D'abord** : décider et implémenter un contrat d'ID explicite pour le header, corriger `initBurgerMenu()` en conséquence. ⚠️ **Préalable obligatoire, sinon les pages satellites cassent.**
- Construire les 5 liens de navigation + CTA « Parlons de votre projet ».
- Footer : rang unique 3 parties + rang de mentions légales.
- État actif du lien courant.
- Burger : focus trap, `inert` sur le contenu, fermeture au clic extérieur, `max-height` + scroll.
- Appliquer sur **les 6 pages** (header/footer/statut actif).
- `scroll-margin-top` sur toutes les sections.
- **Livrable :** navigation fonctionnelle sur les 6 pages, desktop + mobile.
- **Validation :** navigation au clavier complète, menu mobile au clavier, aucun décalage visuel, le logo s'affiche partout.

### Étape 4 — Homepage

- 5 sections : Hero → Promesse (`01 //`) → Aperçu solutions (`02 //`) → Réalisations (`03 //`) → CTA final (`04 //`).
- Tri-fold du hero avec pivot X central + KPI.
- Reprendre la copywriting existante (validée) + les textes Stitch.
- **Livrable :** homepage conforme à la maquette.
- **Validation :** comparaison pixel à pixel avec `new-brand/…_homepage/screen.png`.

### Étape 5 — Solutions

- Nouvelle page, 5 typologies, bandeau de preuve, bloc problème → outil, CTA.
- Réutiliser la section `#expertise` comme base de l'« Aperçu des solutions » de la homepage.
- **Livrable :** page conforme à la maquette.
- **Validation :** comparaison avec `…_solutions/screen.png` ; responsive 4/8/12 colonnes.

### Étape 6 — Projets

- Nouvelle page, toutes les données existantes conservées.
- Layout éditorial asymétrique, mise en avant JOKKO Events, taxonomie, filtres, matrice problème/solution.
- Optimiser les 6 captures (WebP + `srcset` + dimensions) **à cette étape** — c'est la page la plus lourde.
- **Livrable :** page conforme à la maquette, images optimisées.
- **Validation :** comparaison avec `…_projets/screen.png` ; poids de la page < 800 Ko.

### Étape 7 — Process

- Nouvelle page, timeline verticale alternée, cadence hero, principe fondateur, **X comme pivot**.
- Intégrer les 4 textes d'étapes existants.
- **Livrable :** page conforme à la maquette.
- **Validation :** comparaison avec `…_process/screen.png` ; timeline correcte à toutes les largeurs.

### Étape 8 — À propos

- Nouvelle page, diagramme « SOLVIX CORRIDOR », 3 temps, portrait optimisé, bande signature.
- **Livrable :** page conforme à la maquette.
- **Validation :** comparaison avec `…_propos/screen.png`.

### Étape 9 — Contact

- Nouvelle page : formulaire redessiné (44px, focus corail) + **sélecteurs à pastilles** (type de projet, budget) accessibles au clavier.
- **Préserver à la lettre** : `name="contact"`, `method="POST"`, `data-netlify="true"`, `action="/merci.html"`, `form-name`, formulaire `netlify hidden`.
- **Ajouter** le champ `bot-field` pour activer le honeypot.
- **Ne pas reprendre** le `onsubmit` simulé de la maquette.
- **Livrable :** page conforme + formulaire fonctionnel.
- **Validation :** soumission réelle testée sur Netlify avec email reçu ; le formulaire caché est cohérent avec le visible ; test au clavier des pastilles.

### Étape 10 — Responsive

- Un seul jeu de breakpoints : `1200 / 992 / 768 / 480` (à aligner sur la grille 12/8/4 de `DESIGN.md`).
- Vérifier les **6 pages** en 4 largeurs (1440 / 1024 / 768 / 375).
- Corriger les risques identifiés : grille projets à 480px, hero 761-960px, panneau mobile scrollable, `< 1.5 Mo` de LCP.
- **Livrable :** aucune coupure ni débordement sur aucune des 6 pages × 4 largeurs.
- **Validation :** navigation au clavier sur mobile réel ; test avec le clavier virtuel ouvert.

### Étape 11 — SEO

- `robots.txt` + `sitemap.xml`.
- `rel="canonical"` sur les 8 pages.
- Open Graph complet + **URL absolues** + `og:url` + image 1200×630 dédiée.
- Twitter Card complet.
- `theme-color` mis à jour.
- `meta description` ≤ 155 caractères.
- **Données structurées** : `Organization`, `WebSite`, `Person`, `LocalBusiness`, `BreadcrumbList`.
- Favicon (nouveau logo) + `apple-touch-icon` + `manifest`.
- Trancher le domaine de référence (`solvix.com` vs `.io` vs `.sn`).
- **Livrable :** validation complète (Search Console / validator schema.org).
- **Validation :** aucun `noindex` sur les 6 pages publiques ; les 4 pages légales restent `noindex` ; rich snippet affiché.

### Étape 12 — QA finale

- Audit a11y complet (axe, Lighthouse, contraste AAA).
- Audit performance (Lighthouse, poids des pages, requêtes réseau).
- Vérification de la soumission du formulaire en conditions réelles.
- Nettoyage : `.DS_Store`, images inutilisées, `solvix-website-build.md`, `identite-*.html`, `.gitignore`.
- `netlify.toml` : cache corrigé, en-têtes de sécurité (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).
- Vérification du rollback (cache `immutable`).
- **Livrable :** site en production, conforme aux maquettes, performant, accessible, sécurisé.

---

## Annexe — Points à trancher avant de commencer

Ces décisions bloquent l'étape 1 ou 2 :

1. **Palette** : tokens M3 du frontmatter `DESIGN.md` (`#f9f9f9`/`#ae3115`) ou prose (`#FFFFFF`/`#333333`/`#FF6B4A`/`#F0F0F0`) ? → **La prose est cohérente avec les maquettes.**
2. **Domaine / email de référence** : `solvix.com` (pages légales), `solvix.io` ou `solvix.sn` (maquettes) ?
3. **Casse du wordmark** : `SOLVIX` uppercase ou `Solvix` ? (3 maquettes pour chaque).
4. **CTA** : « Parler de votre projet » ou « Parlons de votre projet » ?
5. **Hauteur du header** : 76px (actuel) ou 80px (maquettes) ? `sticky` ou `fixed` ?
6. **Footer** : clair partout, ou variante sombre sur Projets ?
7. **Avatar** dans le header : à garder ou à retirer ?
8. **Chiffres marketing** des maquettes (`< 0.8s`, `-90 %`, `+68 %`, `100 % adoption`) : vérifiables ou à amender ?
9. **Filtres de la page Projets** : fonctionnels (JS) ou statiques (visuels seuls) ?
10. **Budget** en pastilles fermées ou champ libre conservé ?
11. **Structure des fichiers CSS** : un seul `style.css` réécrit, ou plusieurs fichiers ?
12. **Logo** : quel fichier source pour le SVG du « X » (`logo.png` vectorisé, ou reconstruction depuis les maquettes) ?

---

*Fin de l'audit. Aucun fichier existant n'a été modifié, supprimé ou renommé. Aucune dépendance n'a été installée. Aucun code n'a été refactorisé. La refonte n'a pas commencé.*

