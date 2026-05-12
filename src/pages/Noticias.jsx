import BottomNav from '../components/BottomNav'

export default function Noticias() {
  const noticias = [
    { title: 'Nueva plataforma CURP 2025', date: '15 Mayo 2026', summary: 'El gobierno lanza nueva plataforma para obtener CURP en línea.' },
    { title: 'SAT actualiza requisitos RFC', date: '10 Mayo 2026', summary: 'Nuevos requisitos para obtener RFC personas morales.' },
    { title: 'Acta de nacimiento gratuita', date: '5 Mayo 2026', summary: 'Promoción: obtén tu acta de nacimiento sin costo.' },
  ]

  return (
    <>
      <div className="page">
        <h2>Noticias</h2>
        {noticias.map((noticia, i) => (
          <div key={i} className="tramite-card" style={{ textAlign: 'left', marginBottom: '16px' }}>
            <div className="tramite-title">{noticia.title}</div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{noticia.date}</div>
            <div className="tramite-desc">{noticia.summary}</div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  )
}