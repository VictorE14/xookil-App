import BottomNav from '../components/BottomNav'

export default function ActualizarRFC() {
  const steps = [
    'Entra al portal oficial del SAT',
    'Inicia sesión con tu RFC y contraseña',
    'Ve a "Actualización al RFC"',
    'Selecciona el dato que deseas modificar',
    'Captura la nueva información',
    'Verifica que los datos sean correctos',
    'Envía la solicitud',
    'Descarga o guarda el acuse de actualización'
  ]

  return (
    <>
      <div className="page">
        <h2>Actualizar RFC</h2>
        <div className="video-container">
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
            title="Video tutorial actualizar RFC"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        <button>► Escucha todo el proceso</button>
        <div className="steps-container">
          <ol className="steps-list">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        <button onClick={() => window.open('https://citas.sat.gob.mx/', '_blank')}>
          Ir al sitio oficial del SAT
        </button>
      </div>
      <BottomNav />
    </>
  )
}