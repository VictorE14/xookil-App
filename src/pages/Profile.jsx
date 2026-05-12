import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()

  const user = {
    name: 'Juan Carlos Hernández García',
    email: 'juan.hernandez@example.com',
    curp: 'HEGJ850312HDFRNN09',
    rfc: 'HEGJ850312A1B',
    phone: '+52 55 1234 5678',
    address: 'Av. Reforma 123, Col. Centro, CDMX'
  }

  return (
    <>
      <div className="page">
        <h2>Mi Perfil</h2>
        <p><strong>{user.name}</strong><br />{user.email}</p>
        
        <div style={{ background: '#f0f0f0', borderRadius: '20px', padding: '16px', margin: '20px 0' }}>
          <p><strong>CURP:</strong> {user.curp}</p>
          <p><strong>RFC:</strong> {user.rfc}</p>
          <p><strong>Teléfono:</strong> {user.phone}</p>
          <p><strong>Dirección:</strong> {user.address}</p>
        </div>

        <button>Editar Perfil</button>
        <button className="google-btn" style={{ marginTop: '8px' }} onClick={() => navigate('/')}>Cerrar Sesión</button>
      </div>
      <BottomNav />
    </>
  )
}