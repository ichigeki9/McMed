export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Witaj w panelu Mc Med</p>

      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Nadchodzące kursy"  value="—" icon="📋" />
        <StatCard label="Zarejestrowani uczestnicy" value="—" icon="👥" />
        <StatCard label="Wolne miejsca łącznie" value="—" icon="🪑" />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
