import BottomNav from '../components/BottomNav'

export default function SacarCitaRFC() {
  const steps = [
    'Ingresa al portal de citas del SAT',
    'Selecciona "Registrar cita"',
    'Elige el trámite que necesitas',
    'Selecciona tu estado y oficina SAT',
    'Escoge fecha y horario disponible',
    'Captura tus datos personales',
    'Confirma la cita',
    'Guarda el comprobante o folio de cita'
  ]

  const requisitos = ['CURP', 'RFC', 'INE o identificación oficial', 'Comprobante de domicilio']

  return (
    <>
      <div className="page">
        <h2>Sacar Cita para RFC</h2>
        <div className="video-container">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
            title="Video tutorial cita RFC"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        
        <h3>Requisitos:</h3>
        <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
          {requisitos.map((req, i) => <li key={i}>{req}</li>)}
        </ul>
        
        <button>► Escucha todo el proceso</button>
        
        <div className="steps-container">
          <ol className="steps-list">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        
        <button onClick={() => window.open('https://citas.sat.gob.mx/', '_blank')}>
          Ir al sitio oficial del SAT - Citas
        </button>
      </div>
      <BottomNav />
    </>
  )
}