import { useState, useEffect } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

function Catalogue() {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data))
    fetchProduits()
  }, [])

  const fetchProduits = async (s = '', c = '') => {
    setLoading(true)
    try {
      const params = {}
      if (s) params.search = s
      if (c) params.categorieId = c
      const { data } = await api.get('/produits', { params })
      setProduits(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (val) => {
    setSearch(val)
    fetchProduits(val, categorieId)
  }

  const handleCategorie = (val) => {
    setCategorieId(val)
    fetchProduits(search, val)
  }

  const ajouterAuPanier = async (produitId) => {
    setAddingId(produitId)
    try {
      await api.post('/panier', { produitId, quantite: 1 })
      toast.success('Ajouté au panier !')
    } catch (err) {
      toast.error(err.response?.data || 'Erreur')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Catalogue</h1>
        <p className="text-gray-500">Découvrez nos produits</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <select
          value={categorieId}
          onChange={(e) => handleCategorie(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : produits.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p>Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {produits.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition flex flex-col overflow-hidden"
            >
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.nom} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl">
                  🛍️
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-indigo-500 font-medium mb-1">
                  {p.categorie?.nom || 'Non classé'}
                </span>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{p.nom}</h3>
                <p className="text-gray-400 text-xs flex-1 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-indigo-600 font-bold text-lg">{p.prix} DT</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Épuisé'}
                  </span>
                </div>
                <button
                  onClick={() => ajouterAuPanier(p.id)}
                  disabled={p.stock === 0 || addingId === p.id}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold py-2 rounded-xl transition"
                >
                  {addingId === p.id ? '...' : p.stock === 0 ? 'Rupture de stock' : '+ Panier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalogue
