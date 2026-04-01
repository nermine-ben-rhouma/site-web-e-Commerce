import React, { useEffect, useState } from "react";
import { API } from "../api";

const EditProduct = () => {
  const storedProduct = JSON.parse(localStorage.getItem("editProduct"));
  const [form, setForm] = useState(storedProduct || {});
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Charger les catégories et fournisseurs
  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
    API.get("/suppliers").then((res) => setSuppliers(res.data));
  }, []);

  // Prévisualisation de l'image
  useEffect(() => {
    if (storedProduct?.imageUrl) {
      setImagePreview(`http://localhost:8080/${storedProduct.imageUrl}`);
    }
  }, [storedProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("quantity", form.quantity);
    data.append("categoryId", form.category?.id || form.categoryId);
    data.append("supplierId", form.supplier?.id || form.supplierId);
    
    if (form.image) {
      data.append("image", form.image);
    }

    try {
      await API.put(`/products/${form.id}`, data);
      alert("✅ Produit mis à jour avec succès !");
      window.location.href = "/"; // ou "/products" selon ta route
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  if (!storedProduct) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        Aucun produit sélectionné pour modification
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Modifier le Produit</h1>
        <p className="text-gray-600 mt-2">Mettez à jour les informations du produit</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du produit</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (TND)</label>
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité en stock</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity || ""}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
            <select
              name="categoryId"
              value={form.category?.id || form.categoryId || ""}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fournisseur */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fournisseur</label>
            <select
              name="supplierId"
              value={form.supplier?.id || form.supplierId || ""}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sélectionner un fournisseur</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Image du produit</label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center">
            {imagePreview ? (
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-2xl shadow-md object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-5xl mb-4">
                📦
              </div>
            )}

            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              {imagePreview ? "Changer l'image" : "Choisir une nouvelle image"}
            </label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG</p>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-2xl transition-all shadow-lg"
        >
          {loading ? "Mise à jour en cours..." : "Mettre à jour le produit"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;