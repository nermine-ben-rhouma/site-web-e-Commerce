import React, { useEffect, useState } from "react";
import { API } from "../api";

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
    supplierId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
    API.get("/suppliers").then((res) => setSuppliers(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("quantity", form.quantity);
    data.append("categoryId", form.categoryId);
    data.append("supplierId", form.supplierId);
    if (form.image) data.append("image", form.image);

    try {
      await API.post("/products", data);
      alert("✅ Produit ajouté avec succès !");
      
      // Réinitialiser le formulaire
      setForm({
        name: "",
        price: "",
        quantity: "",
        categoryId: "",
        supplierId: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Ajouter un Produit</h1>
        <p className="text-gray-600 mt-2">Remplissez les informations du nouveau produit</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du produit</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: iPhone 14 Pro"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (TND)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1000"
            />
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité en stock</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="50"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
              value={form.supplierId}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image du produit</label>
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-blue-400 transition-all">
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
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-4">
                📸
              </div>
              <p className="text-gray-700 font-medium">
                Cliquez pour télécharger une image
              </p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG (max 5MB)</p>
            </label>
            {form.image && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                ✓ {form.image.name}
              </p>
            )}
          </div>
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-2xl transition-all shadow-lg shadow-blue-500/30"
        >
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;