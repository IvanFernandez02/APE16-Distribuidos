import './CircuitLog.css';

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  return d.toLocaleString('es-ES', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatTimestampFull(ts) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  return d.toLocaleString('es-ES');
}

const STATE_EMOJI = {
  CLOSED: { icon: '✓', className: 'success' },
  OPEN: { icon: '✕', className: 'danger' },
  HALF_OPEN: { icon: '◉', className: 'warning' },
};

export default function CircuitLog({ log, error }) {
  const reversedLog = [...log].reverse();

  return (
    <div className="circuit-log animate-fade-in-up stagger-4" id="circuit-log-panel">
      <div className="circuit-log__header">
        <div className="circuit-log__title-group">
          <h2 className="circuit-log__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Historial del Circuit Breaker
          </h2>
          <span className="circuit-log__count">{log.length} eventos</span>
        </div>
      </div>

      {error && (
        <div className="circuit-log__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Error al cargar el historial: {error}</span>
        </div>
      )}

      {reversedLog.length === 0 && !error ? (
        <div className="circuit-log__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>No hay eventos registrados aún</p>
          <span>Los cambios de estado del Circuit Breaker aparecerán aquí</span>
        </div>
      ) : (
        <div className="circuit-log__timeline">
          {reversedLog.map((entry, i) => {
            const stateInfo = STATE_EMOJI[entry.estado] || { icon: '?', className: 'unknown' };
            return (
              <div
                key={`${entry.timestamp}-${i}`}
                className={`circuit-log__entry circuit-log__entry--${stateInfo.className}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="circuit-log__entry-timeline">
                  <div className={`circuit-log__entry-dot circuit-log__entry-dot--${stateInfo.className}`}>
                    <span>{stateInfo.icon}</span>
                  </div>
                  {i < reversedLog.length - 1 && <div className="circuit-log__entry-line" />}
                </div>
                <div className="circuit-log__entry-content">
                  <div className="circuit-log__entry-header">
                    <span className={`circuit-log__entry-state circuit-log__entry-state--${stateInfo.className}`}>
                      {entry.estado}
                    </span>
                    <span className="circuit-log__entry-time" title={formatTimestampFull(entry.timestamp)}>
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.detalle && (
                    <p className="circuit-log__entry-detail">{entry.detalle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
