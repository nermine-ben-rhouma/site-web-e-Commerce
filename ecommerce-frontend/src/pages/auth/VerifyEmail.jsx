import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../../api/axios'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('Token manquant'); return }

    api.get(`/auth/verify-email?token=${token}`)
      .then(r => { setStatus('success'); setMessage(r.data) })
      .catch(err => { setStatus('error'); setMessage(err.response?.data || 'Erreur') })
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Vérification en cours...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email confirmé !</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold">
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/register" className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 font-semibold">
              Réessayer
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail