import React from 'react';

const AnomalyFeed = () => {
  const anomalies = [
    { icon: '🔴', iconClass: 'red', title: 'Duplicate scan detected', desc: 'TL-2024-8818 • Cutting • 2 min ago', severity: 'Critical', severityClass: 'danger' },
    { icon: '🟡', iconClass: 'warn', title: 'Abnormal time gap', desc: 'TL-2024-8810 • Heat Treat • 18 min ago', severity: 'Medium', severityClass: 'warn' },
    { icon: '🔵', iconClass: 'blue', title: 'Sequence mismatch', desc: 'TL-2024-8801 • Inspection • 1 hr ago', severity: 'Low', severityClass: 'info' },
  ];

  return (
    <div>
      <div className="ai-insight section-gap">
        <div className="ai-tag">✦ AI Insight</div>
        <p style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>Drilling station 3 shows a <strong style={{ color: 'var(--warn)' }}>38% higher anomaly rate</strong> compared to baseline. Recommend inspection before next shift.</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <span className="badge badge-neutral">Confidence: 94%</span>
          <span className="badge badge-warn">High Risk</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Anomalies</div>
          <span className="badge badge-danger">7 Active</span>
        </div>
        {anomalies.map((anom, idx) => (
          <div key={idx} className="anomaly-item">
            <div className={`anomaly-icon ${anom.iconClass}`}>{anom.icon}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{anom.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{anom.desc}</div>
            </div>
            <span className={`badge badge-${anom.severityClass}`} style={{ marginLeft: 'auto' }}>{anom.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyFeed;