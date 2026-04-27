import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const emptyForm = { prenom: '', nom: '', email: '', telephone: '', password: '', role: 'ADMIN' }

const ROLE_STYLE = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-blue-100 text-blue-800',
  CLIENT: 'bg-gray-100 text-gray-700',
}

function GestionUsers() {
  const [users, setUsers] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/superadmin/users')
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const closeModal = () => { setModal(false); setForm(emptyForm) }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/superadmin/users', form)
      toast.success('Utilisateur créé !')
      closeModal()
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    }
  }

  const changeRole = async (id, role) => {
    try {
      await api.put(`/superadmin/users/${id}/role?role=${role}`)
      toast.success('Rôle mis à jour !')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const toggleActif = async (id, currentActif) => {
    try {
      await api.put(`/superadmin/users/${id}/toggle-actif`)
      toast.success(currentActif ? 'Utilisateur bloqué' : 'Utilisateur activé')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer définitivement cet utilisateur ?')) return
    try {
      await api.delete(`/superadmin/users/${id}`)
      toast.success('Utilisateur supprimé')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.nom?.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole ? u.role === filterRole : true
    return matchSearch && matchRole
  })

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    clients: users.filter((u) => u.role === 'CLIENT').length,
    superAdmins: users.filter((u) => u.role === 'SUPER_ADMIN').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👑 Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500">Espace Super Administrateur</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          + Créer un utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-700' },
          { label: 'Super Admin', value: stats.superAdmins, color: 'bg-purple-100 text-purple-700' },
          { label: 'Admins', value: stats.admins, color: 'bg-blue-100 text-blue-700' },
          { label: 'Clients', value: stats.clients, color: 'bg-green-100 text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl px-5 py-4`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text" placeholder="🔍 Rechercher..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <select
          value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        >
          <option value="">Tous les rôles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="CLIENT">Client</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left">
                  <th className="px-4 py-3 font-semibold">Utilisateur</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Téléphone</th>
                  <th className="px-4 py-3 font-semibold">Rôle</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Inscrit le</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                          {(u.prenom?.[0] || u.email?.[0] || '?').toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {u.prenom} {u.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.telephone || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${ROLE_STYLE[u.role]}`}
                      >
                        <option value="CLIENT">CLIENT</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActif(u.id, u.actif)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          u.actif
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {u.actif ? '✓ Actif' : '✗ Bloqué'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(u.id)}
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
                    <td colSpan={7} className="text-center py-12 text-gray-400">Aucun utilisateur trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal création */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">➕ Créer un utilisateur</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    value={form.prenom} onChange={set('prenom')} placeholder="Prénom"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    value={form.nom} onChange={set('nom')} placeholder="Nom"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email" value={form.email} onChange={set('email')} placeholder="email@exemple.com" required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  value={form.telephone} onChange={set('telephone')} placeholder="+216 XX XXX XXX"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <input
                  type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required minLength={6}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={form.role} onChange={set('role')}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition">
                  Créer
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

export default GestionUsers
