import { useState, useEffect } from 'react'
import api from '../../api/axios'

const STATUT_LABELS = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMEE: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  EN_PREPARATION: { label: 'En préparation', color: 'bg-orange-100 text-orange-800' },
  EXPEDIEE: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
  LIVREE: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  ANNULEE: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
}

function MesCommandes() {
  const [commandes, setCommandes] = useState([])
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/commandes/mes-commandes').then((r) => setCommandes(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 Mes Commandes</h1>

      {commandes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p>Vous n'avez pas encore de commande</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((c) => {
            const s = STATUT_LABELS[c.statut] || { label: c.statut, color: 'bg-gray-100 text-gray-700' }
            return (
              <div key={c.id} className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-gray-800">Commande #{c.id}</p>
                    <p className="text-sm text-gray-400">
                      {c.dateCommande ? new Date(c.dateCommande).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="font-bold text-indigo-700">{c.total?.toFixed(2)} DT</span>
                    <button
                      onClick={() => setOpen(open === c.id ? null : c.id)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {open === c.id ? '▲ Fermer' : '▼ Détails'}
                    </button>
                  </div>
                </div>

                {open === c.id && (
                  <div className="border-t px-4 py-4 bg-gray-50">
                    {c.adresseLivraison && (
                      <p className="text-sm text-gray-500 mb-3">📍 {c.adresseLivraison}</p>
                    )}
                    {c.notes && (
                      <p className="text-sm text-gray-400 mb-3 italic">📝 {c.notes}</p>
                    )}
                    <div className="space-y-2">
                      {c.lignes?.map((l) => (
                        <div key={l.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                          <span className="text-gray-700">
                            {l.produit?.nom} <span className="text-gray-400">× {l.quantite}</span>
                          </span>
                          <span className="font-semibold text-gray-800">
                            {(l.prixUnitaire * l.quantite).toFixed(2)} DT
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 font-bold text-indigo-700">
                      Total : {c.total?.toFixed(2)} DT
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MesCommandes
