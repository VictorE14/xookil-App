import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { AccessibilityContext } from '../contexts/AccessibilityContext'
import { LanguageContext } from '../contexts/LanguageContext'
import html2pdf from 'html2pdf.js'

export default function CurpInstructions() {
  const navigate = useNavigate()
  const { speak, voiceEnabled } = useContext(AccessibilityContext)
  const { t } = useContext(LanguageContext)
  const contentRef = useRef()

  const steps = t('steps.curp')
  const stepsArray = Array.isArray(steps) ? steps : [
    'Abre la app y toca el botón CURP',
    'Escribe tu nombre completo',
    'Pon tu fecha de nacimiento',
    'Toca "Buscar" y espera el resultado',
    'Guarda o imprime tu CURP'
  ]

  const handleSpeakAll = () => {
    if (voiceEnabled) {
      const allText = `Instrucciones para obtener CURP: ${stepsArray.join('. ')}`
      speak(allText)
    }
  }

  const handleStepClick = (stepText) => {
    if (voiceEnabled) {
      speak(stepText)
    }
  }

  const handleDownloadPDF = () => {
    const element = contentRef.current
    html2pdf().from(element).save('instrucciones-curp.pdf')
  }

  return (
    <>
      <div className="page">
        <div ref={contentRef}>
          <h2>{t('curp')} - {t('instructions')}</h2>
          
          <div className="video-container">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder" 
              title="Video tutorial CURP"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <button onClick={handleSpeakAll}>{t('listen')}</button>
          <button onClick={handleDownloadPDF}>📄 Descargar como PDF</button>
          
          <div className="steps-container">
            <ol className="steps-list">
              {stepsArray.map((step, i) => (
                <li key={i} onClick={() => handleStepClick(step)}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          
          <button onClick={() => window.open('https://www.gob.mx/curp/', '_blank')}>
            {t('officialSite')} CURP
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  )
}