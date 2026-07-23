import { useState, useEffect } from 'react';
import './App.css';
import { useSystemData } from './hooks/useSystemData';
import Header from './components/Header';
import NodeCard from './components/NodeCard';
import CircuitBreaker from './components/CircuitBreaker';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CircuitLog from './components/CircuitLog';
import TestPanel from './components/TestPanel';
import ConfigModal from './components/ConfigModal';

const DEFAULT_CONFIG = {
  balanceadorUrl: 'http://192.168.1.103:8080',
  orquestadorUrl: 'http://192.168.1.104:8081',
};

function loadConfig() {
  try {
    const saved = localStorage.getItem('dsm-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

function App() {
  const [config, setConfig] = useState(loadConfig);
  const [showConfig, setShowConfig] = useState(false);

  const {
    nodos,
    circuitState,
    circuitLog,
    lastUpdate,
    errors,
    loading,
    requestHistory,
    sendTestRequest,
    refresh,
  } = useSystemData(config);

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('dsm-config', JSON.stringify(newConfig));
    setShowConfig(false);
    // Force page reload to re-init the hook with new config
    window.location.reload();
  };

  // Keyboard shortcut for config
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && showConfig) setShowConfig(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showConfig]);

  const activeCount = nodos.filter(n => n.estado === 'ACTIVO').length;
  const totalNodes = nodos.length;
  const hasAnyError = Object.values(errors).some(e => e !== null);

  return (
    <div className="app">
      {/* Background mesh gradient */}
      <div className="app__bg-mesh" />

      <Header
        lastUpdate={lastUpdate}
        onRefresh={refresh}
        config={config}
        onConfigOpen={() => setShowConfig(true)}
      />

      <main className="app__main">
        {/* Connection Status Banner */}
        {hasAnyError && (
          <div className="app__connection-banner animate-fade-in" id="connection-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              No se pudo conectar a algunos servicios. Verifica que los servicios estén corriendo y las IPs estén configuradas correctamente.
            </span>
            <button className="app__connection-banner-btn" onClick={() => setShowConfig(true)}>
              Configurar
            </button>
          </div>
        )}

        {/* Overview Stats */}
        <section className="app__overview animate-fade-in-up stagger-1" id="overview-section">
          <div className="app__stat-card">
            <div className="app__stat-icon app__stat-icon--nodes">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
                <circle cx="6" cy="6" r="1" fill="currentColor" />
                <circle cx="6" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <div className="app__stat-info">
              <span className="app__stat-value">{activeCount}/{totalNodes}</span>
              <span className="app__stat-label">Nodos Activos</span>
            </div>
          </div>

          <div className="app__stat-card">
            <div className={`app__stat-icon app__stat-icon--circuit-${circuitState === 'CLOSED' ? 'ok' : circuitState === 'OPEN' ? 'error' : 'warn'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="app__stat-info">
              <span className="app__stat-value">{circuitState}</span>
              <span className="app__stat-label">Circuit Breaker</span>
            </div>
          </div>

          <div className="app__stat-card">
            <div className="app__stat-icon app__stat-icon--log">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="app__stat-info">
              <span className="app__stat-value">{circuitLog.length}</span>
              <span className="app__stat-label">Eventos CB</span>
            </div>
          </div>

          <div className="app__stat-card">
            <div className="app__stat-icon app__stat-icon--requests">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <div className="app__stat-info">
              <span className="app__stat-value">{requestHistory.length}</span>
              <span className="app__stat-label">Peticiones Test</span>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="app__grid">
          {/* Left Column */}
          <div className="app__column app__column--left">
            {/* Node Cards */}
            <section className="app__section" id="nodes-section">
              <h2 className="app__section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <circle cx="6" cy="6" r="1" fill="currentColor" />
                  <circle cx="6" cy="18" r="1" fill="currentColor" />
                </svg>
                Estado de los Nodos Backend
              </h2>
              <div className="app__nodes-grid">
                {nodos.length > 0 ? (
                  nodos.map((nodo, i) => (
                    <NodeCard key={nodo.nombre} nodo={nodo} index={i} />
                  ))
                ) : (
                  <>
                    <NodeCard
                      nodo={{ nombre: 'Pagos1', estado: 'DESCONOCIDO', ultimaActualizacion: null }}
                      index={0}
                    />
                    <NodeCard
                      nodo={{ nombre: 'Pagos2', estado: 'DESCONOCIDO', ultimaActualizacion: null }}
                      index={1}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Circuit Breaker */}
            <CircuitBreaker state={circuitState} error={errors.circuit} />

            {/* Architecture Diagram */}
            <ArchitectureDiagram nodos={nodos} circuitState={circuitState} />
          </div>

          {/* Right Column */}
          <div className="app__column app__column--right">
            {/* Test Panel */}
            <TestPanel
              onSendRequest={sendTestRequest}
              requestHistory={requestHistory}
            />

            {/* Circuit Log */}
            <CircuitLog log={circuitLog} error={errors.log} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app__footer" id="app-footer">
        <p>
          Práctica 15+16 — Heartbeat/Failover + Microservicios/Circuit Breaker
        </p>
        <p className="app__footer-tech">
          React + Vite · Auto-refresh cada 2s · Python stdlib backend
        </p>
      </footer>

      {/* Config Modal */}
      {showConfig && (
        <ConfigModal
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="app__loading" id="loading-overlay">
          <div className="app__loading-spinner" />
          <span>Conectando a los servicios...</span>
        </div>
      )}
    </div>
  );
}

export default App;
