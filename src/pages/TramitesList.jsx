import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function TramitesList() {
  const navigate = useNavigate()

  const tramites = [
    { title: 'CURP', path: '/curp', icon: '📄' },
    { title: 'RFC', path: '/rfc', icon: '📑' },
    { title: 'Acta de Nacimiento', path: '/acta', icon: '📜' },
    { title: 'Actualizar RFC', path: '/actualizar-rfc', icon: '🔄' },
    { title: 'Sacar Cita para RFC', path: '/sacar-cita-rfc', icon: '📅' },
    { title: 'Servicios Públicos', path: '/servicios', icon: '💧' },
  ]

  return (
    <>
      <div className="page">
        <h2>Trámites Disponibles</h2>
        <div className="tramites-grid">
          {tramites.map((t, idx) => (
            <div key={idx} className="tramite-card" onClick={() => navigate(t.path)}>
              <div className="tramite-icon">{t.icon}</div>
              <div className="tramite-title">{t.title}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}