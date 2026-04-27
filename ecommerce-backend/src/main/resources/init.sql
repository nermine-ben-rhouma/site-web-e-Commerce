-- =============================================
-- SCRIPT D'INITIALISATION - E-Commerce DB
-- =============================================

CREATE DATABASE IF NOT EXISTS ecommerce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- =============================================
-- SUPER ADMIN par défaut
-- email: superadmin@shop.com
-- password: Admin1234!
-- (BCrypt hash ci-dessous)
-- =============================================
INSERT INTO users (email, password, nom, prenom, telephone, actif, role, created_at)
VALUES (
  'superadmin@shop.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhem',
  'Admin',
  'Super',
  '+216 00 000 000',
  1,
  'SUPER_ADMIN',
  NOW()
) ON DUPLICATE KEY UPDATE email = email;

-- =============================================
-- ADMIN par défaut
-- email: admin@shop.com
-- password: Admin1234!
-- =============================================
INSERT INTO users (email, password, nom, prenom, telephone, actif, role, created_at)
VALUES (
  'admin@shop.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhem',
  'Admin',
  'Principale',
  '+216 11 111 111',
  1,
  'ADMIN',
  NOW()
) ON DUPLICATE KEY UPDATE email = email;

-- =============================================
-- CLIENT de test
-- email: client@shop.com
-- password: Admin1234!
-- =============================================
INSERT INTO users (email, password, nom, prenom, telephone, actif, role, created_at)
VALUES (
  'client@shop.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhem',
  'Dupont',
  'Jean',
  '+216 22 222 222',
  1,
  'CLIENT',
  NOW()
) ON DUPLICATE KEY UPDATE email = email;

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (nom, description, image_url)
VALUES
  ('Électronique',    'Téléphones, ordinateurs, accessoires',  NULL),
  ('Vêtements',       'Mode homme, femme et enfant',            NULL),
  ('Alimentation',    'Produits frais et épicerie',             NULL),
  ('Maison & Jardin', 'Mobilier, déco et jardinage',            NULL),
  ('Sport & Loisirs', 'Équipements sportifs et jeux',           NULL)
ON DUPLICATE KEY UPDATE nom = nom;

-- =============================================
-- FOURNISSEURS
-- =============================================
INSERT INTO fournisseurs (nom, email, telephone, adresse, site_web)
VALUES
  ('TechSupply Co.',  'contact@techsupply.com',  '+216 30 100 100', 'Zone industrielle, Tunis',    'https://techsupply.com'),
  ('FashionWholesale','info@fashionwh.com',       '+216 30 200 200', 'Avenue Habib Bourguiba, Sfax','https://fashionwh.com'),
  ('FoodDistrib',     'orders@fooddistrib.com',   '+216 30 300 300', 'Route de Sousse, Hammamet',   'https://fooddistrib.com')
ON DUPLICATE KEY UPDATE nom = nom;

-- =============================================
-- PRODUITS
-- =============================================
INSERT INTO produits (nom, description, prix, stock, image_url, actif, categorie_id, fournisseur_id, created_at)
VALUES
  ('iPhone 15 Pro',      'Smartphone Apple dernière génération',   3299.99, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1, 1, 1, NOW()),
  ('Samsung Galaxy S24', 'Smartphone Android haut de gamme',       2499.99, 35, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 1, 1, 1, NOW()),
  ('MacBook Air M3',     'Ordinateur portable ultra-léger Apple',  5499.99, 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 1, 1, 1, NOW()),
  ('AirPods Pro 2',      'Écouteurs sans fil avec ANC',             799.99, 100,'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 1, 1, 1, NOW()),
  ('T-Shirt Premium',    'T-shirt coton bio, coupe moderne',         49.99, 200,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 1, 2, 2, NOW()),
  ('Jean Slim Fit',      'Jean stretch confort toute saison',        89.99, 150,'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 1, 2, 2, NOW()),
  ('Sneakers Sport',     'Chaussures de sport légères et respirantes',129.99, 80,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 1, 2, 2, NOW()),
  ('Café Arabica 1kg',   'Café en grains 100% arabica, torréfaction artisanale', 34.99, 500,'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 1, 3, 3, NOW()),
  ('Huile d''Olive Bio', 'Huile d''olive vierge extra, première pression', 24.99, 300,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 1, 3, 3, NOW()),
  ('Tapis de Yoga',      'Tapis antidérapant 6mm, idéal yoga et pilates', 59.99, 120,'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 1, 5, 1, NOW())
ON DUPLICATE KEY UPDATE nom = nom;
