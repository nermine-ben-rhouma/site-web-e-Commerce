import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()

  // Pas connecté → login
  if (!user) return <Navigate to="/login" replace />

  // Rôle non autorisé → redirection selon son rôle
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'SUPER_ADMIN') return <Navigate to="/superadmin/users" replace />
    if (user.role === 'ADMIN') return <Navigate to="/admin/produits" replace />
    return <Navigate to="/catalogue" replace />
  }

  return children
}

export default ProtectedRoute