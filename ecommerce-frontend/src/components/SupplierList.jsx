import React, { useEffect, useState } from "react";
import { API } from "../api";
import { 
  Plus, Edit2, Trash2, Search, Loader2 
} from "lucide-react"; // Installez lucide-react : npm install lucide-react

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    API.get("/suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur lors du chargement des fournisseurs");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le fournisseur "${name}" ?`)) {
      API.delete(`/suppliers/${id}`)
        .then(() => {
          setSuppliers(suppliers.filter((s) => s.id !== id));
        })
        .catch((err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        });
    }
  };

  const handleEdit = (supplier) => {
    localStorage.setItem("editSupplier", JSON.stringify(supplier));
    window.location.href = "/edit-supplier";
  };

  // Filtrage
  const filteredSuppliers = suppliers.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fournisseurs</h1>
          <p className="text-gray-500 mt-1">Gestion de votre liste de fournisseurs</p>
        </div>
        
        <button
          onClick={() => (window.location.href = "/add-supplier")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} />
          Ajouter un fournisseur
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Rechercher un fournisseur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Nom</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600 w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 text-gray-500 font-medium">#{s.id}</td>
                      <td className="px-6 py-5 font-semibold text-gray-800">{s.name}</td>
                      <td className="px-6 py-5 text-gray-600">{s.contact}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-3 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                            title="Modifier"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            className="p-3 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-16 text-gray-500">
                      Aucun fournisseur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info en bas */}
      <p className="text-center text-sm text-gray-400 mt-6">
        {filteredSuppliers.length} fournisseur{filteredSuppliers.length > 1 ? 's' : ''} trouvé{filteredSuppliers.length > 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default SupplierList;