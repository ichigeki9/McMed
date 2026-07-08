import { useEffect, useState } from 'react'
import { adminFetchEnrollments, adminFetchCourses } from '../../api/admin'

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pl-PL') + ', ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

export default function ParticipantList() {
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses]         = useState([])
  const [courseFilter, setCourseFilter] = useState('')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  useEffect(() => {
    adminFetchCourses().then(setCourses).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    adminFetchEnrollments(courseFilter)
      .then(setEnrollments)
      .catch(() => setError('Nie udało się pobrać uczestników. Sprawdź czy jesteś zalogowany.'))
      .finally(() => setLoading(false))
  }, [courseFilter])

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Uczestnicy</h1>
          <p className="text-gray-500 text-sm">
            {!loading && !error && `${enrollments.length} zapis${enrollments.length === 1 ? '' : enrollments.length < 5 ? 'y' : 'ów'}`}
          </p>
        </div>

        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Wszystkie kursy</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Ładowanie…
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && enrollments.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
          Brak zapisanych uczestników{courseFilter ? ' dla wybranego kursu' : ''}.
        </div>
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3.5 font-semibold text-gray-600">Uczestnik</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">PESEL</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Data ur.</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Kontakt</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Adres</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Kurs</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Zgoda foto</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Zapisano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {e.last_name} {e.first_name}
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-mono tracking-wide">
                    {e.pesel}
                  </td>
                  <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(e.birth_date)}
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                    <div>{e.email}</div>
                    <div>{e.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                    <div>{e.street} {e.house_number}{e.apartment_number ? `/${e.apartment_number}` : ''}</div>
                    <div>{e.zip_code} {e.city}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 max-w-[180px]">
                    <span className="line-clamp-2 text-xs">{e.course_name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      e.photo_consent
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {e.photo_consent ? 'Tak' : 'Nie'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {formatDateTime(e.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
