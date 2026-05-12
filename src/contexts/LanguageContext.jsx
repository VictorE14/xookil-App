import { createContext, useState, useEffect } from 'react'

export const LanguageContext = createContext()

const translations = {
  es: {
    // General
    welcome: 'Bienvenido De Nuevo',
    login: 'INICIAR SESIÓN',
    google: 'CONTINUAR CON GOOGLE',
    noAccount: '¿No tienes una cuenta?',
    register: 'Regístrate',
    email: 'Correo electrónico',
    password: 'Contraseña',
    forgot: '¿Olvidaste la contraseña?',
    preferences: '¿Cómo prefieres ver la información?',
    continue: 'Continuar →',
    home: 'Inicio',
    tramites: 'Trámites',
    noticias: 'Noticias',
    perfil: 'Perfil',
    help: '¿Cómo lo podemos ayudar?',
    consultar: 'Consultar información',
    curp: 'CURP',
    rfc: 'RFC',
    acta: 'Acta de Nacimiento',
    servicios: 'Servicios Públicos',
    instructions: 'Instrucciones',
    listen: '► Escucha todo el proceso',
    officialSite: 'Ir al sitio oficial',
    videoTutorial: '🎥 VIDEO TUTORIAL AQUÍ',
    profile: 'Mi Perfil',
    editProfile: 'Editar Perfil',
    logout: 'Cerrar Sesión',
    steps: {
      curp: [
        'Abre la app y toca el botón CURP',
        'Escribe tu nombre completo',
        'Pon tu fecha de nacimiento',
        'Toca "Buscar" y espera el resultado',
        'Guarda o imprime tu CURP'
      ],
      rfc: [
        'Abre la app y toca el botón RFC',
        'Escribe tu nombre completo',
        'Pon tu fecha de nacimiento',
        'Ingresa tu CURP',
        'Toca "Buscar" y espera el resultado',
        'Guarda o imprime tu RFC'
      ],
      acta: [
        'Ingresa al portal de actas de nacimiento',
        'Captura tu CURP o datos personales',
        'Verifica que tu información sea correcta',
        'Visualiza la vista previa del acta',
        'Realiza el pago correspondiente',
        'Descarga el acta actualizada en PDF',
        'Guarda o imprime tu documento'
      ]
    }
  },
  maya: {
    welcome: "K'iimak óolal",
    login: "OKOL",
    google: "CONTINUAR YÉETEL GOOGLE",
    noAccount: "¿Miná'an cuenta?",
    register: "Ts'íib",
    email: "Correo electrónico",
    password: "Contraseña",
    forgot: "¿Tu'ub a contraseña?",
    preferences: "¿Bix a k'áat a wilik le información?",
    continue: "Continuar →",
    home: "Inicio",
    tramites: "Trámites",
    noticias: "Noticias",
    perfil: "Perfil",
    help: "¿Bix k'áat a ts'aik áantaj?",
    consultar: "Píisil le apartado' le'",
    curp: "CURP",
    rfc: "RFC",
    acta: "Acta u síijil",
    servicios: "Servicios Públicos",
    instructions: "U meyajil",
    listen: "► Escucha tuláakal le proceso",
    officialSite: "Bin ti' le sitio oficial",
    videoTutorial: "🎥 VIDEO TUTORIAL TE'ELA'",
    profile: "U informaciónil personal",
    editProfile: "K'ex Perfil",
    logout: "Ts'o'ok sesión",
    steps: {
      curp: [
        "Abre le app y toca le botón CURP",
        "Ts'íib a k'aaba' tuláakal",
        "Ts'íib a k'iinil síijil",
        "Toca 'Buscar' y éespera le resultado",
        "Guarda wa imprimir a CURP"
      ],
      rfc: [
        "Abre le app y toca le botón RFC",
        "Ts'íib a k'aaba' tuláakal",
        "Ts'íib a k'iinil síijil",
        "Ts'íib a CURP",
        "Toca 'Buscar' y éespera le resultado",
        "Guarda wa imprimir a RFC"
      ],
      acta: [
        "Okol ti' le portal actas u síijil",
        "Ts'íib a CURP wa a datos personales",
        "Verifica ma'alob a información",
        "Iláa le vista previa u acta",
        "Beet le pago correspondiente",
        "Je'el a wáantik le acta túumbenil ichil PDF",
        "Guarda wa imprimir a documento"
      ]
    }
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const savedLang = localStorage.getItem('language')
    if (savedLang) setLanguage(savedLang)
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        return key
      }
    }
    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}