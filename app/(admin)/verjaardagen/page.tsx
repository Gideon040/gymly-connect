'use client';

import { useConfig } from '../../hooks/useConfig';

export default function VerjaardagenPage() {
  const { config, updateConfig, saveConfig, saved } = useConfig();

  const birthdayConfig = config.birthdayMessage || {
    date: 'vandaag jarig',
    message: '🎉 Gefeliciteerd met je verjaardag! Kom langs voor een feestelijke workout!',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-value">0</div>
          <div className="stat-label">Leden met geboortedatum</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Felicitaties deze maand</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">-</div>
          <div className="stat-label">Jarigen vandaag</div>
        </div>
      </div>

      {/* Warning */}
      <div className="alert alert-warning">
        <span>⚠️</span>
        <div>
          <strong>Data niet beschikbaar:</strong> De Gymly API retourneert momenteel geen 
          geboortedatums. We hebben contact opgenomen met Gymly support om dit op te lossen.
        </div>
      </div>

      {/* Settings Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>🎂</span>
            Verjaardagsbericht
          </h2>
          <span className="status-badge pending">In afwachting van data</span>
        </div>
        <div className="card-body">
          <div className="grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">Datum tekst</label>
                <input
                  type="text"
                  value={birthdayConfig.date}
                  onChange={(e) => updateConfig({ 
                    birthdayMessage: { ...birthdayConfig, date: e.target.value } 
                  })}
                  className="form-input"
                  placeholder="Bijv. vandaag jarig"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Felicitatiebericht</label>
                <textarea
                  value={birthdayConfig.message}
                  onChange={(e) => updateConfig({ 
                    birthdayMessage: { ...birthdayConfig, message: e.target.value } 
                  })}
                  className="form-input form-textarea"
                  placeholder="Je verjaardagsbericht..."
                />
              </div>
            </div>

            <div>
              <label className="form-label">Preview</label>
              <div className="message-preview blue mt-2">
                <div className="message-preview-text">
                  <strong>{config.gymName}</strong> - {birthdayConfig.date}
                  <br /><br />
                  {birthdayConfig.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info">
        <span>ℹ️</span>
        <div>
          <strong>Hoe werkt het?</strong> Zodra Gymly de geboortedatums beschikbaar maakt, 
          ontvangen leden automatisch een felicitatie op hun verjaardag om 08:00.
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