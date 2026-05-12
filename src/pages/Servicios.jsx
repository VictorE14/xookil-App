import BottomNav from '../components/BottomNav'

export default function Servicios() {
  return (
    <>
      <div className="page">
        <h2>Servicios Públicos</h2>
        
        <div className="tramite-card" style={{ marginBottom: '16px' }}>
          <div className="tramite-icon">💧</div>
          <div className="tramite-title">Servicio de Agua (CAPA)</div>
          <button style={{ marginTop: '12px' }}>Ir al sitio oficial</button>
        </div>
        
        <div className="tramite-card">
          <div className="tramite-icon">⚡</div>
          <div className="tramite-title">Electricidad (CFE)</div>
          <button style={{ marginTop: '12px' }}>Ir al sitio oficial</button>
        </div>
      </div>
      <BottomNav />
    </>
  )
}