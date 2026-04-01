import React, { useEffect, useState } from "react";
import { API } from "../api";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const SupplierForm = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editSupplier = JSON.parse(localStorage.getItem("editSupplier"));
    if (editSupplier) {
      setName(editSupplier.name || "");
      setContact(editSupplier.contact || "");
      setId(editSupplier.id);
      localStorage.removeItem("editSupplier");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { name, contact };

    if (id) {
      API.put(`/suppliers/${id}`, payload)
        .then(() => {
          window.location.href = "/suppliers";
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de la modification");
        })
        .finally(() => setLoading(false));
    } else {
      API.post("/suppliers", payload)
        .then(() => {
          window.location.href = "/suppliers";
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de l'ajout");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => (window.location.href = "/suppliers")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? "Modifier le fournisseur" : "Nouveau fournisseur"}
            </h1>
            <p className="text-gray-500 mt-1">
              {id ? "Mettez à jour les informations" : "Remplissez les informations du fournisseur"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du fournisseur
              </label>
              <input
                type="text"
                placeholder="Ex: Société ABC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact
              </label>
              <input
                type="text"
                placeholder="Ex: +216 98 123 456 ou email@exemple.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => (window.location.href = "/suppliers")}
                className="flex-1 py-4 border border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    {id ? "Enregistrer les modifications" : "Ajouter le fournisseur"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;