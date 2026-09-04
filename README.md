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

`TURSO_AUTH_TOKEN` peut rester vide en local : la base locale n'a pas besoin de jeton.

Appliquer le schéma puis créer le premier compte admin (l'admin choisit lui-même le mot de passe du compte) :

```sh
pnpm db:migrate
pnpm bootstrap:admin admin@exemple.fr Prénom MotDePasse123
```

La connexion se fait ensuite avec ce prénom et ce mot de passe (pas l'email). Lancer ensuite `pnpm dev`.

## Déploiement (premières étapes à faire soi-même)

Ces comptes tiers doivent être créés par la personne propriétaire du projet, jamais par un agent :

1. **Turso** — créer une base de données, récupérer l'URL `libsql://...` et un jeton d'authentification.
2. **Vercel** — connecter le dépôt Git ; ajouter `DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `ORIGIN` (l'URL `*.vercel.app` fournie) dans les variables d'environnement du projet.

Une fois déployé, appliquer le schéma sur la base de production (`pnpm db:migrate` avec les identifiants de prod) puis lancer `pnpm bootstrap:admin` une fois contre cet environnement pour créer le premier compte admin réel.

## Scripts utiles

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — vérification des types
- `pnpm lint` / `pnpm format`
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` — migrations Drizzle
- `pnpm bootstrap:admin <email> <prénom> <mot de passe>` — crée le premier compte admin (refuse si un admin existe déjà)
- `pnpm seed:demo` — jeu de données de démo rejouable (musiciens + évènements)
- `pnpm test:e2e` — tests Playwright
