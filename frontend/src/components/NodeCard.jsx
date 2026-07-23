import './NodeCard.css';

const STATUS_MAP = {
  ACTIVO: { label: 'Activo', className: 'success', icon: '✓' },
  INACTIVO: { label: 'Inactivo', className: 'danger', icon: '✕' },
  DESCONOCIDO: { label: 'Desconocido', className: 'unknown', icon: '?' },
};

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Math.floor(Date.now() / 1000 - ts);
  if (diff < 0) return 'ahora';
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  return `hace ${Math.floor(diff / 3600)}h`;
}

export default function NodeCard({ nodo, index }) {
  const status = STATUS_MAP[nodo.estado] || STATUS_MAP.DESCONOCIDO;

  return (
    <div
      className={`node-card node-card--${status.className} animate-fade-in-up stagger-${index + 1}`}
      id={`node-${nodo.nombre.toLowerCase()}`}
    >
      <div className="node-card__header">
        <div className="node-card__icon-wrap">
          <div className={`node-card__status-ring node-card__status-ring--${status.className}`}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          {nodo.estado === 'ACTIVO' && (
            <span className="node-card__pulse" />
          )}
        </div>
        <div className="node-card__info">
          <h3 className="node-card__name">{nodo.nombre}</h3>
          <span className="node-card__role">Microservicio de Pagos</span>
        </div>
      </div>

      <div className="node-card__body">
        <div className={`node-card__status-badge node-card__status-badge--${status.className}`}>
          <span className="node-card__status-icon">{status.icon}</span>
          <span className="node-card__status-label">{status.label}</span>
        </div>
        
        <div className="node-card__meta">
          <div className="node-card__meta-item">
            <span className="node-card__meta-label">Última actualización</span>
            <span className="node-card__meta-value">{formatTimestamp(nodo.ultimaActualizacion)}</span>
          </div>
          <div className="node-card__meta-item">
            <span className="node-card__meta-label">Heartbeat</span>
            <span className="node-card__meta-value node-card__meta-value--mono">{timeAgo(nodo.ultimaActualizacion)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
