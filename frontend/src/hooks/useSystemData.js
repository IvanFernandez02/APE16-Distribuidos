import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_CONFIG = {
  balanceadorUrl: 'http://192.168.1.13:8080',
  orquestadorUrl: 'http://192.168.1.12:8081',
};

export function useSystemData(config = DEFAULT_CONFIG) {
  const [nodos, setNodos] = useState([]);
  const [circuitState, setCircuitState] = useState('DESCONOCIDO');
  const [circuitLog, setCircuitLog] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [errors, setErrors] = useState({ nodos: null, circuit: null, log: null });
  const [loading, setLoading] = useState(true);
  const [requestHistory, setRequestHistory] = useState([]);
  const intervalRef = useRef(null);

  const fetchNodos = useCallback(async () => {
    try {
      const res = await fetch(`${config.balanceadorUrl}/estado`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      const parsed = (data.nodos || []).map(n => ({
        nombre: n[0],
        estado: n[1],
        ultimaActualizacion: n[2],
      }));
      setNodos(parsed);
      setErrors(prev => ({ ...prev, nodos: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, nodos: err.message }));
    }
  }, [config.balanceadorUrl]);

  const fetchCircuitState = useCallback(async () => {
    try {
      const res = await fetch(`${config.orquestadorUrl}/estado_circuito`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      setCircuitState(data.estado_circuito || 'DESCONOCIDO');
      setErrors(prev => ({ ...prev, circuit: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, circuit: err.message }));
    }
  }, [config.orquestadorUrl]);

  const fetchCircuitLog = useCallback(async () => {
    try {
      const res = await fetch(`${config.balanceadorUrl}/circuit_log`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      const parsed = (data.circuit_log || []).map(entry => ({
        estado: entry[0],
        timestamp: entry[1],
        detalle: entry[2],
      }));
      setCircuitLog(parsed);
      setErrors(prev => ({ ...prev, log: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, log: err.message }));
    }
  }, [config.balanceadorUrl]);

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([fetchNodos(), fetchCircuitState(), fetchCircuitLog()]);
    setLastUpdate(new Date());
    setLoading(false);
  }, [fetchNodos, fetchCircuitState, fetchCircuitLog]);

  const sendTestRequest = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${config.orquestadorUrl}/`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      const elapsed = performance.now() - start;
      const entry = {
        id: Date.now(),
        timestamp: new Date(),
        responseTime: elapsed,
        success: !data.fuente || data.fuente !== 'fallback-circuit-breaker',
        isFallback: data.fuente === 'fallback-circuit-breaker',
        circuitState: data.estado_circuito || 'DESCONOCIDO',
        nodoUsado: data.respuesta_balanceador?.nodo_usado || null,
        response: data,
      };
      setRequestHistory(prev => [entry, ...prev].slice(0, 50));
      // Re-fetch everything after a test request
      setTimeout(fetchAll, 300);
      return entry;
    } catch (err) {
      const elapsed = performance.now() - start;
      const entry = {
        id: Date.now(),
        timestamp: new Date(),
        responseTime: elapsed,
        success: false,
        isFallback: false,
        circuitState: 'ERROR',
        nodoUsado: null,
        error: err.message,
      };
      setRequestHistory(prev => [entry, ...prev].slice(0, 50));
      setTimeout(fetchAll, 300);
      return entry;
    }
  }, [config.orquestadorUrl, fetchAll]);

  // Auto-refresh
  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 2000);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  return {
    nodos,
    circuitState,
    circuitLog,
    lastUpdate,
    errors,
    loading,
    requestHistory,
    sendTestRequest,
    refresh: fetchAll,
  };
}
