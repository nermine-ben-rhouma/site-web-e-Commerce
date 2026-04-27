# 🛒 E-Commerce Full Stack — Spring Boot + React + MySQL

## Architecture

```
ecommerce/
├── ecommerce-backend/     ← Spring Boot (port 8080)
└── ecommerce-frontend/    ← React + Vite (port 3000)
```

---

## 🗄️ 1. Base de données MySQL

```sql
-- Créer la base
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insérer les données de test
-- Exécuter : src/main/resources/init.sql
```

**Modifier** `application.properties` si nécessaire :
```properties
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

---

## ☕ 2. Lancer le Backend

```bash
cd ecommerce-backend
mvn spring-boot:run
```

> Le serveur démarre sur **http://localhost:8080**  
> JPA crée automatiquement les tables (`ddl-auto=update`)

---

## ⚛️ 3. Lancer le Frontend

```bash
cd ecommerce-frontend
npm install
npm run dev
```

> L'application démarre sur **http://localhost:3000**

---

## 👥 Comptes de test

| Rôle        | Email                  | Mot de passe |
|-------------|------------------------|--------------|
| Super Admin | superadmin@shop.com    | Admin1234!   |
| Admin       | admin@shop.com         | Admin1234!   |
| Client      | client@shop.com        | Admin1234!   |

---

## 🔐 Authentification JWT

- Login → POST `/api/auth/login` → retourne un **token JWT**
- Token envoyé dans chaque requête : `Authorization: Bearer <token>`
- Expiration : **24h**

---

## 📡 Endpoints API

### Auth (public)
| Méthode | URL                  | Description       |
|---------|----------------------|-------------------|
| POST    | /api/auth/login      | Connexion         |
| POST    | /api/auth/register   | Inscription client|
| GET     | /api/auth/me         | Profil connecté   |

### Produits
| Méthode | URL                     | Rôle requis        |
|---------|-------------------------|--------------------|
| GET     | /api/produits           | Public             |
| GET     | /api/produits/{id}      | Public             |
| POST    | /api/produits           | ADMIN / SUPER_ADMIN|
| PUT     | /api/produits/{id}      | ADMIN / SUPER_ADMIN|
| DELETE  | /api/produits/{id}      | ADMIN / SUPER_ADMIN|

### Catégories
| Méthode | URL                      | Rôle requis        |
|---------|--------------------------|--------------------|
| GET     | /api/categories          | Public             |
| POST    | /api/categories          | ADMIN / SUPER_ADMIN|
| PUT     | /api/categories/{id}     | ADMIN / SUPER_ADMIN|
| DELETE  | /api/categories/{id}     | ADMIN / SUPER_ADMIN|

### Fournisseurs
| Méthode | URL                        | Rôle requis        |
|---------|----------------------------|--------------------|
| GET     | /api/fournisseurs          | ADMIN / SUPER_ADMIN|
| POST    | /api/fournisseurs          | ADMIN / SUPER_ADMIN|
| PUT     | /api/fournisseurs/{id}     | ADMIN / SUPER_ADMIN|
| DELETE  | /api/fournisseurs/{id}     | ADMIN / SUPER_ADMIN|

### Panier (CLIENT)
| Méthode | URL              | Description            |
|---------|------------------|------------------------|
| GET     | /api/panier      | Voir son panier        |
| POST    | /api/panier      | Ajouter un article     |
| PUT     | /api/panier/{id} | Modifier la quantité   |
| DELETE  | /api/panier/{id} | Supprimer un article   |
| DELETE  | /api/panier      | Vider le panier        |

### Commandes
| Méthode | URL                            | Rôle requis        |
|---------|--------------------------------|--------------------|
| GET     | /api/commandes/mes-commandes   | CLIENT             |
| POST    | /api/commandes/passer          | CLIENT             |
| GET     | /api/commandes                 | ADMIN / SUPER_ADMIN|
| PUT     | /api/commandes/{id}/statut     | ADMIN / SUPER_ADMIN|
| DELETE  | /api/commandes/{id}            | ADMIN / SUPER_ADMIN|

### Super Admin — Utilisateurs
| Méthode | URL                                  | Rôle requis |
|---------|--------------------------------------|-------------|
| GET     | /api/superadmin/users                | SUPER_ADMIN |
| POST    | /api/superadmin/users                | SUPER_ADMIN |
| PUT     | /api/superadmin/users/{id}/role      | SUPER_ADMIN |
| PUT     | /api/superadmin/users/{id}/toggle-actif | SUPER_ADMIN |
| DELETE  | /api/superadmin/users/{id}           | SUPER_ADMIN |

---

## 🗂️ Structure du projet Frontend

```
src/
├── api/
│   └── axios.js              ← Instance Axios + intercepteurs JWT
├── context/
│   └── AuthContext.jsx       ← État global de l'authentification
├── components/
│   ├── Navbar.jsx            ← Barre de navigation dynamique
│   └── ProtectedRoute.jsx    ← Garde de routes par rôle
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── client/
│   │   ├── Catalogue.jsx     ← Grille produits + filtre
│   │   ├── Panier.jsx        ← Gestion panier + commande
│   │   └── MesCommandes.jsx  ← Historique commandes
│   ├── admin/
│   │   ├── GestionProduits.jsx
│   │   ├── GestionCategories.jsx
│   │   ├── GestionFournisseurs.jsx
│   │   └── GestionCommandes.jsx
│   └── superadmin/
│       └── GestionUsers.jsx
└── App.jsx                   ← Router principal
```

---

## 🗂️ Structure du projet Backend

```
src/main/java/com/ecommerce/
├── config/
│   └── SecurityConfig.java       ← Spring Security + CORS
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
├── security/
│   ├── JwtAuthFilter.java
│   ├── JwtUtils.java
│   ├── UserDetailsImpl.java
│   └── UserDetailsServiceImpl.java
└── EcommerceApplication.java
```

---

## ⚙️ Technologies utilisées

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security + JWT (jjwt 0.11.5)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok

### Frontend
- React 18
- Vite 5
- React Router v6
- Axios
- TailwindCSS 3
- React Hot Toast
