import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Catalogue from './pages/client/Catalogue'
import Panier from './pages/client/Panier'
import MesCommandes from './pages/client/MesCommandes'
import GestionProduits from './pages/admin/GestionProduits'
import GestionCategories from './pages/admin/GestionCategories'
import GestionFournisseurs from './pages/admin/GestionFournisseurs'
import GestionCommandes from './pages/admin/GestionCommandes'
import GestionUsers from './pages/superadmin/GestionUsers'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN', 'SUPER_ADMIN']}>
                <Catalogue />
              </ProtectedRoute>
            } />
            <Route path="/catalogue" element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN', 'SUPER_ADMIN']}>
                <Catalogue />
              </ProtectedRoute>
            } />
            <Route path="/panier" element={
              <ProtectedRoute roles={['CLIENT']}>
                <Panier />
              </ProtectedRoute>
            } />
            <Route path="/mes-commandes" element={
              <ProtectedRoute roles={['CLIENT']}>
                <MesCommandes />
              </ProtectedRoute>
            } />
            <Route path="/admin/produits" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <GestionProduits />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <GestionCategories />
              </ProtectedRoute>
            } />
            <Route path="/admin/fournisseurs" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <GestionFournisseurs />
              </ProtectedRoute>
            } />
            <Route path="/admin/commandes" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <GestionCommandes />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/users" element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <GestionUsers />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App