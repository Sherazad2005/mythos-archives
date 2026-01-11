# Mythos Archives

Plateforme collaborative de documentation sur les créatures mythologiques, avec un système de vérification communautaire inspiré de Wikipédia

 ## Description

Le projet **Mythos Archives** est une architecture microservices permettant aux utilisateurs d'ajouter et de documenter des créatures mythologiques. Les contributions sont validées par des modérateurs selon un système de réputation

L'**auth-service** gère de l'authentification et de la gestion des utilisateurs Il gère :
 L'authentification JWT
 Les rôles utilisateurs (USER, EXPERT, ADMIN)
 Le système de réputation
 La communication avec les autres microservices (via API Gateway et lore-service)
Le service démarre sur le port 4000 par défaut
 ### Prérequis
 Node.js (v16+)
 npm

### Étapes

```bash
cd services/auth-service
npm install
npm run dev

```
fichier .env à créer :

PORT=4000
JWT_SECRET=une_phrase_tres_longue_et_secrete
DATABASE_URL="file:./dev.db"
INTERNAL_API_KEY=supersecretkey

Environnement : 
JWT_SECRET = Clé pour valider les tokens JWT
Database_URL : url de connexion Prisma
INTERNAL_API_KEY : Clé d'authentification pour les appels inter services 

API endpoint publics :
POST /auth/register

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securePassword123"
}

Créer un utilisateur avec le rôle USER et une réputation de 0, renvoi un token JWT.

Erreurs :
409 : Email ou username déjà utilisé

Connexion
POST /auth /login

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Réponse : Vérifie les identifiants avec bcrypt et retourne un token JWT
Erreurs : 
400 = Champs manquants
401 = Identifiants invalides


Profil Utilisateur

Get /auth/me
Atuthorization: Bearer <token>
Retourne les informations de l'utilisateur connecté(id, email, role, reputation)

erreur :
404= Utilisateur inexistant

Endpoints Protégés (admin)
Ces endpoints nécessitent le middleware requireAuth et requireRole(['ADMIN'])

Liste des Utilisateurs 
GET /admin/users 

Accès Admin uniquement
Réponse Liste tous  tous les utilisateurs avec leur spécifications (id, email, role, réputation, date de création

Modifier le Rôle

PATCH /users/:id/role
accès : admin uniquement

{
  "role": "EXPERT"
}

Valeurs possibles = USER, EXPERT, ADMIB 
renvoi l'id et le nouveau role

Endpoint internes 

Modifier la Réputation : PATCH /internal/users/:id/reputation

x-internal-api-key: supersecretkey
{
  "delta": 5
}

Incrémente la réputation de l'utilisateur
Promotion automatique Si la rep atteint >= 10 et que le role est USER, l'utilisateur passe en EXPERT


Sécurité et Middlewares

requireAuth
lit le header Authorization: Bearer <token>
Vérifie la validité du JWT avec JWT_SECRET
Injecte req.user = {id, role} pour les routes protégées 
requireRole(...role)
Verifie que req.user.role correspond aux rôles autorisés
Utilisé pour restreindre l'accès aux routes admin requireInternalKey
Verifie la présence du header x-internal-api-key
Sécurise les appels provenant  du lore-service ou d'autres éventuels micro services

Architecture :
mythos-archives/
├── services/
│   ├── auth-service/      ← Service d'authentification
│   └── lore-service/      ← Service de gestion des créatures
├── api-gateway/           ← Point d'entrée unique
└── README.md

Technologies utilisées :
Node.js + Express.js
Prisma ORM (SQLite)
bcrypt ( hachage des mots de passe)
jsonwebtoken (JWT)

## Récap des microservices

| Service            | Port | Rôle principal |
|--------------------|------|----------------|
| auth-service       | 4000 | Authentification, rôles, réputation |
| lore-service       | 4001 | Créatures, témoignages, statistiques |
| mythology-service | 4002 | Analyse et classification |


Cette partie à été géré par Sherazade



## Lore Service

Le **lore Service** gère tout le contenu mythologique de mythos archives : créatures, témoignages des utilisateurs et statiques avancées, il expose une API REST basée sur **Express** et **MongoDB(Mongoose)** et communique avec l'auth service pour le check des token et la réputation

---

``` Structure du Lore service :
lore-service/
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── creature.controller.js
    │   ├── stats.controller.js
    │   └── testimony.controllers.js
    ├── middlewares/
    │   ├── requireRole.js
    │   └── verifyTokenViaAuth.js
    ├── models/
    │   ├── creature.model.js
    │   └── testimony.model.js
    ├── route/
    │   ├── creature.route.js
    │   ├── stats.routes.js
    │   └── testimony.routes.js
    ├── services/
    │   ├── authClient.js
    │   └── testimonyRules.js
    └── index.js

```
Configuration & Démarrage
Fichier d’entrée : src/index.js.

bash
cd services/lore-service
npm install
npm run dev
Exemple de .env pour le lore-service :

PORT=3002
MONGODB_URI=mongodb://localhost:27017/mythos-archives
AUTH_SERVICE_URL=http://localhost:3001
INTERNAL_API_KEY=supersecretkey
MONGODB_URI : connexion MongoDB (Mongoose)

AUTH_SERVICE_URL : URL de l’auth-service (/auth/me + routes internes).

INTERNAL_API_KEY : clé partagée pour appeler /internal/users/:id/reputation

La connexion à MongoDB est gérée dans config/db.js qui récupère MONGODB_URI et vérifie sa présence, se connecte avec Mongoose et arrête le process en cas d'erreur

modèles mongoose
Créature (models/creature.model.js)
name : string, requis, unique, trim

description : string, requis, minlength: 20

mythology : string, par défaut unknown

validatedTestimonies : nombre de témoignages validés, default: 0

evolutionScore : score d’évolution de la créature, default: 0

Timestamps automatiques (createdAt, updatedAt)


Testimony(models/testimony.model.js)
creatureId : ObjectId → Creature, requis.

authorId : Number, requis (id utilisateur provenant de l’auth-service)

description : string, requis, minlength: 10

status : "PENDING" | "VALIDATED" | "REJECTED", par défaut "PENDING"

validatedBy : Number (id du modérateur)

validatedAt : Date

createdAt : Date, par défaut Date.now


Middlewares

VerifyTokenViaAuth
lit le header Authorization: Bearer <token>
Appelle AUTH_SERVICE_URL/auth/me avec axios
si le token est valide, ajoute req.user = id, role
Sinon renvoi 401 (Missing Bearer token ou Invalid token)

RequireRole(...allowed)
Vérifie la présence de req.user
Contrôle que req.user.role fait partie des rôles autorisés ( USER, EXPERT, ADMIN)
sinon donne erreur 401 ou 403


Intégration avec l'auth service 
services/authClient.js.
Augmente la réputation de l'auteur lors d'une validation de témoignage (+3 ou +4 si le valideur est EXPERT)

Diminue la reputation lors d'un rejet (-1)

Se base sur la clé interne pour sécuriser ces appels 

Règles métier (service/testimonyRules.js)
Délai de 5min entre deux témoignages d'un même utilisateur (Epêche un user de poster des témoignages trop rapidement et spam)

Interdiction de valider son propre témoignage (Lève une erreur si l'auteur a validé son témoignage)

API Créature (/creatures)
route/creature.route.js

POST /creatures
Auth: verifyTokenViaAuth
créer une creature

GET /creatures
affiche toutes les créatures
Pour chacune va calculer :
validatedCount (nombre de témoignages VALIDATED)
  legendScore = 1 + validatedCount / 5

Paramètre ?sort=legendScore pour trier par score de légende

GET /creatures/:id
  Renvoie la créature + legendScore + validatedCount
  erreur 404 si non trouvée
  
PUT /creatures/:id 
  Auth: verifyTokenViaAuth
  Supprime la créature, ou 404 si elle n'existe pas


Api témoignages(/testimonies)
route/testimony.routes.js

POST /testimonies
  Auth: verifyTokenViaAuth
  Récupère userId depuis req.user
  Applique checkFiveBetweenTestimony (règle des 5min)
  Créer un témoignage avec status:
  "PENDING"

GET/testimonies?
status=&creatureId=&authorId=
  Filtrage via buildTestimonyFilter
  Renvoi les témoignages correspondant

  PUT /testimonies/:id/validate
    Auth: verifyTokenViaAuth requireRole("EXPERT ou ADMIN)
    Applique noSelfValidation
    passe le temoignage en VALIDATED et renseigne validatedBy /validatedAt
    Appelle addReputation(authorId, delta) et met a jour la créature(evolutionScore, validatedTestimonies)

  PUT /testimonies/:id/reject

Auth : verifyTokenViaAuth, requireRole(EXPERT, ADMIN)
Applique noSelfValidation
Passe le témoignage en REJECTED, renseigne validatedBy / validatedAt
appelle addReputation(authorId, -1)


API Statistique (/stats)
  route/stats.routes.js
  Toutes les routes sont protégées par verifyTokenViaAuth + requireRole(EXPERT, ADMIN)

  Get /stats/occurences
    Nombre de témoignage par creatureId(agrégation MongoDB)
  GET /stats/average
    renvoi: totalCreatures, totalTestimonies, average(moyenne) témoignage par créature
  GET /stats/top?limit = 5
    Top créatures par nombre de témoignages
  GET /stats/status
    Répartition des témoignages par statut(PENDING, VALIDATED, REJECTED)
  GET /stats/summary
    Synthèse globale: totaux + répartition par statut
  GET /stats/keyword?limit=10
    Analyse les descriptions des témoignages et renvoi les mots les plus fréquents

  Architecture
  Client / API Gateway → appelle /creatures, /testimonies, /stats.
Auth-service
/auth/me : vérifie les tokens pour verifyTokenViaAuth
/internal/users/:id/reputation : modifie la réputation

Lore-service
MongoDB (créatures, témoignages).
Logique métier de validation, scores et statistiques

Partie réalisé par Sidy

## Scénario de test recommandé

1. Créer un utilisateur (USER) via `POST /auth/register`
2. Se connecter via `POST /auth/login` → récupérer le token JWT
3. Créer une créature via `POST /creatures`
4. Créer un témoignage via `POST /testimonies`
5. Valider le témoignage avec un utilisateur EXPERT ou ADMIN
6. Vérifier la réputation avec `GET /auth/me`
7. Consulter les statistiques via `GET /stats/*`

  
