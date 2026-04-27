import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = {
  nom: '', description: '', prix: '', stock: '', imageUrl: '',
  categorieId: '', fournisseurId: ''
}

function GestionProduits() {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAll()
    api.get('/categories').then((r) => setCategories(r.data))
    api.get('/fournisseurs').then((r) => setFournisseurs(r.data))
  }, [])
  

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/produits')
      setProduits(data)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const openCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setModal(true)
  }

  const openEdit = (p) => {
    setForm({
      nom: p.nom || '',
      description: p.description || '',
      prix: p.prix || '',
      stock: p.stock || '',
      imageUrl: p.imageUrl || '',
      categorieId: p.categorie?.id || '',
      fournisseurId: p.fournisseur?.id || '',
    })
    setEditId(p.id)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEditId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      nom: form.nom,
      description: form.description,
      prix: parseFloat(form.prix),
      stock: parseInt(form.stock),
      imageUrl: form.imageUrl,
      categorie: form.categorieId ? { id: parseInt(form.categorieId) } : null,
      fournisseur: form.fournisseurId ? { id: parseInt(form.fournisseurId) } : null,
    }
    try {
      if (editId) {
        await api.put(`/produits/${editId}`, payload)
        toast.success('Produit modifié !')
      } else {
        await api.post('/produits', payload)
        toast.success('Produit créé !')
      }
      closeModal()
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Désactiver ce produit ?')) return
    try {
      await api.delete(`/produits/${id}`)
      toast.success('Produit désactivé')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const filtered = produits.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📦 Gestion des Produits</h1>
          <p className="text-sm text-gray-500">{produits.length} produit(s) au total</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          + Nouveau produit
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  <th className="px-4 py-3 font-semibold">Produit</th>
                  <th className="px-4 py-3 font-semibold">Prix</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Catégorie</th>
                  <th className="px-4 py-3 font-semibold">Fournisseur</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-lg">🛍️</div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{p.nom}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-indigo-600">{p.prix} DT</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.categorie?.nom || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.fournisseur?.nom || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">Aucun produit trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-box max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  value={form.nom} onChange={set('nom')} placeholder="Nom du produit" required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description} onChange={set('description')} placeholder="Description du produit" rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DT) *</label>
                  <input
                    type="number" step="0.01" min="0" value={form.prix} onChange={set('prix')} placeholder="0.00" required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number" min="0" value={form.stock} onChange={set('stock')} placeholder="0" required
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                <input
                  value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={form.categorieId} onChange={set('categorieId')}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="">-- Sélectionner --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <select
                  value={form.fournisseurId} onChange={set('fournisseurId')}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="">-- Sélectionner --</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id} value={f.id}>{f.nom}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition"
                >
                  {editId ? 'Enregistrer' : 'Créer'}
                </button>
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition"
                >
                  Annuler
                </button>
                
              </div>
            </form>
          </div>
        </div>
        
      )}
    </div>
  )
}

export default GestionProduits
