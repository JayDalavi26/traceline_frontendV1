import React from 'react';
import { anomalies } from '../../data/mockData';
import { useToast } from '../../hooks/useToast';

const Anomalies = () => {
  const { showToast } = useToast();
  
  const critical = anomalies.filter(a => a.severity === 'critical').length;
  const medium = anomalies.filter(a => a.severity === 'medium').length;
  const low = anomalies.filter(a => a.severity === 'low').length;

  const severityIcon = { critical: '🔴', medium: '🟡', low: '🔵' };
  const severityClass = { critical: 'red', medium: 'warn', low: 'blue' };

  return (
    <>
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="metric red"><div className="metric-label">Critical</div><div className="metric-value red">{critical}</div><div className="metric-change">Requires immediate action</div></div>
        <div className="metric warn"><div className="metric-label">Medium</div><div className="metric-value warn">{medium}</div><div className="metric-change">Monitor closely</div></div>
        <div className="metric blue"><div className="metric-label">Low</div><div className="metric-value blue">{low}</div><div className="metric-change">Informational only</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Anomaly Feed</div>
          <button className="btn btn-ghost" onClick={() => showToast('All anomalies exported to CSV', '📊')}>Export</button>
        </div>

        {anomalies.map(anom => (
          <div key={anom.id} className="anomaly-item">
            <div className={`anomaly-icon ${severityClass[anom.severity]}`} style={{ fontSize: '20px' }}>{severityIcon[anom.severity]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{anom.title}</span>
                <span className={`badge badge-${anom.severity === 'critical' ? 'danger' : anom.severity === 'medium' ? 'warn' : 'info'}`}>{anom.severity.charAt(0).toUpperCase() + anom.severity.slice(1)}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{anom.description}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>📍 {anom.location} &nbsp;•&nbsp; {anom.operator} &nbsp;•&nbsp; {anom.time}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>AI Score</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 800, color: anom.severity === 'critical' ? 'var(--danger)' : anom.severity === 'medium' ? 'var(--warn)' : 'var(--accent2)' }}>{anom.score}%</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Anomalies;