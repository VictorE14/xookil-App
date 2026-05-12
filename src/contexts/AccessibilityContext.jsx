import { createContext, useState, useEffect } from 'react'

export const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  // Leer texto con síntesis de voz
  const speak = (text, lang = 'es-ES') => {
    if (!voiceEnabled) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
      setCurrentMessage(text)
      setTimeout(() => setCurrentMessage(''), 3000)
    }
  }

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedLargeText = localStorage.getItem('largeText')
    const savedHighContrast = localStorage.getItem('highContrast')
    const savedVoice = localStorage.getItem('voiceEnabled')
    
    if (savedLargeText === 'true') setLargeText(true)
    if (savedHighContrast === 'true') setHighContrast(true)
    if (savedVoice === 'true') setVoiceEnabled(true)
  }, [])

  // Guardar preferencias
  useEffect(() => {
    localStorage.setItem('largeText', largeText)
    localStorage.setItem('highContrast', highContrast)
    localStorage.setItem('voiceEnabled', voiceEnabled)
  }, [largeText, highContrast, voiceEnabled])

  return (
    <AccessibilityContext.Provider value={{
      largeText, setLargeText,
      highContrast, setHighContrast,
      voiceEnabled, setVoiceEnabled,
      speak, currentMessage
    }}>
      <div className={largeText ? 'large-text' : ''}>
        <div className={highContrast ? 'high-contrast' : ''}>
          {children}
          {currentMessage && (
            <div className="voice-modal">
              🔊 {currentMessage}
            </div>
          )}
        </div>
      </div>
    </AccessibilityContext.Provider>
  )
} 