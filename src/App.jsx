import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import Login from './pages/Login'
import Preferences from './pages/Preferences'
import Home from './pages/Home'
import CurpInstructions from './pages/CurpInstructions'
import RfcInstructions from './pages/RfcInstructions'
import ActaInstructions from './pages/ActaInstructions'
import Servicios from './pages/Servicios'
import Profile from './pages/Profile'
import MayaVersion from './pages/MayaVersion'
import Noticias from './pages/Noticias'
import TramitesList from './pages/TramitesList'
import ActualizarRFC from './pages/ActualizarRFC'
import SacarCitaRFC from './pages/SacarCitaRFC'

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/home" element={<Home />} />
              <Route path="/curp" element={<CurpInstructions />} />
              <Route path="/rfc" element={<RfcInstructions />} />
              <Route path="/acta" element={<ActaInstructions />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/maya" element={<MayaVersion />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/tramites" element={<TramitesList />} />
              <Route path="/actualizar-rfc" element={<ActualizarRFC />} />
              <Route path="/sacar-cita-rfc" element={<SacarCitaRFC />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AccessibilityProvider>
    </LanguageProvider>
  )
}

export default App