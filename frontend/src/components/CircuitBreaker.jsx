import { useEffect, useState } from 'react';
import './CircuitBreaker.css';

const STATE_CONFIG = {
  CLOSED: {
    label: 'CLOSED',
    labelEs: 'Cerrado',
    className: 'closed',
    description: 'Tráfico normal — todas las peticiones pasan al balanceador.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  OPEN: {
    label: 'OPEN',
    labelEs: 'Abierto',
    className: 'open',
    description: 'Circuito abierto — fallback inmediato, sin contactar el balanceador.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
  HALF_OPEN: {
    label: 'HALF_OPEN',
    labelEs: 'Semi-Abierto',
    className: 'half-open',
    description: 'Probando — deja pasar una petición de prueba para verificar recuperación.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  DESCONOCIDO: {
    label: 'UNKNOWN',
    labelEs: 'Desconocido',
    className: 'unknown',
    description: 'No se puede determinar el estado del Circuit Breaker.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
};

export default function CircuitBreaker({ state, error }) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.DESCONOCIDO;
  const [animate, setAnimate] = useState(false);
  const [prevState, setPrevState] = useState(state);

  useEffect(() => {
    if (state !== prevState) {
      setAnimate(true);
      setPrevState(state);
      const t = setTimeout(() => setAnimate(false), 800);
      return () => clearTimeout(t);
    }
  }, [state, prevState]);

  return (
    <div className={`circuit-breaker circuit-breaker--${config.className} ${animate ? 'circuit-breaker--animate' : ''} animate-fade-in-up stagger-3`} id="circuit-breaker-panel">
      <div className="circuit-breaker__visual">
        <div className="circuit-breaker__state-diagram">
          {/* Circuit diagram visualization */}
          <div className="circuit-breaker__flow">
            <div className={`circuit-breaker__node circuit-breaker__node--closed ${state === 'CLOSED' ? 'circuit-breaker__node--active' : ''}`}>
              <div className="circuit-breaker__node-dot" />
              <span>CLOSED</span>
            </div>
            <div className={`circuit-breaker__arrow ${state === 'OPEN' ? 'circuit-breaker__arrow--active' : ''}`}>
              <svg width="24" height="14" viewBox="0 0 40 14" preserveAspectRatio="xMidYMid meet">
                <path d="M0 7 L30 7 M25 2 L32 7 L25 12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="circuit-breaker__arrow-label">{`≥3 fallos`}</span>
            </div>
            <div className={`circuit-breaker__node circuit-breaker__node--open ${state === 'OPEN' ? 'circuit-breaker__node--active' : ''}`}>
              <div className="circuit-breaker__node-dot" />
              <span>OPEN</span>
            </div>
            <div className={`circuit-breaker__arrow ${state === 'HALF_OPEN' ? 'circuit-breaker__arrow--active' : ''}`}>
              <svg width="24" height="14" viewBox="0 0 40 14" preserveAspectRatio="xMidYMid meet">
                <path d="M0 7 L30 7 M25 2 L32 7 L25 12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="circuit-breaker__arrow-label">10s timeout</span>
            </div>
            <div className={`circuit-breaker__node circuit-breaker__node--half-open ${state === 'HALF_OPEN' ? 'circuit-breaker__node--active' : ''}`}>
              <div className="circuit-breaker__node-dot" />
              <span>HALF_OPEN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="circuit-breaker__info">
        <div className="circuit-breaker__icon-wrap">
          {config.icon}
        </div>
        <div className="circuit-breaker__details">
          <div className="circuit-breaker__label">Circuit Breaker</div>
          <div className={`circuit-breaker__state circuit-breaker__state--${config.className}`}>
            {config.label}
          </div>
          <p className="circuit-breaker__description">{config.description}</p>
        </div>
      </div>

      {error && (
        <div className="circuit-breaker__error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>No se pudo conectar al Orquestador: {error}</span>
        </div>
      )}
    </div>
  );
}
