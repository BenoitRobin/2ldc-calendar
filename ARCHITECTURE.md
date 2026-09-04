# Architecture technique — 2LDC Calendar

Ce document fige les choix techniques retenus pour l'application décrite dans `PRD.md` (connexion, calendrier d'évènements, réponses de présence, espace admin). Il complète la Phase 2 du PRD ("Choix d'architecture") avec des outils concrets.

## Vue d'ensemble

| Couche | Choix |
|---|---|
| Framework | SvelteKit (TypeScript) |
| Base de données | Turso (libSQL / SQLite) |
| ORM | Drizzle ORM |
| Authentification | better-auth |
| UI | Tailwind CSS + shadcn-svelte |
| Hébergement | Vercel (plan Hobby, usage personnel/associatif) |
| Tests e2e | Playwright (local/manuel) |
| Gestionnaire de paquets | pnpm |

Coût d'hébergement visé : 0€/mois, tous les paliers gratuits ci-dessus étant largement suffisants pour une équipe de quelques dizaines de personnes.

## Framework — SvelteKit

- Routing par fichiers (`src/routes`), logique serveur colocalisée via `+page.server.ts` (formulaires/actions) et `+server.ts` (endpoints ponctuels), pas de backend séparé.
- Déploiement via `@sveltejs/adapter-vercel` en mode par défaut (fonctions serverless standard, pas d'edge sauf besoin identifié plus tard).
- Protection des zones par rôle dans `src/hooks.server.ts` (vérification de session/rôle avant de servir une route `/admin/**`), jamais uniquement en cachant des éléments d'UI — conforme à la Phase 5 du PRD.

## Base de données — Turso

- Base libSQL (fork SQLite) hébergée sur Turso, palier gratuit (5 Go, 100 bases) largement suffisant.
- Connexion via `@libsql/client` en mode client distant simple, sans réplicas embarqués (embedded replicas) dans un premier temps — complexité inutile à cette échelle, à reconsidérer seulement si la latence perçue devient un problème réel.
- Une base locale (fichier SQLite via le même client) pour le développement, pour ne pas dépendre d'un compte Turso dès le début du projet — conforme à la Phase 3 du PRD.

### ORM — Drizzle ORM

- Schéma TypeScript unique (`src/lib/server/db/schema.ts`), migrations via `drizzle-kit`.
- Choisi pour son typage de bout en bout et sa compatibilité native avec Turso/libSQL et avec l'adaptateur Drizzle de better-auth (une seule définition de schéma pour les tables applicatives et les tables d'auth).

## Authentification — better-auth

- Méthode email + mot de passe côté better-auth (pas d'OAuth ni de 2FA — non nécessaire pour une petite équipe), mais la **connexion se fait avec le prénom**, pas l'email : l'email reste stocké (identité interne better-auth) mais n'est jamais saisi par les membres.
- Comptes créés uniquement par un admin (auto-inscription désactivée) ; l'admin choisit et transmet lui-même le mot de passe du nouveau membre — pas de flux de réinitialisation par email.
- Session par cookie géré par la librairie (hachage des mots de passe, création/expiration de session, protection CSRF intégrée), branché sur SvelteKit via son adaptateur officiel.
- Tables `users` (avec champ de rôle standard/admin) et `sessions` générées par l'adaptateur Drizzle de better-auth, dans le même schéma que les données applicatives.
- Premier compte admin créé par un script one-shot (pas d'interface de gestion des comptes au tout début), comme prévu Phase 5 du PRD.

## UI — Tailwind CSS + shadcn-svelte

- shadcn-svelte : composants copiés directement dans le repo (pas une dépendance npm classique), construits sur Bits UI, stylés avec Tailwind CSS.
- Tokens de couleur centralisés (variables CSS / config Tailwind) pour les statuts métier (oui / non / indécis / pas de réponse), jamais de couleur codée en dur dans un composant — conforme à la Phase 6 du PRD.
- Navigation basse (bottom nav) pour les écrans utilisateur standard (usage mobile quotidien), navigation classique en haut pour l'espace admin (usage desktop occasionnel).

## Tests — Playwright

- `@playwright/test` pour les tests e2e des parcours critiques : connexion/déconnexion, redirection selon le rôle, réponse de présence à un évènement, actions CRUD admin (y compris les cas d'auto-verrouillage de la Phase 8 du PRD).
- Lancés localement/manuellement pendant le développement, en complément du test en navigateur déjà prévu à la Phase 7 du PRD — pas de CI pour l'instant.
- Utilisent des comptes et données jetables (créés puis nettoyés par le test), jamais de données réelles.

## Hébergement — Vercel

- Déploiement automatique à chaque push sur la branche principale, connecté au dépôt Git.
- Plan Hobby (gratuit) : usage confirmé comme personnel/associatif, donc conforme aux conditions d'utilisation de ce plan.
- Secrets (clé Turso, secret better-auth, etc.) uniquement dans les variables d'environnement Vercel — jamais commités. Un `.env.example` versionné liste les clés attendues, sans valeurs.

## Points laissés ouverts (non bloquants)

- **Nom de domaine personnalisé** : traité comme une étape séparée après le premier déploiement (Phase 12 du PRD), sur l'adresse `*.vercel.app` par défaut au départ.
- **Réplicas embarqués Turso** : à activer seulement si un besoin de latence plus faible apparaît en usage réel.
- **OAuth / 2FA** : non prévu au démarrage ; better-auth le permettrait d'ajouter plus tard sans changer d'outil si le besoin est exprimé.
- **CI GitHub Actions pour Playwright** : pas mise en place pour l'instant (tests lancés localement) ; à ajouter facilement plus tard si le besoin de sécurité avant déploiement se fait sentir.
