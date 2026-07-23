import { useState } from 'react';
import './ConfigModal.css';

export default function ConfigModal({ config, onSave, onClose }) {
  const [balanceadorUrl, setBalanceadorUrl] = useState(config.balanceadorUrl);
  const [orquestadorUrl, setOrquestadorUrl] = useState(config.orquestadorUrl);

  const handleSave = () => {
    onSave({
      balanceadorUrl: balanceadorUrl.replace(/\/+$/, ''),
      orquestadorUrl: orquestadorUrl.replace(/\/+$/, ''),
    });
  };

  return (
    <div className="config-overlay" onClick={onClose} id="config-modal-overlay">
      <div className="config-modal" onClick={e => e.stopPropagation()} id="config-modal">
        <div className="config-modal__header">
          <h2 className="config-modal__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuración de Red
          </h2>
          <button className="config-modal__close" onClick={onClose} id="btn-close-config">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p className="config-modal__description">
          Ingresa las URLs de los servicios del sistema distribuido. Estas deben coincidir con las IPs configuradas en <code>config.py</code>.
        </p>

        <div className="config-modal__fields">
          <div className="config-modal__field">
            <label className="config-modal__label" htmlFor="input-balanceador-url">
              <span className="config-modal__label-icon">⚖️</span>
              Balanceador (Máquina 3)
            </label>
            <input
              type="text"
              id="input-balanceador-url"
              className="config-modal__input"
              value={balanceadorUrl}
              onChange={e => setBalanceadorUrl(e.target.value)}
              placeholder="http://192.168.1.103:8080"
            />
            <span className="config-modal__hint">Endpoints: /estado, /circuit_log</span>
          </div>

          <div className="config-modal__field">
            <label className="config-modal__label" htmlFor="input-orquestador-url">
              <span className="config-modal__label-icon">🔄</span>
              Orquestador (Máquina 4)
            </label>
            <input
              type="text"
              id="input-orquestador-url"
              className="config-modal__input"
              value={orquestadorUrl}
              onChange={e => setOrquestadorUrl(e.target.value)}
              placeholder="http://192.168.1.104:8081"
            />
            <span className="config-modal__hint">Endpoints: /estado_circuito, /</span>
          </div>
        </div>

        <div className="config-modal__actions">
          <button className="config-modal__btn config-modal__btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="config-modal__btn config-modal__btn--save" onClick={handleSave} id="btn-save-config">
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
