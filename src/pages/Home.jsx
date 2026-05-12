import { useNavigate } from 'react-router-dom'
import TramiteCard from '../components/TramiteCard'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const navigate = useNavigate()

  const tramites = [
    { title: 'CURP', desc: 'Consultar información', path: '/curp', icon: '📄' },
    { title: 'RFC', desc: 'Consultar información', path: '/rfc', icon: '📑' },
    { title: 'Acta de Nacimiento', desc: 'Consultar información', path: '/acta', icon: '📜' },
    { title: 'Servicios Públicos', desc: 'Consultar información', path: '/servicios', icon: '💧' }
  ]

  return (
    <>
      <div className="page">
        <h1>¿Cómo lo podemos ayudar?</h1>
        <div className="tramites-grid">
          {tramites.map((t, idx) => (
            <TramiteCard key={idx} {...t} onClick={() => navigate(t.path)} />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}