import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { icon: '🏠', label: 'Inicio', path: '/home' },
    { icon: '📋', label: 'Trámites', path: '/tramites' },
    { icon: '📰', label: 'Noticias', path: '/noticias' },
    { icon: '👤', label: 'Perfil', path: '/profile' },
  ]

  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}