# PIIQUANTE - README

---

Serveur back end pour le site "Piiquante".

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées
secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise
souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter
leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

## Installation

### Prérequis
- NodeJS
- npm

### Lancement du serveur
- Installer les dépendances avec `npm install`.
- Lancer le serveur de développement `npm run dev`
- Lancer le serveur de production `npm start`

## Utilisation de l'api

### Users routes

- `POST` api/auth/signin - Enregistrement d'un utilisateur.
- `POST` api/auth/login - Connection d'un utilisateur.

### Sauces routes

- `POST` api/sauces - Création d'une sauce.
- `GET` api/sauces - Récupération de toutes les sauces.
- `GET` api/sauces/:id - Récupération d'une sauce.
- `PUT` api/sauces/:id - Mise à jour d'une sauce.
- `DELETE` api/sauces/:id - Suppression d'une sauce.
