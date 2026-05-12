import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/preferences')
  }

  return (
    <div className="page">
      <h1>Bienvenido De Nuevo</h1>
      <p>Por favor, inicie sesión en tu cuenta.</p>
      <form onSubmit={handleLogin}>
        <label>Correo electrónico</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <a href="#" style={{ textAlign: 'right', fontSize: '14px' }}>¿Olvidaste la contraseña?</a>

        <button type="submit">INICIAR SESIÓN</button>
        <button type="button" className="google-btn">CONTINUAR CON GOOGLE</button>
      </form>
      <p style={{ textAlign: 'center' }}>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
    </div>
  )
}