import './ArchitectureDiagram.css';

export default function ArchitectureDiagram({ nodos, circuitState }) {
  const pagos1Status = nodos.find(n => n.nombre === 'Pagos1')?.estado || 'DESCONOCIDO';
  const pagos2Status = nodos.find(n => n.nombre === 'Pagos2')?.estado || 'DESCONOCIDO';

  const getStatusClass = (estado) => {
    if (estado === 'ACTIVO') return 'active';
    if (estado === 'INACTIVO') return 'inactive';
    return 'unknown';
  };

  const getCircuitClass = () => {
    if (circuitState === 'CLOSED') return 'closed';
    if (circuitState === 'OPEN') return 'open';
    if (circuitState === 'HALF_OPEN') return 'half-open';
    return 'unknown';
  };

  return (
    <div className="arch-diagram animate-fade-in-up stagger-2" id="architecture-diagram">
      <h2 className="arch-diagram__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="22" height="18" rx="2" />
          <line x1="8" y1="21" x2="8" y2="3" />
        </svg>
        Arquitectura del Sistema
      </h2>

      <div className="arch-diagram__canvas">
        {/* Client */}
        <div className="arch-diagram__layer arch-diagram__layer--client">
          <div className="arch-diagram__box arch-diagram__box--client">
            <div className="arch-diagram__box-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="arch-diagram__box-label">Cliente</span>
            <span className="arch-diagram__box-detail">Máquina 5</span>
          </div>
        </div>

        <div className="arch-diagram__connector arch-diagram__connector--vertical">
          <div className="arch-diagram__connector-line arch-diagram__connector-line--animated" />
        </div>

        {/* Orchestrator */}
        <div className="arch-diagram__layer">
          <div className={`arch-diagram__box arch-diagram__box--orquestador arch-diagram__box--${getCircuitClass()}`}>
            <div className="arch-diagram__box-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="arch-diagram__box-label">Orquestador</span>
            <span className="arch-diagram__box-detail">Máq 4 · :8081</span>
            <div className={`arch-diagram__circuit-badge arch-diagram__circuit-badge--${getCircuitClass()}`}>
              CB: {circuitState}
            </div>
          </div>
        </div>

        <div className="arch-diagram__connector arch-diagram__connector--vertical">
          <div className={`arch-diagram__connector-line ${circuitState === 'OPEN' ? 'arch-diagram__connector-line--blocked' : 'arch-diagram__connector-line--animated'}`} />
          {circuitState === 'OPEN' && (
            <span className="arch-diagram__connector-x">✕</span>
          )}
        </div>

        {/* Load Balancer */}
        <div className="arch-diagram__layer">
          <div className="arch-diagram__box arch-diagram__box--balanceador">
            <div className="arch-diagram__box-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <span className="arch-diagram__box-label">Balanceador</span>
            <span className="arch-diagram__box-detail">Máq 3 · :8080 · Heartbeat</span>
          </div>
        </div>

        {/* Fork to backends */}
        <div className="arch-diagram__fork">
          <div className="arch-diagram__fork-branch">
            <div className="arch-diagram__connector arch-diagram__connector--vertical">
              <div className={`arch-diagram__connector-line ${pagos1Status === 'ACTIVO' ? 'arch-diagram__connector-line--animated' : 'arch-diagram__connector-line--blocked'}`} />
            </div>
            <div className={`arch-diagram__box arch-diagram__box--backend arch-diagram__box--${getStatusClass(pagos1Status)}`}>
              <div className="arch-diagram__box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <circle cx="6" cy="6" r="1" fill="currentColor" />
                  <circle cx="6" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="arch-diagram__box-label">Pagos1</span>
              <span className="arch-diagram__box-detail">Máq 1 · :9001</span>
              <div className={`arch-diagram__status-dot arch-diagram__status-dot--${getStatusClass(pagos1Status)}`} />
            </div>
          </div>
          <div className="arch-diagram__fork-branch">
            <div className="arch-diagram__connector arch-diagram__connector--vertical">
              <div className={`arch-diagram__connector-line ${pagos2Status === 'ACTIVO' ? 'arch-diagram__connector-line--animated' : 'arch-diagram__connector-line--blocked'}`} />
            </div>
            <div className={`arch-diagram__box arch-diagram__box--backend arch-diagram__box--${getStatusClass(pagos2Status)}`}>
              <div className="arch-diagram__box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <circle cx="6" cy="6" r="1" fill="currentColor" />
                  <circle cx="6" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="arch-diagram__box-label">Pagos2</span>
              <span className="arch-diagram__box-detail">Máq 2 · :9002</span>
              <div className={`arch-diagram__status-dot arch-diagram__status-dot--${getStatusClass(pagos2Status)}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
