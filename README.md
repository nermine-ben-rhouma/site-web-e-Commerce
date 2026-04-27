# 🛒 ShopApp — E-Commerce Full Stack

Projet e-commerce complet avec **Spring Boot** (backend) + **React** (frontend) + **MySQL**.

---

## 🏗️ Architecture

```
├── ecommerce-backend/      ← Spring Boot 3 + JWT + MySQL
└── ecommerce-frontend/     ← React 18 + Vite + TailwindCSS
```

### 3 espaces utilisateurs

| Rôle         | Accès                                                              |
|--------------|--------------------------------------------------------------------|
| `CLIENT`     | Catalogue, Panier, Passer commande, Suivi commandes                |
| `ADMIN`      | CRUD Produits, Catégories, Fournisseurs, Gestion commandes         |
| `SUPER_ADMIN`| Tout ce qu'un Admin peut faire + Gestion des utilisateurs          |

---

## 🚀 Installation

### Prérequis
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

---

### 1. Base de données MySQL

```bash
# Connectez-vous à MySQL
mysql -u root -p

# Exécutez le script d'initialisation
source /chemin/vers/ecommerce-backend/src/main/resources/init.sql
```

Ou manuellement :
```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Spring Boot

```bash
cd ecommerce-backend

# Modifier les identifiants MySQL si nécessaire
# src/main/resources/application.properties
#   spring.datasource.username=root
#   spring.datasource.password=votre_mot_de_passe

# Lancer
mvn spring-boot:run
```

Le backend démarre sur **http://localhost:8080**

---

### 3. Frontend React

```bash
cd ecommerce-frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Le frontend démarre sur **http://localhost:3000**

---

## 🔑 Comptes de test

| Email                    | Mot de passe | Rôle         |
|--------------------------|-------------|--------------|
| superadmin@shop.com      | password    | SUPER_ADMIN  |
| admin@shop.com           | password    | ADMIN        |
| client@shop.com          | password    | CLIENT       |

> **Note :** Le hash BCrypt dans `init.sql` correspond au mot de passe `password`.

---

## 📡 API Endpoints

### Authentification (public)
```
POST   /api/auth/login      → Connexion
POST   /api/auth/register   → Inscription client
GET    /api/auth/me         → Profil connecté
```

### Produits
```
GET    /api/produits               → Liste (public)
GET    /api/produits?search=       → Recherche (public)
GET    /api/produits?categorieId=  → Filtre catégorie (public)
GET    /api/produits/{id}          → Détail (public)
POST   /api/produits               → Créer (ADMIN)
PUT    /api/produits/{id}          → Modifier (ADMIN)
DELETE /api/produits/{id}          → Désactiver (ADMIN)
```

### Catégories
```
GET    /api/categories          → Liste (public)
POST   /api/categories          → Créer (ADMIN)
PUT    /api/categories/{id}     → Modifier (ADMIN)
DELETE /api/categories/{id}     → Supprimer (ADMIN)
```

### Fournisseurs
```
GET    /api/fournisseurs        → Liste (ADMIN)
POST   /api/fournisseurs        → Créer (ADMIN)
PUT    /api/fournisseurs/{id}   → Modifier (ADMIN)
DELETE /api/fournisseurs/{id}   → Supprimer (ADMIN)
```

### Panier (CLIENT)
```
GET    /api/panier              → Mon panier
POST   /api/panier              → Ajouter article
PUT    /api/panier/{id}         → Modifier quantité
DELETE /api/panier/{id}         → Retirer article
DELETE /api/panier              → Vider le panier
```

### Commandes
```
GET    /api/commandes/mes-commandes   → Mes commandes (CLIENT)
POST   /api/commandes/passer          → Passer commande (CLIENT)
GET    /api/commandes                 → Toutes (ADMIN)
GET    /api/commandes/{id}            → Détail (ADMIN)
PUT    /api/commandes/{id}/statut     → Changer statut (ADMIN)
DELETE /api/commandes/{id}            → Supprimer (ADMIN)
```

### Utilisateurs (SUPER_ADMIN uniquement)
```
GET    /api/superadmin/users                    → Liste
POST   /api/superadmin/users                    → Créer
PUT    /api/superadmin/users/{id}/role          → Changer rôle
PUT    /api/superadmin/users/{id}/toggle-actif  → Bloquer/Activer
DELETE /api/superadmin/users/{id}               → Supprimer
```

---

## 🗂️ Structure des fichiers

### Backend
```
ecommerce-backend/
└── src/main/java/com/ecommerce/
    ├── EcommerceApplication.java
    ├── config/
    │   └── SecurityConfig.java
    ├── controller/
    │   ├── AuthController.java
    │   ├── CategorieController.java
    │   ├── CommandeController.java
    │   ├── FournisseurController.java
    │   ├── PanierController.java
    │   ├── ProduitController.java
    │   └── UserController.java
    ├── dto/
    │   ├── CommandeRequest.java
    │   ├── CreateUserRequest.java
    │   ├── JwtResponse.java
    │   ├── LoginRequest.java
    │   ├── PanierRequest.java
    │   └── RegisterRequest.java
    ├── model/
    │   ├── Categorie.java
    │   ├── Commande.java
    │   ├── Fournisseur.java
    │   ├── LigneCommande.java
    │   ├── Panier.java
    │   ├── Produit.java
    │   └── User.java
    ├── repository/
    │   ├── CategorieRepository.java
    │   ├── CommandeRepository.java
    │   ├── FournisseurRepository.java
    │   ├── LigneCommandeRepository.java
    │   ├── PanierRepository.java
    │   ├── ProduitRepository.java
    │   └── UserRepository.java
    └── security/
        ├── JwtAuthFilter.java
        ├── JwtUtils.java
        ├── UserDetailsImpl.java
        └── UserDetailsServiceImpl.java
```

### Frontend
```
ecommerce-frontend/
└── src/
    ├── api/
    │   └── axios.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── client/
    │   │   ├── Catalogue.jsx
    │   │   ├── Panier.jsx
    │   │   └── MesCommandes.jsx
    │   ├── admin/
    │   │   ├── GestionProduits.jsx
    │   │   ├── GestionCategories.jsx
    │   │   ├── GestionFournisseurs.jsx
    │   │   └── GestionCommandes.jsx
    │   └── superadmin/
    │       └── GestionUsers.jsx
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

---

## 🔧 Configuration

### Modifier le mot de passe MySQL
Dans `ecommerce-backend/src/main/resources/application.properties` :
```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

### Modifier le port du frontend
Dans `ecommerce-frontend/vite.config.js` :
```js
server: { port: 3000 }
```

### Modifier la clé secrète JWT
Dans `application.properties` :
```properties
app.jwt.secret=VotreNouvelleCleSuperSecrete256BitsMinimum
```

---

## ⚠️ Points importants

1. **Spring JPA** crée automatiquement les tables au démarrage (`ddl-auto=update`)
2. Le **premier Super Admin** doit être inséré via SQL (voir `init.sql`)
3. Les produits supprimés sont **désactivés** (soft delete) et non supprimés physiquement
4. Le **stock** est automatiquement décrémenté lors d'une commande
5. Le **panier** est vidé automatiquement après passage de commande
