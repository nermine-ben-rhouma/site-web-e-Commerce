# Site Web E-Commerce

Une plateforme e-commerce complète développée avec **Spring Boot** (backend) et **React** (frontend).

## 🚀 Description

Ce projet est une application web d'e-commerce permettant de gérer des produits, catégories, fournisseurs et commandes. Il inclut une interface moderne en React et un backend robuste avec Spring Boot.

## 🛠 Technologies Utilisées

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Maven
- MySQL / PostgreSQL (selon configuration)

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Outils
- Postman (tests API)
- Git & GitHub

## ✨ Fonctionnalités

- Gestion des produits (CRUD)
- Gestion des catégories
- Gestion des fournisseurs
- Interface utilisateur moderne et responsive
- API RESTful
- Tests API avec Postman

## 📁 Structure du Projet
ecommerce/
 com.ecommerce/          # Backend Spring Boot
 ecommerce-frontend/     # Frontend React
 testpostman/            # Collections Postman
.gitignore

### 1. Cloner le projet
```bash
git clone https://github.com/nermine-ben-rhouma/site-web-e-Commerce.git
cd site-web-e-Commerce
2. Backend (Spring Boot)
Bashcd com.ecommerce
mvn clean install
mvn spring-boot:run
Le backend sera accessible sur : http://localhost:8080
3. Frontend (React)
Bashcd ecommerce-frontend
npm install
npm start
Le frontend sera accessible sur : http://localhost:3000

📬 Tests API
Les collections Postman sont disponibles dans le dossier testpostman/.
