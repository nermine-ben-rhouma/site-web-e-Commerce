import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? 'bg-white/20 text-white font-semibold'
      : 'text-white/80 hover:text-white hover:bg-white/10'

  return (
    <nav className="bg-indigo-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
          🛒 ShopApp
        </Link>

        <div className="flex items-center gap-1 text-sm">

          {/* ── CLIENT ── */}
          {user?.role === 'CLIENT' && (
            <>
              <Link to="/catalogue" className={`px-3 py-1.5 rounded-lg transition ${isActive('/catalogue')}`}>
                Catalogue
              </Link>
              <Link to="/panier" className={`px-3 py-1.5 rounded-lg transition ${isActive('/panier')}`}>
                🛒 Panier
              </Link>
              <Link to="/mes-commandes" className={`px-3 py-1.5 rounded-lg transition ${isActive('/mes-commandes')}`}>
                Commandes
              </Link>
            </>
          )}

          {/* ── ADMIN ── */}
          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <>
              <Link to="/admin/produits" className={`px-3 py-1.5 rounded-lg transition ${isActive('/admin/produits')}`}>
                Produits
              </Link>
              <Link to="/admin/categories" className={`px-3 py-1.5 rounded-lg transition ${isActive('/admin/categories')}`}>
                Catégories
              </Link>
              <Link to="/admin/fournisseurs" className={`px-3 py-1.5 rounded-lg transition ${isActive('/admin/fournisseurs')}`}>
                Fournisseurs
              </Link>
              <Link to="/admin/commandes" className={`px-3 py-1.5 rounded-lg transition ${isActive('/admin/commandes')}`}>
                Commandes
              </Link>
            </>
          )}

          {/* ── SUPER ADMIN ── */}
          {user?.role === 'SUPER_ADMIN' && (
            <Link to="/superadmin/users"
              className={`px-3 py-1.5 rounded-lg transition text-yellow-300 font-bold ${isActive('/superadmin/users')}`}>
              👑 Utilisateurs
            </Link>
          )}

          {/* ── USER INFO + LOGOUT ── */}
          {user ? (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/30">
              <span className="text-white/70 text-xs hidden sm:block">
                {user.role} — {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
              Connexion
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar