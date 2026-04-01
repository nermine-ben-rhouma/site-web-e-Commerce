import React, { useEffect, useState } from "react";
import { API } from "../api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      API.delete(`/categories/${id}`)
        .then(() => setCategories(categories.filter((c) => c.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = (category) => {
    localStorage.setItem("editCategory", JSON.stringify(category));
    window.location.href = "/edit-category";
  };

  return (
    <div style={{
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "0 30px",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    }}>
      
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#1e2937",
          margin: "0"
        }}>
          Catégories
        </h1>

        <button 
          onClick={() => window.location.href = "/add-category"}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "15px 32px",
            fontSize: "17px",
            fontWeight: "600",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(37, 99, 235, 0.25)",
            transition: "all 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
        >
          + Ajouter une catégorie
        </button>
      </div>

      {/* Tableau */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 35px rgba(0, 0, 0, 0.07)",
        border: "1px solid #e5e7eb"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th style={{
                padding: "22px 30px",
                textAlign: "left",
                fontWeight: "600",
                color: "#475569",
                fontSize: "15px"
              }}>ID</th>
              <th style={{
                padding: "22px 30px",
                textAlign: "left",
                fontWeight: "600",
                color: "#475569",
                fontSize: "15px"
              }}>Nom de la Catégorie</th>
              <th style={{
                padding: "22px 30px",
                textAlign: "center",
                fontWeight: "600",
                color: "#475569",
                fontSize: "15px",
                width: "280px"
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{
                  padding: "22px 30px",
                  fontWeight: "600",
                  color: "#64748b"
                }}>
                  {category.id}
                </td>
                <td style={{
                  padding: "22px 30px",
                  fontSize: "17.5px",
                  fontWeight: "500",
                  color: "#1e2937"
                }}>
                  {category.name}
                </td>
                <td style={{
                  padding: "22px 30px",
                  textAlign: "center"
                }}>
                  <button 
                    onClick={() => handleEdit(category)}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "11px 22px",
                      marginRight: "12px",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "11px 22px",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{
                  padding: "90px 30px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "18px"
                }}>
                  Aucune catégorie trouvée pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;