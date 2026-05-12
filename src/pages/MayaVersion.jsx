import BottomNav from '../components/BottomNav'

export default function MayaVersion() {
  return (
    <>
      <div className="page">
        <h1>K'iimak óolal</h1>
        <p>Ti' le apartado'o' le', k'a'abet a beetik a peticiones ichil maayat'aan</p>
        
        <div className="tramites-grid">
          <div className="tramite-card">
            <div className="tramite-icon">📄</div>
            <div className="tramite-title">CURP</div>
            <div className="tramite-desc">Píisil le apartado' le'</div>
          </div>
          <div className="tramite-card">
            <div className="tramite-icon">📑</div>
            <div className="tramite-title">RFC</div>
            <div className="tramite-desc">Píisil le apartado' le'</div>
          </div>
          <div className="tramite-card">
            <div className="tramite-icon">📜</div>
            <div className="tramite-title">Acta u síijil</div>
            <div className="tramite-desc">Píisil le apartado' le'</div>
          </div>
          <div className="tramite-card">
            <div className="tramite-icon">💧</div>
            <div className="tramite-title">Servicios</div>
            <div className="tramite-desc">Píisil le apartado' le'</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}