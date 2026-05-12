export default function TramiteCard({ title, desc, icon, onClick }) {
  return (
    <div className="tramite-card" onClick={onClick}>
      <div className="tramite-icon">{icon}</div>
      <div className="tramite-title">{title}</div>
      <div className="tramite-desc">{desc}</div>
    </div>
  )
}