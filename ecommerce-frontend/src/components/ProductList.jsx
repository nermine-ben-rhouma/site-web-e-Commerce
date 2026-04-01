import React, { useEffect, useState } from "react";
import { API } from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState({ categoryId: "", supplierId: "" });

  // Récupérer les données
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));

    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    API.get("/suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      API.delete(`/products/${id}`)
        .then(() => setProducts(products.filter((p) => p.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const handleEdit = (product) => {
    localStorage.setItem("editProduct", JSON.stringify(product));
    window.location.href = "/edit-product";
  };

  const filteredProducts = products
    .filter((p) => !filter.categoryId || p.category?.id === parseInt(filter.categoryId))
    .filter((p) => !filter.supplierId || p.supplier?.id === parseInt(filter.supplierId));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600 mt-2 text-lg">Gérez votre catalogue de produits</p>
        </div>

        {/* Filtres */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={filter.categoryId}
                onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
              <select
                value={filter.supplierId}
                onChange={(e) => setFilter({ ...filter, supplierId: e.target.value })}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Tous les fournisseurs</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setFilter({ categoryId: "", supplierId: "" })}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all border border-gray-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-8 py-5 text-left font-semibold text-gray-700">Produit</th>
                <th className="px-8 py-5 text-left font-semibold text-gray-700">Prix</th>
                <th className="px-8 py-5 text-left font-semibold text-gray-700">Stock</th>
                <th className="px-8 py-5 text-left font-semibold text-gray-700">Catégorie</th>
                <th className="px-8 py-5 text-left font-semibold text-gray-700">Fournisseur</th>
                <th className="px-8 py-5 text-center font-semibold text-gray-700">Image</th>
                <th className="px-8 py-5 text-center font-semibold text-gray-700 w-52">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-medium text-gray-900">{p.name}</td>
                  <td className="px-8 py-6 text-lg font-semibold text-gray-900">
                    {p.price.toLocaleString()} TND
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      p.quantity > 10 ? "bg-green-100 text-green-700" :
                      p.quantity > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.quantity} en stock
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-600">{p.category?.name || "—"}</td>
                  <td className="px-8 py-6 text-gray-600">{p.supplier?.name || "—"}</td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {p.imageUrl ? (
                        <img
                          src={`http://localhost:8080/${p.imageUrl}`}
                          alt={p.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl text-gray-400">
                          📱
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all text-sm"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all text-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center text-gray-500">
                    Aucun produit trouvé avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;