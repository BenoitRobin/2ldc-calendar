# 2LDC Calendar

Calendrier d'évènements partagé pour une petite équipe : connexion, calendrier commun, réponses de présence (oui/non/indécis), et espace d'administration. Voir `PRD.md` (méthodologie) et `ARCHITECTURE.md` (choix techniques) pour le contexte complet.

## Développement local

```sh
pnpm install
cp .env.example .env
```

Renseigner dans `.env` :

- `DATABASE_URL` — `file:local.db` suffit en local (aucun compte Turso requis)
- `BETTER_AUTH_SECRET` — une valeur aléatoire longue (ex: `openssl rand -hex 32`)
- `ORIGIN` — `http://localhost:5173` en local

`RESEND_API_KEY`/`RESEND_FROM_EMAIL` et `TURSO_AUTH_TOKEN` peuvent rester vides en local : les emails sont simplement affichés dans la console du serveur, et la base locale n'a pas besoin de jeton.

Appliquer le schéma puis créer le premier compte admin :

```sh
pnpm db:migrate
pnpm bootstrap:admin admin@exemple.fr "Prénom Nom"
```

Le lien pour choisir le mot de passe s'affiche dans la console (ou est envoyé par email si `RESEND_API_KEY` est configurée). Lancer ensuite `pnpm dev`.

## Déploiement (premières étapes à faire soi-même)

Ces comptes tiers doivent être créés par la personne propriétaire du projet, jamais par un agent :

1. **Turso** — créer une base de données, récupérer l'URL `libsql://...` et un jeton d'authentification.
2. **Resend** — créer un compte, vérifier un domaine d'envoi, générer une clé API.
3. **Vercel** — connecter le dépôt Git ; ajouter `DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `ORIGIN` (l'URL `*.vercel.app` fournie), `RESEND_API_KEY`, `RESEND_FROM_EMAIL` dans les variables d'environnement du projet.

Une fois déployé, appliquer le schéma sur la base de production (`pnpm db:migrate` avec les identifiants de prod) puis lancer `pnpm bootstrap:admin` une fois contre cet environnement pour créer le premier compte admin réel.

## Scripts utiles

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — vérification des types
- `pnpm lint` / `pnpm format`
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` — migrations Drizzle
- `pnpm bootstrap:admin <email> [nom]` — crée le premier compte admin (refuse si un admin existe déjà)
- `pnpm test:e2e` — tests Playwright
