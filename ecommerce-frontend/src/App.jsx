import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import EditProduct from "./components/EditProduct";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import SupplierList from "./components/SupplierList";
import SupplierForm from "./components/SupplierForm";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Navigation Moderne */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h1>StockPro</h1>
            </div>

            <div className="nav-links">
              <NavLink to="/" className="nav-link">Produits</NavLink>
              <NavLink to="/add-product" className="nav-link">+ Ajouter Produit</NavLink>
              <NavLink to="/categories" className="nav-link">Catégories</NavLink>
              <NavLink to="/suppliers" className="nav-link">Fournisseurs</NavLink>
            </div>

            <div className="nav-right">
              <span className="user-info">Bienvenue, Admin</span>
            </div>
          </div>
        </nav>

        {/* Contenu Principal */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/edit-product" element={<EditProduct />} />

            <Route path="/categories" element={<CategoryList />} />
            <Route path="/add-category" element={<CategoryForm />} />
            <Route path="/edit-category" element={<CategoryForm />} />

            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/add-supplier" element={<SupplierForm />} />
            <Route path="/edit-supplier" element={<SupplierForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;