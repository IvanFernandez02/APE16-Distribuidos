import { useState } from 'react';
import './TestPanel.css';

export default function TestPanel({ onSendRequest, requestHistory }) {
  const [sending, setSending] = useState(false);
  const [burstCount, setBurstCount] = useState(5);

  const handleSend = async () => {
    setSending(true);
    await onSendRequest();
    setSending(false);
  };

  const handleBurst = async () => {
    setSending(true);
    for (let i = 0; i < burstCount; i++) {
      await onSendRequest();
      await new Promise(r => setTimeout(r, 200));
    }
    setSending(false);
  };

  const avgResponseTime = requestHistory.length > 0
    ? (requestHistory.reduce((s, r) => s + r.responseTime, 0) / requestHistory.length).toFixed(0)
    : 0;

  const successCount = requestHistory.filter(r => r.success).length;
  const failCount = requestHistory.filter(r => !r.success).length;
  const fallbackCount = requestHistory.filter(r => r.isFallback).length;

  return (
    <div className="test-panel animate-fade-in-up stagger-5" id="test-panel">
      <div className="test-panel__header">
        <h2 className="test-panel__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Panel de Pruebas
        </h2>
      </div>

      <div className="test-panel__actions">
        <button
          className="test-panel__btn test-panel__btn--primary"
          onClick={handleSend}
          disabled={sending}
          id="btn-send-request"
        >
          {sending ? (
            <span className="test-panel__spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
          Enviar Petición
        </button>
        
        <div className="test-panel__burst">
          <button
            className="test-panel__btn test-panel__btn--secondary"
            onClick={handleBurst}
            disabled={sending}
            id="btn-burst"
          >
            {sending ? (
              <span className="test-panel__spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            )}
            Ráfaga ×{burstCount}
          </button>
          <input
            type="range"
            min="2"
            max="10"
            value={burstCount}
            onChange={e => setBurstCount(Number(e.target.value))}
            className="test-panel__range"
            id="burst-count-slider"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="test-panel__stats">
        <div className="test-panel__stat">
          <span className="test-panel__stat-value test-panel__stat-value--info">{requestHistory.length}</span>
          <span className="test-panel__stat-label">Total</span>
        </div>
        <div className="test-panel__stat">
          <span className="test-panel__stat-value test-panel__stat-value--success">{successCount}</span>
          <span className="test-panel__stat-label">Éxito</span>
        </div>
        <div className="test-panel__stat">
          <span className="test-panel__stat-value test-panel__stat-value--warning">{fallbackCount}</span>
          <span className="test-panel__stat-label">Fallback</span>
        </div>
        <div className="test-panel__stat">
          <span className="test-panel__stat-value test-panel__stat-value--danger">{failCount}</span>
          <span className="test-panel__stat-label">Error</span>
        </div>
        <div className="test-panel__stat">
          <span className="test-panel__stat-value test-panel__stat-value--mono">{avgResponseTime}ms</span>
          <span className="test-panel__stat-label">Promedio</span>
        </div>
      </div>

      {/* Request History */}
      {requestHistory.length > 0 && (
        <div className="test-panel__history">
          <div className="test-panel__history-header">
            <span>Historial de peticiones</span>
            <span className="test-panel__history-count">{requestHistory.length}</span>
          </div>
          <div className="test-panel__history-list">
            {requestHistory.slice(0, 20).map((req) => (
              <div
                key={req.id}
                className={`test-panel__history-entry ${
                  req.isFallback ? 'test-panel__history-entry--fallback' :
                  req.success ? 'test-panel__history-entry--success' :
                  'test-panel__history-entry--error'
                }`}
              >
                <div className="test-panel__history-status">
                  {req.isFallback ? '⚡' : req.success ? '✓' : '✕'}
                </div>
                <div className="test-panel__history-info">
                  <span className="test-panel__history-circuit">
                    {req.circuitState}
                  </span>
                  {req.nodoUsado && (
                    <span className="test-panel__history-node">
                      → {req.nodoUsado}
                    </span>
                  )}
                  {req.isFallback && (
                    <span className="test-panel__history-fallback-badge">fallback</span>
                  )}
                </div>
                <span className="test-panel__history-time">
                  {req.responseTime.toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
