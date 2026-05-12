import BottomNav from '../components/BottomNav'

export default function ActaInstructions() {
  const steps = [
    'Ingresa al portal de actas de nacimiento',
    'Captura tu CURP o datos personales',
    'Verifica que tu información sea correcta',
    'Visualiza la vista previa del acta',
    'Realiza el pago correspondiente',
    'Descarga el acta actualizada en PDF',
    'Guarda o imprime tu documento'
  ]

  return (
    <>
      <div className="page">
        <h2>Acta de Nacimiento</h2>
        <button>🎥 VIDEO TUTORIAL AQUÍ</button>
        <div className="steps-container">
          <ol className="steps-list">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        <button>Ir al sitio oficial de actas</button>
      </div>
      <BottomNav />
    </>
  )
}