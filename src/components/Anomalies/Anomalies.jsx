import React, { useState, useEffect } from 'react';
import { anomaliesAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const Anomalies = () => {
  const { showToast } = useToast();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, medium, low, ai

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = () => {
    anomaliesAPI.getAll()
      .then(res => setAnomalies(res.data))
      .catch(() => showToast('Failed to load anomalies', '❌'))
      .finally(() => setLoading(false));
  };

  const resolveAnomaly = async (id) => {
    try {
      await anomaliesAPI.resolve(id);
      setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      showToast('Anomaly resolved', '✅');
    } catch {
      showToast('Failed to resolve anomaly', '❌');
    }
  };

  const critical = anomalies.filter(a => a.severity === 'critical' && !a.resolved).length;
  const medium = anomalies.filter(a => a.severity === 'medium' && !a.resolved).length;
  const low = anomalies.filter(a => a.severity === 'low' && !a.resolved).length;
  const aiDetected = anomalies.filter(a => a.title?.startsWith('AI Detected')).length;

  const filtered = anomalies.filter(a => {
    if (filter === 'all') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    if (filter === 'ai') return a.title?.startsWith('AI Detected') && !a.resolved;
    return a.severity === filter && !a.resolved;
  });

  const severityIcon = { critical: '🔴', medium: '🟡', low: '🔵' };

  return (
    <>
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="metric red" style={{ cursor: 'pointer' }} onClick={() => setFilter('critical')}><div className="metric-label">Critical</div><div className="metric-value red">{critical}</div><div className="metric-change">Requires immediate action</div></div>
        <div className="metric warn" style={{ cursor: 'pointer' }} onClick={() => setFilter('medium')}><div className="metric-label">Medium</div><div className="metric-value warn">{medium}</div><div className="metric-change">Monitor closely</div></div>
        <div className="metric blue" style={{ cursor: 'pointer' }} onClick={() => setFilter('low')}><div className="metric-label">Low</div><div className="metric-value blue">{low}</div><div className="metric-change">Informational only</div></div>
        <div className="metric purple" style={{ cursor: 'pointer' }} onClick={() => setFilter('ai')}><div className="metric-label">AI Detected</div><div className="metric-value purple">{aiDetected}</div><div className="metric-change">YOLOv10 detections</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Anomaly Feed</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'critical', 'medium', 'low', 'ai', 'resolved'].map(f => (
              <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ padding: '4px 10px', fontSize: '11px', textTransform: 'capitalize' }}
                      onClick={() => setFilter(f)}>{f}</button>
            ))}
            <button className="btn btn-ghost" onClick={() => { showToast('Anomalies refreshed', '🔄'); loadAnomalies(); }} style={{ padding: '4px 10px', fontSize: '11px' }}>↻</button>
          </div>
        </div>

        {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)' }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text3)' }}>{filter === 'all' ? 'No active anomalies 🎉' : `No ${filter} anomalies`}</div> :
        filtered.map(anom => (
          <div key={anom.id} className="anomaly-item" style={{ opacity: anom.resolved ? 0.5 : 1 }}>
            <div style={{ fontSize: '20px' }}>{severityIcon[anom.severity] || '⚪'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{anom.title}</span>
                <span className={`badge badge-${anom.severity === 'critical' ? 'danger' : anom.severity === 'medium' ? 'warn' : 'info'}`}>{anom.severity}</span>
                {anom.title?.startsWith('AI Detected') && <span className="badge badge-accent">AI</span>}
                {anom.resolved && <span className="badge badge-success">Resolved</span>}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{anom.description}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                📍 {anom.location} &nbsp;•&nbsp; {anom.operatorId} &nbsp;•&nbsp; {anom.partId}
                &nbsp;•&nbsp; {anom.detectedAt ? new Date(anom.detectedAt).toLocaleString() : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>AI Score</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 800, color: anom.severity === 'critical' ? 'var(--danger)' : anom.severity === 'medium' ? 'var(--warn)' : 'var(--accent2)' }}>{anom.aiConfidence}%</div>
              {!anom.resolved && (
                <button className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: '10px', marginTop: '4px' }}
                        onClick={() => resolveAnomaly(anom.id)}>✓ Resolve</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Anomalies;