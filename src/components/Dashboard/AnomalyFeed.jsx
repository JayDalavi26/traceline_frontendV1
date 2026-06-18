import React, { useState, useEffect } from 'react';
import { anomaliesAPI } from '../../services/api';

const AnomalyFeed = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    anomaliesAPI.getAll()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAnomalies(data.filter(a => !a.resolved).slice(0, 5));
      })
      .catch(() => setAnomalies([]))
      .finally(() => setLoading(false));
  }, []);

  const severityIcon = { critical: '🔴', medium: '🟡', low: '🔵' };
  const severityClass = { critical: 'danger', medium: 'warn', low: 'info' };
  const iconClass = { critical: 'red', medium: 'warn', low: 'blue' };

  return (
    <div>
      <div className="ai-insight section-gap">
        <div className="ai-tag">✦ AI Insight</div>
        <p style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
          {anomalies.length > 0
            ? <>There are <strong style={{ color: 'var(--warn)' }}>{anomalies.length} active anomalies</strong> requiring attention.</>
            : <>All systems operating within normal parameters.</>
          }
        </p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <span className="badge badge-neutral">Real-time</span>
          {anomalies.filter(a => a.severity === 'critical').length > 0 && <span className="badge badge-danger">Critical Alert</span>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Anomalies</div>
          <span className="badge badge-danger">{anomalies.length} Active</span>
        </div>
        {loading ? <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)' }}>Loading...</div> :
        anomalies.length === 0 ? <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)' }}>No active anomalies</div> :
        anomalies.map((anom, idx) => (
          <div key={anom.id || idx} className="anomaly-item">
            <div className={`anomaly-icon ${iconClass[anom.severity] || 'blue'}`}>{severityIcon[anom.severity] || '🔵'}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{anom.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{anom.partId} • {anom.location} • {anom.detectedAt ? new Date(anom.detectedAt).toLocaleTimeString() : ''}</div>
            </div>
            <span className={`badge badge-${severityClass[anom.severity] || 'info'}`} style={{ marginLeft: 'auto' }}>{anom.severity ? anom.severity.charAt(0).toUpperCase() + anom.severity.slice(1) : 'Unknown'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyFeed;