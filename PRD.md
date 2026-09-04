# Méthode de création d'une application web interne

Ce document décrit, étape par étape, la démarche suivie pour construire ce projet (une appli interne avec connexion, calendrier d'évènements, réponses de présence, et un espace d'administration). Il est volontairement indépendant de toute techno précise, pour être réutilisable avec une autre stack.

## 1. Cadrage initial

Avant d'écrire la moindre ligne de code :

- **Clarifier l'objectif et les utilisateurs** : qui utilise l'outil, sur quel usage principal (ici : usage mobile quotidien pour les utilisateurs standards, usage desktop occasionnel pour l'administration).
- **Lister les entités de données** avec leurs champs, en langage courant, sans se soucier du type de base de données. (ex. "un utilisateur a un nom, un rôle, un email, un mot de passe" / "un évènement a un nom, une date, un lieu, des horaires, une description").
- **Lister les fonctionnalités par rôle**, séparément (ex. "côté admin : créer un évènement, gérer les comptes" / "côté utilisateur standard : voir le calendrier, répondre à un évènement").
- **Identifier les décisions à prendre** plutôt que de les deviner : format d'authentification (nom, email, autre ?), sémantique exacte des statuts métier s'il y en a plusieurs proches (ex. distinguer "n'a pas répondu" de "a vu mais indécis"), canal de notification souhaité.
- **Faire trancher explicitement** chaque décision floue plutôt que de choisir à sa place quand ça change le comportement pour l'utilisateur final. Pour les décisions purement techniques (quel outil pour telle brique), proposer un choix par défaut argumenté et laisser la possibilité de le changer.
- **Évoquer le coût/hébergement dès le départ** si le projet doit rester gratuit ou pas cher — ça oriente les choix d'architecture (petite base de données suffisante, pas besoin de serveur dédié, etc.).

## 2. Choix d'architecture

Une fois le besoin clair, choisir une brique pour chaque couche, en expliquant le "pourquoi" en une phrase à chaque fois :

- Un framework front-end capable de gérer aussi la logique serveur (formulaires, routes protégées) sans backend séparé, si le projet est petit.
- Un système de stockage de données proportionné au volume réel (une petite base suffit largement pour une équipe de quelques dizaines de personnes).
- Une stratégie d'authentification simple et maîtrisée plutôt qu'un framework d'auth complet, si l'équipe est petite et les besoins basiques (session par cookie + mots de passe hachés suffisent).
- Un service d'email transactionnel externe si des notifications sont nécessaires, plutôt que de gérer soi-même l'envoi de mails.
- Une plateforme d'hébergement qui déploie directement depuis le dépôt de code, pour ne pas avoir à gérer de serveur.

Documenter ces choix dans un fichier de suivi partagé avec la personne pour qui on construit le projet, avec la possibilité de les remettre en cause facilement.

## 3. Amorçage du projet

- Générer le squelette du projet avec l'outil d'initialisation du framework choisi (structure de dossiers standard, configuration de base).
- Initialiser un dépôt de code source dès le départ, avec un premier commit du squelette.
- Créer le dépôt distant (hébergeur de code) et y pousser immédiatement, avant d'aller plus loin — ça évite de perdre du travail et ça permet de connecter l'hébergement dès que possible.
- Mettre en place le système de style/composants de base à ce stade plutôt que plus tard, pour ne pas avoir à tout reprendre.
- Initialiser la base de données de développement en local si l'outil le permet, pour ne pas dépendre tout de suite d'un compte externe.

## 4. Modèle de données

- Traduire les entités identifiées en Phase 1 en schéma concret (tables/collections, colonnes/champs, types, contraintes d'unicité, clés étrangères).
- Ajouter dès ce stade les tables techniques nécessaires à l'authentification (table des utilisateurs avec mot de passe haché et rôle, table des sessions).
- Appliquer le schéma d'abord sur une base locale/dev, jamais directement en production.
- Vérifier que le schéma correspond bien aux décisions prises en Phase 1 (ex. bien vérifier le nombre d'états distincts d'un statut métier, pas juste "oui/non").

## 5. Authentification et rôles

- Implémenter : hachage des mots de passe, création de session à la connexion, cookie de session, déconnexion.
- Mettre en place la protection des zones par rôle au niveau du routage (une zone accessible à tout utilisateur connecté, une zone réservée aux administrateurs), pas seulement en cachant des boutons dans l'interface.
- Prévoir un moyen de créer le tout premier compte administrateur avant que l'interface de gestion des comptes n'existe (un petit script à lancer une fois suffit).
- **Tester tout de suite le parcours complet** avec un compte jetable : connexion, redirection selon le rôle, déconnexion, accès refusé sans session — puis supprimer ce compte de test.
- Ne jamais choisir soi-même le mot de passe d'un compte réel à la place de la personne qui va s'en servir ; lui fournir la commande ou l'écran pour le faire elle-même.

## 6. Système de design et navigation

- Définir un petit nombre de composants réutilisables (bouton, carte, badge de statut) avant de construire les écrans, plutôt que de dupliquer des styles page par page.
- Si l'app a des statuts métier avec un code couleur (comme ici oui/non/indécis/pas de réponse), les définir comme des tokens de couleur centralisés, pas des couleurs codées en dur dans chaque composant.
- Construire la navigation principale en fonction de l'usage réel : navigation basse et pouces-friendly si l'usage est majoritairement mobile, navigation classique en haut si c'est un usage desktop (ex. l'espace admin).
- Vérifier visuellement sur un vrai gabarit mobile étroit dès cette étape, pas seulement à la fin du projet.

## 7. Boucle de développement d'une fonctionnalité

Pour chaque écran/fonctionnalité, répéter ce cycle plutôt que de tout construire d'un bloc :

1. Construire la lecture des données nécessaires à l'écran.
2. Construire l'interface d'affichage.
3. Construire l'écriture (formulaire ou action) seulement si l'écran en a réellement besoin.
4. Pour les interactions qui doivent sembler instantanées (ex. cocher une réponse), afficher le changement immédiatement dans l'interface avant confirmation du serveur, et revenir en arrière si l'enregistrement échoue.
5. **Tester avec des données jetables réalistes** : créer un jeu de données minimal, vérifier le comportement dans un navigateur (pas seulement en relisant le code), supprimer les données de test ensuite.
6. Vérifier qu'il n'y a pas d'erreur de type ni de style avant de continuer.
7. Committer et pousser cette fonctionnalité isolément, avec un message clair, avant de passer à la suivante.

Avancer fonctionnalité par fonctionnalité, dans un ordre qui suit les priorités métier (ce qui sera utilisé le plus souvent en premier), et faire valider chaque étape avant d'enchaîner sur la suivante plutôt que de tout construire puis présenter le résultat d'un coup.

## 8. Interfaces d'administration (CRUD)

- Pour chaque entité que les administrateurs doivent gérer : un écran de liste, un formulaire de création, un formulaire de modification, une action de suppression.
- Protéger toute action destructrice par une confirmation explicite.
- **Anticiper les cas d'auto-verrouillage** : un administrateur ne doit pas pouvoir supprimer son propre compte ni se retirer son propre rôle admin s'il est le seul — sinon plus personne ne peut administrer l'outil.
- Donner aux administrateurs un moyen de modifier manuellement les données que les utilisateurs saisissent normalement eux-mêmes (ex. la présence d'un utilisateur), pour les cas où une correction manuelle est nécessaire.

## 9. Vue d'ensemble / reporting

- Construire une vue matricielle ou récapitulative qui croise plusieurs entités (ex. utilisateurs × évènements) quand le besoin de vision globale existe.
- Réutiliser le même composant pour une version modifiable (admin) et une version lecture seule (utilisateur standard) plutôt que de dupliquer l'écran — un simple paramètre "modifiable oui/non" suffit généralement.
- Si la vue lecture seule expose des actions d'écriture réservées à un rôle, vérifier que l'action est bien bloquée côté serveur même si l'interface ne l'affiche pas (ne jamais compter uniquement sur le fait de cacher un bouton).

## 10. Intégrations tierces (notifications, etc.)

- Isoler chaque intégration externe (envoi d'email, etc.) derrière une fonction dédiée, pour que le reste de l'application n'ait pas à connaître le fournisseur utilisé.
- Prévoir un repli propre (ex. simple trace/log) quand les identifiants du service externe ne sont pas encore configurés, pour ne jamais bloquer le développement en attendant un compte externe.
- **Ne jamais créer de compte sur un service tiers à la place de la personne propriétaire du projet** (hébergement, base de données, email, etc.) — préparer le terrain et la documenter, mais laisser la création de compte et la récupération des identifiants à la personne elle-même.
- Une fois les identifiants fournis, les stocker uniquement dans la configuration d'environnement, jamais en dur dans le code ni dans un message.

## 11. Phase de qualité

Avant de considérer le projet prêt, repasser dessus spécifiquement pour :

- **Rejouer le parcours complet sur un vrai gabarit mobile**, pas seulement en réduisant une fenêtre de bureau.
- **Mesurer réellement le contraste des couleurs** utilisées pour du texte ou des statuts (calcul de contraste, pas une estimation à l'œil), et corriger celles qui ne passent pas un seuil d'accessibilité raisonnable.
- Vérifier la taille des zones cliquables/tactiles sur mobile.
- Chercher activement les cas limites plutôt que d'attendre qu'un utilisateur les trouve : contenu très long, absence de données, tentative d'action interdite, action qu'un utilisateur pourrait faire sur lui-même par erreur.
- Corriger ce qui est trouvé immédiatement et revérifier, plutôt que de le noter pour plus tard.

## 12. Déploiement

- Déployer d'abord sur l'adresse par défaut fournie par l'hébergeur choisi ; traiter le nom de domaine personnalisé comme une étape séparée et non bloquante, qui peut arriver plus tard sans redéploiement particulier.
- Sortir tous les identifiants et secrets du code : ils doivent vivre uniquement dans la configuration d'environnement de la plateforme d'hébergement, jamais commités.
- Relier le dépôt de code à l'hébergement pour qu'un déploiement se déclenche automatiquement à chaque mise à jour de la branche principale.
- **Tester en conditions réelles une fois en ligne** : créer un compte jetable sur l'environnement de production, vérifier qu'une action s'enregistre bien, puis nettoyer.

## 13. Après la mise en ligne

- Sur demande, générer un jeu de données de démonstration réaliste (plusieurs comptes avec des rôles différents, plusieurs entrées avec des états variés) pour permettre d'explorer l'outil avant que les vraies données existent. Le rendre rejouable (un script qui nettoie l'ancien jeu de démo avant d'en recréer un) plutôt qu'à usage unique.
- Traiter chaque nouvelle demande de fonctionnalité comme un mini-cycle complet : comprendre le besoin exact (y compris ce qui ne doit *pas* être permis, ex. "lecture seule"), l'implémenter, le vérifier en conditions réelles, le déployer, puis le confirmer par un test dans le navigateur — pas seulement en relisant le code.

## Principes transversaux suivis tout au long

- Vérifier chaque affirmation par une exécution réelle (test dans un navigateur, requête réelle, capture d'écran) plutôt que de supposer que le code fonctionne parce qu'il se lit bien.
- Toujours nettoyer les données de test créées pour vérifier une fonctionnalité, immédiatement après vérification.
- Ne jamais faire transiter un mot de passe ou une clé secrète réelle par la conversation ; les faire passer directement dans les fichiers de configuration.
- Laisser la création de comptes sur des services externes (hébergement, base de données, email) à la personne propriétaire du projet — préparer le terrain, ne jamais le faire à sa place.
- Committer et pousser souvent, par petites étapes vérifiées, avec des messages qui expliquent le "pourquoi" du changement.
- Revalider systématiquement (types, style de code) après chaque changement, avant de passer à la suite.
- Face à un comportement inattendu, chercher la cause racine avant de corriger, plutôt que de contourner le symptôme.
