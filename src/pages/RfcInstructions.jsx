import BottomNav from '../components/BottomNav'

export default function RfcInstructions() {
  const steps = [
    'Abre la app y toca el botón RFC',
    'Escribe tu nombre completo',
    'Pon tu fecha de nacimiento',
    'Ingresa tu CURP',
    "Toca 'Buscar' y espera el resultado",
    'Guarda o imprime tu RFC'
  ]

  return (
    <>
      <div className="page">
        <h2>RFC - Instrucciones</h2>
        <button>► Escucha todo el proceso</button>
        <div className="steps-container">
          <ol className="steps-list">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        <button>Ir al sitio oficial del SAT</button>
      </div>
      <BottomNav />
    </>
  )
}