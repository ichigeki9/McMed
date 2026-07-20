import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function ParticipantDashboard() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('participant_access_token')
    if (!token) { navigate('/zaloguj-sie'); return }
    const payload = decodeJwt(token)
    if (!payload) { navigate('/zaloguj-sie'); return }
    setUsername(payload.username || payload.user_id || '')
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('participant_access_token')
    localStorage.removeItem('participant_refresh_token')
    navigate('/zaloguj-sie')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-extrabold text-gray-900 tracking-tight hover:text-red-600 transition-colors">
          Mc Med
        </a>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{username}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Moje konto</h1>
        <p className="text-gray-500 text-sm mb-8">Strefa uczestnika Mc Med</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card icon="📋" title="Moje kursy" description="Historia i nadchodzące kursy" soon />
          <Card icon="📄" title="Materiały" description="Podręczniki i harmonogramy" soon />
          <Card icon="🏅" title="Certyfikaty" description="Wyniki egzaminów i zaświadczenia" soon />
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800">
          Strefa uczestnika jest w trakcie budowy. Wkrótce znajdziesz tu wszystkie informacje
          związane z Twoim kursem.
        </div>
      </main>
    </div>
  )
}

function Card({ icon, title, description, soon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-60">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
      {soon && <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Wkrótce</span>}
    </div>
  )
}
