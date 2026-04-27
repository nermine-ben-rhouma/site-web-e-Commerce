import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUTS = ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE']

const STATUT_STYLE = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMEE: 'bg-blue-100 text-blue-800',
  EN_PREPARATION: 'bg-orange-100 text-orange-800',
  EXPEDIEE: 'bg-purple-100 text-purple-800',
  LIVREE: 'bg-green-100 text-green-800',
  ANNULEE: 'bg-red-100 text-red-800',
}

const STATUT_LABEL = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_PREPARATION: 'En préparation',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
}

function GestionCommandes() {
  const [commandes, setCommandes] = useState([])
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatut, setFilterStatut] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/commandes')
      setCommandes(data)
    } finally {
      setLoading(false)
    }
  }

  const updateStatut = async (id, statut) => {
    try {
      await api.put(`/commandes/${id}/statut?statut=${statut}`)
      toast.success('Statut mis à jour !')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return
    try {
      await api.delete(`/commandes/${id}`)
      toast.success('Commande supprimée')
      fetchAll()
    } catch {
      toast.error('Erreur')
    }
  }

  const filtered = filterStatut
    ? commandes.filter((c) => c.statut === filterStatut)
    : commandes

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🧾 Gestion des Commandes</h1>
          <p className="text-sm text-gray-500">{commandes.length} commande(s) au total</p>
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s} value={s}>{STATUT_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p>Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-800">Commande #{c.id}</p>
                    <p className="text-xs text-gray-400">
                      {c.user?.email} — {c.dateCommande ? new Date(c.dateCommande).toLocaleDateString('fr-FR') : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Sélecteur statut */}
                  <select
                    value={c.statut}
                    onChange={(e) => updateStatut(c.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${STATUT_STYLE[c.statut]}`}
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>{STATUT_LABEL[s]}</option>
                    ))}
                  </select>

                  <span className="font-bold text-indigo-700 text-sm">{c.total?.toFixed(2)} DT</span>

                  <button
                    onClick={() => setOpen(open === c.id ? null : c.id)}
                    className="text-xs text-indigo-600 hover:underline font-medium"
                  >
                    {open === c.id ? '▲ Fermer' : '▼ Détails'}
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {open === c.id && (
                <div className="border-t bg-gray-50 px-6 py-4">
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                    <p>📍 <strong>Livraison :</strong> {c.adresseLivraison || '—'}</p>
                    <p>👤 <strong>Client :</strong> {c.user?.prenom} {c.user?.nom} ({c.user?.email})</p>
                    {c.notes && <p>📝 <strong>Notes :</strong> {c.notes}</p>}
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-600">
                          <th className="px-4 py-2 text-left font-semibold">Produit</th>
                          <th className="px-4 py-2 text-center font-semibold">Qté</th>
                          <th className="px-4 py-2 text-right font-semibold">P.U.</th>
                          <th className="px-4 py-2 text-right font-semibold">Sous-total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {c.lignes?.map((l) => (
                          <tr key={l.id}>
                            <td className="px-4 py-2 text-gray-700">{l.produit?.nom}</td>
                            <td className="px-4 py-2 text-center text-gray-500">{l.quantite}</td>
                            <td className="px-4 py-2 text-right text-gray-500">{l.prixUnitaire?.toFixed(2)} DT</td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-800">
                              {(l.prixUnitaire * l.quantite).toFixed(2)} DT
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-700">Total</td>
                          <td className="px-4 py-2 text-right font-bold text-indigo-700">{c.total?.toFixed(2)} DT</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GestionCommandes
