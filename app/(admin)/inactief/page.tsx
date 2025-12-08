'use client';

import { useConfig } from '../../hooks/useConfig';

export default function InactiefPage() {
  const { config, updateInactiveResponse, saveConfig, saved } = useConfig();

  const inactiveConfig = config.inactiveResponses || {
    '30': { date: 'alweer 30 dagen', message: 'We missen je!' },
    '60': { date: 'al 60 dagen', message: 'Lang niet gezien!' },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #7C3AED' }}>
          <div className="stat-value" style={{ color: '#7C3AED' }}>122</div>
          <div className="stat-label">Actieve leden met check-in data</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">1</div>
          <div className="stat-label">8-14 dagen inactief</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">30+ dagen inactief</div>
        </div>
      </div>

      {/* 30 Days */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>😴</span>
            30 Dagen Inactief
          </h2>
          <span className="status-badge pending">Eerste herinnering</span>
        </div>
        <div className="card-body">
          <div className="grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Datum tekst</label>
                <input
                  type="text"
                  value={inactiveConfig['30']?.date || ''}
                  onChange={(e) => updateInactiveResponse('30', 'date', e.target.value)}
                  className="form-input"
                  placeholder="Bijv. alweer 30 dagen"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bericht</label>
                <textarea
                  value={inactiveConfig['30']?.message || ''}
                  onChange={(e) => updateInactiveResponse('30', 'message', e.target.value)}
                  className="form-input form-textarea"
                  placeholder="Je motivatiebericht..."
                />
              </div>
            </div>

            <div>
              <label className="form-label">Preview</label>
              <div className="message-preview purple mt-2">
                <div className="message-preview-text">
                  <strong>{config.gymName}</strong> - {inactiveConfig['30']?.date}
                  <br /><br />
                  {inactiveConfig['30']?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 60 Days */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>😴😴</span>
            60 Dagen Inactief
          </h2>
          <span className="status-badge inactive">Urgente herinnering</span>
        </div>
        <div className="card-body">
          <div className="grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Datum tekst</label>
                <input
                  type="text"
                  value={inactiveConfig['60']?.date || ''}
                  onChange={(e) => updateInactiveResponse('60', 'date', e.target.value)}
                  className="form-input"
                  placeholder="Bijv. al 60 dagen"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bericht</label>
                <textarea
                  value={inactiveConfig['60']?.message || ''}
                  onChange={(e) => updateInactiveResponse('60', 'message', e.target.value)}
                  className="form-input form-textarea"
                  placeholder="Je urgente motivatiebericht..."
                />
              </div>
            </div>

            <div>
              <label className="form-label">Preview</label>
              <div className="message-preview purple mt-2">
                <div className="message-preview-text">
                  <strong>{config.gymName}</strong> - {inactiveConfig['60']?.date}
                  <br /><br />
                  {inactiveConfig['60']?.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info">
        <span>⏰</span>
        <div>
          <strong>Automatische check:</strong> De cron job draait dagelijks om 09:00 en 
          controleert welke leden 30 of 60 dagen niet zijn geweest. Elk lid ontvangt 
          maximaal 1 bericht per 7 dagen.
        </div>
      </div>

      {/* Save */}
      <button
        onClick={saveConfig}
        className={`btn btn-lg btn-block ${saved ? 'btn-success' : 'btn-primary'}`}
      >
        {saved ? '✓ Opgeslagen!' : '💾 Instellingen Opslaan'}
      </button>

      {saved && (
        <div className="toast">
          <span>✓</span>
          Wijzigingen opgeslagen
        </div>
      )}
    </div>
  );
}