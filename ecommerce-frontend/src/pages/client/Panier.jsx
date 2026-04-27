import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

function Panier() {
  const [items, setItems] = useState([])
  const [adresse, setAdresse] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchPanier() }, [])

  const fetchPanier = async () => {
    try {
      const { data } = await api.get('/panier')
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const updateQte = async (id, quantite) => {
    try {
      if (quantite <= 0) {
        await api.delete(`/panier/${id}`)
        toast.success('Article retiré')
      } else {
        await api.put(`/panier/${id}`, { quantite })
      }
      fetchPanier()
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    }
  }

  const supprimer = async (id) => {
    await api.delete(`/panier/${id}`)
    toast.success('Article retiré')
    fetchPanier()
  }

  const vider = async () => {
    if (!confirm('Vider le panier ?')) return
    await api.delete('/panier')
    setItems([])
    toast.success('Panier vidé')
  }

  const total = items.reduce((sum, i) => sum + i.produit.prix * i.quantite, 0)

  const passerCommande = async () => {
    if (!adresse.trim()) {
      toast.error('Veuillez renseigner une adresse de livraison')
      return
    }
    setOrdering(true)
    try {
      await api.post('/commandes/passer', { adresseLivraison: adresse, notes })
      toast.success('Commande passée avec succès !')
      navigate('/mes-commandes')
    } catch (err) {
      toast.error(err.response?.data || 'Erreur lors de la commande')
    } finally {
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-6">Ajoutez des produits depuis le catalogue</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition"
        >
          Voir le catalogue
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Mon Panier</h1>
        <button onClick={vider} className="text-sm text-red-500 hover:underline">
          Vider le panier
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
              {item.produit.imageUrl ? (
                <img src={item.produit.imageUrl} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">🛍️</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.produit.nom}</p>
                <p className="text-indigo-600 font-bold text-sm">{item.produit.prix} DT / unité</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQte(item.id, item.quantite - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition text-lg leading-none"
                >−</button>
                <span className="w-8 text-center font-bold">{item.quantite}</span>
                <button
                  onClick={() => updateQte(item.id, item.quantite + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition text-lg leading-none"
                >+</button>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{(item.produit.prix * item.quantite).toFixed(2)} DT</p>
                <button onClick={() => supprimer(item.id)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé + commande */}
        <div className="bg-white rounded-2xl shadow p-5 h-fit space-y-4">
          <h2 className="font-bold text-gray-800 text-lg">Résumé</h2>

          <div className="flex justify-between text-sm text-gray-500">
            <span>{items.length} article(s)</span>
            <span>{total.toFixed(2)} DT</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-indigo-700 text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} DT</span>
          </div>

          <div className="border-t pt-3 space-y-3">
            <label className="block text-sm font-medium text-gray-700">Adresse de livraison *</label>
            <textarea
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Votre adresse complète..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optionnel)..."
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <button
            onClick={passerCommande}
            disabled={ordering}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
          >
            {ordering ? 'Traitement...' : '✓ Passer la commande'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Panier
