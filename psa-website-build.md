# PSA Website — Build Instructions
**Projet** : Site one-page Problem Solving Agency (personal branding)  
**Stack** : HTML + CSS + JS vanilla uniquement — zéro framework, zéro dépendance  
**Hébergement cible** : Netlify  
**Workflow** : Chaque étape = STOP → validation → étape suivante  

---

## RÈGLES ABSOLUES (ne jamais déroger)

- Un seul fichier HTML (`index.html`), un fichier CSS (`style.css`), un fichier JS (`main.js`)
- Aucun framework (pas de React, Vue, Tailwind, Bootstrap)
- Aucune dépendance npm — le site doit s'ouvrir en double-cliquant sur `index.html`
- Mobile-first — chaque section doit être vérifiée sur 375px de large
- Pas d'animations lourdes — transitions légères uniquement (opacity, transform)
- Se baser sur le wireframe de référence situé dans `assets/design/design-model/`
- Toujours commit après validation d'une étape, jamais pendant

---

## STRUCTURE DES FICHIERS (respecter exactement)

```
problem-solving-agency/
│
├── index.html
├── style.css
├── main.js
├── psa-website-build.md
│
└── assets/
    ├── design/
    │   └── design-model/          ← wireframe de référence Claude Design
    │       ├── assets/
    │       ├── uploads/
    │       └── Problem Solving Ag...html   ← ouvrir ce fichier comme référence visuelle
    │
    └── images/
        ├── rahime-hero.PNG        ← photo principale (casse exacte : .PNG majuscule)
        ├── rahime-about.JPG       ← photo secondaire (casse exacte : .JPG majuscule)
        └── projets/
            ├── billio.png
            ├── cle-de-la-reussite.png
            ├── darling-body.png
            ├── jokkoevents.png
            ├── lettouna.png
            ├── matvilla.png
            ├── mytima-love.png
            ├── mohamigroup.png
            ├── rekrut-rh.png
            ├── samadesk.png
            └── samaprof.png
```

> ⚠️ Respecter exactement la casse des noms de fichiers images (PNG et JPG en majuscule pour les photos du fondateur)

---

## PALETTE & TYPOGRAPHIE

```css
/* Couleurs */
--color-bg: #FFFFFF;
--color-bg-alt: #F7F7F7;
--color-text: #0F0F0F;
--color-text-light: #6B7280;
--color-accent: #4A90D9;
--color-accent-dark: #2C6FAC;
--color-border: #E5E7EB;

/* Typographie — Google Fonts */
--font-display: 'Sora', sans-serif;
--font-body: 'DM Sans', sans-serif;
```

Import dans le `<head>` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
```

---

## RÉFÉRENCE VISUELLE

Ouvrir `assets/design/design-model/Problem Solving Ag....html` dans le navigateur avant de coder.  
Ce fichier est le wireframe exporté depuis Claude Design — c'est la référence principale pour la disposition, les proportions et l'ordre des sections. Ne pas inventer de layout, s'y conformer.

---

## ÉTAPE 1 — Structure HTML de base + Navigation

**Ce qu'il faut faire :**
1. Créer `index.html` avec doctype et balises meta SEO complètes
2. Importer Google Fonts (Sora + DM Sans)
3. Lier `style.css` et `main.js`
4. Navbar fixe avec :
   - Logo gauche : **"Problem Solving Agency"** uniquement (pas de sous-titre — le nom du fondateur apparaît ailleurs sur le site)
   - Liens droite : À propos · Services · Réalisations · Contact
   - Bouton CTA "Travaillons ensemble" (fond `#4A90D9`, texte blanc)
   - Menu burger pour mobile (toggle JS dans main.js)
5. 6 sections vides avec ID : `#hero` `#about` `#services` `#projects` `#testimonials` `#contact`
6. Footer minimaliste (fond `#0F0F0F`, texte blanc)
7. `style.css` : variables CSS + reset de base (margin 0, box-sizing border-box)
8. `main.js` : commentaire de structure des fonctions à venir

**Critères de validation :**
- [ ] Navbar visible et fixe au scroll
- [ ] Menu burger visible sur 375px
- [ ] Scroll smooth entre les ancres
- [ ] Aucune erreur console
- [ ] Fichier ouvert sans serveur local

**→ STOP. Attendre validation avant l'étape 2.**

---

## ÉTAPE 2 — Section HERO

**Ce qu'il faut faire :**
1. Layout desktop : photo gauche (55%) + texte droite (45%), hauteur 100vh
2. Photo : `assets/images/rahime-hero.PNG` — object-fit cover, hauteur 100%
3. Texte :
   ```
   Headline   : "Je construis les produits digitaux qui font avancer votre business."
   Sous-titre : "Développeur & fondateur de PSA — je transforme vos idées en solutions
                 concrètes, de Dakar pour l'Afrique et au-delà."
   CTA 1      : "Voir mes réalisations" → #projects (bouton plein bleu)
   CTA 2      : "Me contacter" → #contact (bouton outline bleu)
   ```
4. Chiffres clés sous les CTA (séparés par `|`) :
   - `10+` Projets livrés · `500+` Personnes formées · `5+ ans` d'expérience
5. Mobile : photo pleine largeur 45vh en haut, texte en dessous

**Hauteur hero (desktop) — ne pas dépasser 100vh :**
```css
#hero {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.hero-image {
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
```
> La navbar est en `position: fixed` : ne pas ajouter de `padding-top` sur `main` qui s'additionne au `100vh` (sinon scroll forcé).

**Critères de validation :**
- [ ] Hero occupe 100vh sur desktop (sans scroll vertical sur la première vue)
- [ ] Photo cadrée proprement sur la partie haute
- [ ] 2 CTA visibles et cliquables
- [ ] Chiffres clés alignés
- [ ] Mobile correct

**→ STOP. Attendre validation avant l'étape 3.**

---

## ÉTAPE 3 — Section À PROPOS

**Ce qu'il faut faire :**
1. Fond `#F7F7F7`
2. Layout desktop : texte gauche (55%), photo droite (45%)
3. Étiquette : "À propos" (couleur `#4A90D9`, uppercase, small, lettre-spacing)
4. Titre : **"Bâtisseur de solutions digitales, formateur, entrepreneur."**
5. Texte :
   ```
   Développeur depuis plus de 5 ans, j'ai fondé Problem Solving Agency en 2025
   à Dakar avec une conviction simple : la technologie doit résoudre des problèmes
   réels. Depuis, j'ai livré des SaaS, des applications métier et formé plus de
   500 personnes aux outils du numérique — de Dakar pour l'Afrique et au-delà.
   ```
6. 3 piliers sous le texte (icône SVG inline + label) :
   - Développement sur mesure
   - Automatisation & IA
   - Formation digitale
7. Photo `assets/images/rahime-about.JPG` avec carré bleu `#4A90D9` décalé derrière (position absolute)
8. Mobile : une colonne, photo en dessous

**Critères de validation :**
- [ ] Section lisible et bien espacée
- [ ] Carré bleu décoratif visible derrière la photo
- [ ] 3 piliers alignés proprement
- [ ] Mobile correct

**→ STOP. Attendre validation avant l'étape 4.**

---

## ÉTAPE 4 — Section SERVICES

**Ce qu'il faut faire :**
1. Fond blanc
2. Titre centré : **"Ce que je peux faire pour vous"**
3. Sous-titre centré : "Des solutions concrètes, livrées sérieusement."
4. 3 cartes en grille (border-radius 12px, box-shadow légère) :

   **Carte 1 — Développement Web & SaaS**
   - Icône SVG : fenêtre de navigateur / code
   - Texte : "Sites vitrines, plateformes SaaS, applications métier — je code des produits qui fonctionnent et qui tiennent dans le temps."
   - Pills : `Next.js` · `Supabase` · `Netlify`

   **Carte 2 — Automatisation & IA**
   - Icône SVG : engrenage ou éclair
   - Texte : "Bots WhatsApp, pipelines automatisés, intégration d'IA — j'automatise les tâches répétitives pour que vous vous concentriez sur l'essentiel."
   - Pills : `Claude AI` · `API` · `WhatsApp`

   **Carte 3 — Formation & Coaching Digital**
   - Icône SVG : livre ou diplôme
   - Texte : "Formations pratiques pour entrepreneurs et équipes — HTML/CSS, outils IA, gestion de projet digital. 500+ apprenants depuis 2022."
   - Pills : `Présentiel` · `En ligne` · `Sur mesure`

5. Hover carte : élévation légère + bordure gauche `#4A90D9` (4px)

**Critères de validation :**
- [ ] 3 cartes alignées sur desktop
- [ ] Hover visible et fluide
- [ ] Pills en petites capsules grises
- [ ] Mobile : cartes empilées

**→ STOP. Attendre validation avant l'étape 5.**

---

## ÉTAPE 5 — Section RÉALISATIONS

**Ce qu'il faut faire :**
1. Fond `#F7F7F7`
2. Titre : **"Projets réalisés"**
3. Sous-titre : "Des produits réels, pour des clients réels."
4. Grille : 3 colonnes desktop / 2 colonnes tablette / 1 colonne mobile

**Structure HTML d'une carte :**
```html
<div class="project-card">
  <div class="project-image">
    <img src="assets/images/projets/[fichier]" alt="[Nom]" loading="lazy">
    <div class="project-overlay">
      <a href="[url]" target="_blank" rel="noopener" class="project-link">
        Voir le projet ↗
      </a>
    </div>
  </div>
  <div class="project-info">
    <span class="project-category">[Catégorie]</span>
    <h3>[Nom]</h3>
    <p>[Description courte]</p>
    <div class="project-stack">[Tech 1] · [Tech 2]</div>
  </div>
</div>
```

**11 projets à intégrer :**

| Fichier | Nom affiché | URL | Catégorie | Description | Stack |
|---|---|---|---|---|---|
| `billio.png` | Billio | https://billio-sn.netlify.app | SaaS | Facturation et gestion commerciale pour entrepreneurs africains | Next.js · Supabase · PayTech |
| `samadesk.png` | SamaDesk | https://samadesk.netlify.app | SaaS | Plateforme e-commerce de vente de bureaux et mobilier professionnel en ligne | Next.js · Supabase · Netlify |
| `rekrut-rh.png` | Rekrut RH | https://rekrut-rh.netlify.app | SaaS IA | Recrutement assisté par IA — génération de fiches de poste, analyse de CV | Next.js · Groq · Gemini · Supabase |
| `samaprof.png` | SamaProf | https://samaprof.netlify.app | EdTech | Coaching académique IA pour étudiants en informatique au Sénégal | Next.js · Groq · Supabase |
| `jokkoevents.png` | JOKKO Events | https://jokkoevents.com | Plateforme | Gestion d'événements pour organisateurs — billetterie et suivi en temps réel | Next.js · Prisma · Supabase |
| `lettouna.png` | Lettouna | https://lettouna.com | Application | Réservation de coiffeuses à domicile à Dakar avec paiement et notifications WhatsApp | Next.js · PayDunya · WhatsApp API |
| `matvilla.png` | Mat Villa | https://matvilla.com | Site vitrine | BTP et peinture LUMINA — présentation de services et réalisations | HTML · CSS · Netlify |
| `mytima-love.png` | Tima Love | https://mytimalove.com | Site vitrine | Site de rencontre sérieuse — mise en relation et profils pour trouver l'âme sœur | Next.js · Netlify |
| `darling-body.png` | Darling Body | https://darlingbody.com | E-commerce | Boutique en ligne de produits bien-être et minceur pour femmes | HTML · CSS · JS |
| `cle-de-la-reussite.png` | Clés de la Réussite | https://clesdelareussitevae.com | Formation | Plateforme de formation VAE pour professionnels de santé en France | HTML · CSS · JS |
| `mohamigroup.png` | MOH AMI Group | https://mohamigroup.com | Site vitrine | Équipement technologique pour institutions au Sénégal — infrastructure, fiabilité et performance sans compromis. | HTML · CSS · JS |

5. Hover image : overlay sombre + bouton "Voir le projet ↗" centré
6. Ratio image : 16/9 fixe, object-fit cover

**Critères de validation :**
- [ ] 11 projets affichés
- [ ] Hover + lien fonctionnel sur chaque carte
- [ ] Noms de fichiers exactement respectés
- [ ] Liens s'ouvrent dans un nouvel onglet
- [ ] Mobile : 1 colonne, lisible

**→ STOP. Attendre validation avant l'étape 6.**

---

## ÉTAPE 6 — Témoignages + Contact + Footer

### 6A — Section TÉMOIGNAGES
1. Fond blanc
2. Titre : **"Ce que disent mes clients"**
3. 3 cartes, style : bordure gauche 4px bleu `#4A90D9`, ombre légère, guillemets décoratifs
4. Placeholder si pas encore de vrais témoignages :
   ```
   "Abdourahime a livré notre plateforme dans les délais avec une qualité irréprochable."
   — Prénom N. · Rôle, Entreprise
   ```

### 6B — Section CONTACT
1. Fond `#F7F7F7`
2. Titre : **"Vous avez un projet ? Parlons-en."**
3. Sous-titre : "Je réponds sous 24h."
4. Desktop : formulaire gauche + infos contact droite

**Formulaire Netlify :**
```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <input type="text" name="nom" placeholder="Votre nom complet" required>
  <input type="email" name="email" placeholder="Votre email" required>
  <textarea name="projet" rows="4" placeholder="Décrivez votre projet..." required></textarea>
  <button type="submit">Envoyer le message</button>
</form>
```

**Infos contact :**
- 📱 WhatsApp : `https://wa.me/221XXXXXXXXX` ← remplacer par le vrai numéro
- 📧 Email : lien mailto avec l'adresse PSA
- 📍 Dakar, Sénégal

### 6C — Footer
1. Fond `#0F0F0F`, texte `#FFFFFF`
2. 3 colonnes desktop :
   - Gauche : "Abdourahime SY" + "Problem Solving Agency"
   - Centre : liens rapides
   - Droite : icônes LinkedIn + WhatsApp
3. Bas : `© 2025 Problem Solving Agency. Dakar, Sénégal.`
4. Mobile : 1 colonne

**Critères de validation :**
- [ ] `data-netlify="true"` présent sur le form
- [ ] Liens WhatsApp et email fonctionnels
- [ ] Footer responsive
- [ ] Aucune erreur console sur toute la page

**→ STOP. Validation complète de la page entière.**

---

## ÉTAPE 7 — Finitions & Performance

**Ce qu'il faut faire :**

1. **Scroll smooth** dans style.css :
   ```css
   html { scroll-behavior: smooth; }
   ```

2. **Navbar active state** dans main.js — IntersectionObserver pour surligner le lien actif

3. **Animations d'entrée** dans main.js — IntersectionObserver : fade-in + translateY(20px → 0) au scroll
   ```css
   .section-hidden { opacity: 0; transform: translateY(20px); transition: opacity 0.5s, transform 0.5s; }
   .section-visible { opacity: 1; transform: translateY(0); }
   ```

4. **Meta SEO** dans le `<head>` :
   ```html
   <title>Abdourahime SY — Développeur & Fondateur PSA | Dakar, Sénégal</title>
   <meta name="description" content="Problem Solving Agency — développement web, SaaS et automatisation pour entrepreneurs et PME en Afrique francophone. Basé à Dakar, Sénégal.">
   <meta name="author" content="Abdourahime SY">
   <meta property="og:title" content="Abdourahime SY — Problem Solving Agency">
   <meta property="og:description" content="Je construis les produits digitaux qui font avancer votre business.">
   <meta property="og:image" content="assets/images/rahime-hero.PNG">
   <meta property="og:type" content="website">
   ```

5. **Favicon SVG** dans `<head>` :
   ```html
   <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%234A90D9'/><text y='.9em' font-size='60' x='50%' text-anchor='middle' fill='white' font-family='sans-serif'>AS</text></svg>">
   ```

6. **Performance** :
   - `loading="lazy"` sur toutes les images sauf `rahime-hero.PNG`
   - Tous les `alt` remplis
   - Google Fonts avec `display=swap` (déjà inclus dans l'URL)

7. **Test final** : DevTools Chrome → mobile 375px → vérifier chaque section

**Critères de validation :**
- [ ] Animations d'entrée fluides, pas de saccade
- [ ] Lien nav actif mis à jour au scroll
- [ ] Toutes les images avec `alt`
- [ ] Favicon "AS" visible dans l'onglet du navigateur
- [ ] Aucune erreur console
- [ ] Site navigable et lisible sur 375px

**→ STOP. Validation finale avant déploiement.**

---

## ÉTAPE 8 — Push GitHub + Déploiement Netlify

### Git
```bash
git add .
git commit -m "✨ Init : site PSA one-page complet"
git push origin main
```

**Convention de commit pour ce projet :**
```
<emoji> <Zone> : <description courte FR> (max 80 chars)

✨ Hero : ajout section hero avec photo et CTA
🎨 Style : palette couleurs et typographie
🐛 Nav : correction menu burger mobile
🔧 Config : configuration Netlify Forms
⚡ Perf : lazy loading images projets
🔒 Sécu : attributs rel="noopener" sur liens externes
```

### Netlify
1. netlify.com → "Add new site" → "Import an existing project" → GitHub
2. Sélectionner le repo `problem-solving-agency`
3. Build command : *(vide)*
4. Publish directory : `.`
5. Déployer
6. Vérifier Netlify → **Forms** : le formulaire "contact" doit apparaître
7. Faire un test de soumission en production

### Domaine (quand disponible)
- Netlify → Domain settings → Add custom domain
- Pointer les DNS du registrar vers Netlify

**Critères de validation :**
- [ ] Site accessible sur `*.netlify.app`
- [ ] Formulaire "contact" visible dans Netlify Forms
- [ ] Test soumission reçu
- [ ] Chargement < 3s sur mobile
- [ ] Aucun asset en erreur 404

**→ SITE EN LIGNE. Mission accomplie.**

---

## RÉSUMÉ

| # | Étape | Contenu |
|---|-------|---------|
| 1 | Structure + Nav | HTML, navbar, sections vides, footer |
| 2 | Hero | Photo + headline + CTA + chiffres clés |
| 3 | À propos | Texte + photo décorée + 3 piliers |
| 4 | Services | 3 cartes avec icônes, texte, pills |
| 5 | Réalisations | Grille 11 projets avec liens externes |
| 6 | Contact + Footer | Formulaire Netlify + infos + footer noir |
| 7 | Finitions | Animations, SEO, favicon, performance |
| 8 | Déploiement | Git push + Netlify + test production |

**Stack** : HTML · CSS · JS Vanilla · Netlify Forms  
**Référence design** : `assets/design/design-model/`  
**Photos fondateur** : `assets/images/rahime-hero.PNG` + `assets/images/rahime-about.JPG`  
**Images projets** : `assets/images/projets/`

---

*Build file — Problem Solving Agency*  
*Abdourahime SY — Dakar, Sénégal*