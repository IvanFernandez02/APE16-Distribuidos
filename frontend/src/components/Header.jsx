import { useState, useEffect } from 'react';
import './Header.css';

export default function Header({ lastUpdate, onRefresh, config, onConfigOpen }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [lastUpdate]);

  return (
    <header className="header" id="dashboard-header">
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__logo">
            <div className="header__logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div className="header__title-group">
              <h1 className="header__title">
                Distributed Systems
                <span className="header__title-accent"> Monitor</span>
              </h1>
              <p className="header__subtitle">Práctica 15+16 — Heartbeat · Failover · Circuit Breaker</p>
            </div>
          </div>
        </div>

        <div className="header__actions">
          <div className={`header__live-indicator ${pulse ? 'header__live-indicator--pulse' : ''}`}>
            <span className="header__live-dot" />
            <span className="header__live-text">LIVE</span>
          </div>

          {lastUpdate && (
            <span className="header__last-update">
              {lastUpdate.toLocaleTimeString('es-ES')}
            </span>
          )}

          <button
            className="header__btn header__btn--config"
            onClick={onConfigOpen}
            title="Configurar IPs"
            id="btn-config"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>

          <button
            className="header__btn header__btn--refresh"
            onClick={onRefresh}
            title="Refrescar datos"
            id="btn-refresh"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
