import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { nom: '', email: '', telephone: '', adresse: '', siteWeb: '' }

function GestionFournisseurs() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/fournisseurs')
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal(true) }

  const openEdit = (f) => {
    setForm({
      nom: f.nom || '', email: f.email || '',
      telephone: f.telephone || '', adresse: f.adresse || '', siteWeb: f.siteWeb || ''
    })
    setEditId(f.id)
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditId(null); setForm(emptyForm) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`/fournisseurs/${editId}`, form)
        toast.success('Fournisseur modifié !')
      } else {
        await api.post('/fournisseurs', form)
        toast.success('Fournisseur créé !')
      }
      closeModal()
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce fournisseur ?')) return
    try {
      await api.delete(`/fournisseurs/${id}`)
      toast.success('Fournisseur supprimé')
      fetchAll()
    } catch {
      toast.error('Impossible de supprimer')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏭 Gestion des Fournisseurs</h1>
          <p className="text-sm text-gray-500">{items.length} fournisseur(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          + Nouveau fournisseur
        </button>
      </div>

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
                  <th className="px-4 py-3 font-semibold">Nom</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Téléphone</th>
                  <th className="px-4 py-3 font-semibold">Adresse</th>
                  <th className="px-4 py-3 font-semibold">Site web</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">🏭</div>
                        <span className="font-semibold text-gray-800">{f.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{f.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{f.telephone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{f.adresse || '—'}</td>
                    <td className="px-4 py-3">
                      {f.siteWeb ? (
                        <a href={f.siteWeb} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate block max-w-[120px]">
                          {f.siteWeb}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(f)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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
                    <td colSpan={6} className="text-center py-12 text-gray-400">Aucun fournisseur</td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? '✏️ Modifier le fournisseur' : '➕ Nouveau fournisseur'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { field: 'nom', label: 'Nom *', required: true, placeholder: 'Nom du fournisseur' },
                { field: 'email', label: 'Email', type: 'email', placeholder: 'email@fournisseur.com' },
                { field: 'telephone', label: 'Téléphone', placeholder: '+216 XX XXX XXX' },
                { field: 'adresse', label: 'Adresse', placeholder: 'Adresse complète' },
                { field: 'siteWeb', label: 'Site web', placeholder: 'https://...' },
              ].map(({ field, label, type = 'text', required, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type} value={form[field]} onChange={set(field)}
                    placeholder={placeholder} required={required}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
              ))}
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

export default GestionFournisseurs
