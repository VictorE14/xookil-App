import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessibilityContext } from '../contexts/AccessibilityContext'
import { LanguageContext } from '../contexts/LanguageContext'

export default function Preferences() {
  const navigate = useNavigate()
  const { setLargeText, setHighContrast, setVoiceEnabled, speak } = useContext(AccessibilityContext)
  const { setLanguage, t } = useContext(LanguageContext)

  const handleVoiceToggle = () => {
    setVoiceEnabled(prev => {
      const newValue = !prev
      if (newValue) {
        setTimeout(() => speak('Navegación por voz activada. Toca cualquier texto para escucharlo.'), 100)
      }
      return newValue
    })
  }

  return (
    <div className="page">
      <h2>{t('preferences')}</h2>
      <p>Puedes cambiar esto en cualquier momento</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0' }}>
        <button onClick={() => speak('Lector de pantalla activado. Toca cualquier elemento para escuchar.')}>
          📢 Lector de pantalla (toca texto)
        </button>
        <button onClick={handleVoiceToggle}>
          🎤 Navegación por voz (activar/desactivar)
        </button>
        <button onClick={() => setLargeText(prev => !prev)}>
          🔍 Texto grande
        </button>
        <button onClick={() => setHighContrast(prev => !prev)}>
          🎨 Alto contraste
        </button>
        <button onClick={() => {
          setLanguage('maya')
          navigate('/maya')
        }}>
          🗣️ Maya / Español
        </button>
      </div>

      <button onClick={() => navigate('/home')}>{t('continue')}</button>
    </div>
  )
}