import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { nom: '', description: '', imageUrl: '' }

function GestionCategories() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/categories')
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal(true) }

  const openEdit = (c) => {
    setForm({ nom: c.nom || '', description: c.description || '', imageUrl: c.imageUrl || '' })
    setEditId(c.id)
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditId(null); setForm(emptyForm) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form)
        toast.success('Catégorie modifiée !')
      } else {
        await api.post('/categories', form)
        toast.success('Catégorie créée !')
      }
      closeModal()
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Catégorie supprimée')
      fetchAll()
    } catch {
      toast.error('Impossible de supprimer (des produits y sont liés ?)')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏷️ Gestion des Catégories</h1>
          <p className="text-sm text-gray-500">{items.length} catégorie(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          + Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm">🏷️</div>
                      )}
                      <span className="font-semibold text-gray-800">{c.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.description || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">Aucune catégorie</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? '✏️ Modifier la catégorie' : '➕ Nouvelle catégorie'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  value={form.nom} onChange={set('nom')} placeholder="Nom de la catégorie" required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description} onChange={set('description')} placeholder="Description..." rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                <input
                  value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition">
                  {editId ? 'Enregistrer' : 'Créer'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl transition">
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

export default GestionCategories
