import React, { useEffect, useState } from "react";
import { API } from "../api";

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editCategory = JSON.parse(localStorage.getItem("editCategory"));
    if (editCategory) {
      setName(editCategory.name);
      setId(editCategory.id);
      localStorage.removeItem("editCategory");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (id) {
      // Modification
      API.put(`/categories/${id}`, { name })
        .then(() => {
          window.location.href = "/categories";
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de la modification");
        })
        .finally(() => setLoading(false));
    } else {
      // Ajout
      API.post("/categories", { name })
        .then(() => {
          window.location.href = "/categories";
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de l'ajout");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "60px auto",
      padding: "40px 30px",
      backgroundColor: "white",
      borderRadius: "20px",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.08)",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#1e2937",
          marginBottom: "8px"
        }}>
          {id ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "17px" }}>
          {id ? "Modifiez le nom de la catégorie" : "Ajoutez une nouvelle catégorie"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "30px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#374151",
            fontSize: "16px"
          }}>
            Nom de la catégorie
          </label>
          <input
            type="text"
            placeholder="Ex: Électronique, Vêtements, Meubles..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "17px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              outline: "none",
              transition: "all 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow: "0 6px 20px rgba(37, 99, 235, 0.25)"
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = "#1d4ed8";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#2563eb";
          }}
        >
          {loading ? "En cours..." : (id ? "Modifier la catégorie" : "Ajouter la catégorie")}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;