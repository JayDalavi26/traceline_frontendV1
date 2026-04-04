import React from 'react';
import { operators } from '../../data/mockData';
import { useToast } from '../../hooks/useToast';

const Operators = () => {
  const { showToast } = useToast();

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Operator Directory</div>
          <button className="btn btn-primary" style={{ padding: '7px 14px' }} onClick={() => showToast('New operator registration form opened', '👤')}>⊕ Add Operator</button>
        </div>

        {operators.map(op => (
          <div key={op.opId} className="operator-card">
            <div className="avatar" style={{ background: op.status === 'flagged' ? 'rgba(239,68,68,0.12)' : op.status === 'off' ? 'rgba(255,255,255,0.06)' : 'rgba(0,212,170,0.12)', color: op.status === 'flagged' ? 'var(--danger)' : op.status === 'off' ? 'var(--text2)' : 'var(--accent)' }}>{op.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{op.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{op.opId} • {op.level}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${op.status === 'on' ? 'badge-success' : op.status === 'flagged' ? 'badge-danger' : 'badge-neutral'}`}>{op.status === 'on' ? 'On Shift' : op.status === 'flagged' ? '⚠ Flagged' : 'Off Shift'}</span>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>{op.scans} scans today</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: '16px' }}>Operator Performance</div>
          <table>
            <thead><tr><th>Operator</th><th>Scans</th><th>Accuracy</th><th>Anomalies</th></tr></thead>
            <tbody>
              {operators.map(op => (
                <tr key={op.opId}>
                  <td>{op.name.split(' ').slice(0, 2).join(' ')}</td>
                  <td>{op.scans}</td>
                  <td><span style={{ color: op.accuracy >= 95 ? 'var(--success)' : op.accuracy >= 85 ? 'var(--warn)' : 'var(--danger)' }}>{op.accuracy}%</span></td>
                  <td><span style={{ color: op.anomalies === 0 ? 'var(--success)' : op.anomalies <= 1 ? 'var(--warn)' : 'var(--danger)' }}>{op.anomalies}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>MFA Authentication Log</div>
          <div className="timeline">
            <div className="timeline-item"><div className="timeline-dot" style={{ background: 'var(--success)' }}></div><div className="timeline-time">14:00:00 — OP-0042 R. Sharma</div><div className="timeline-text">Shift login — MFA verified</div><div className="timeline-sub">Device: Scanner Terminal 1 • IP: 192.168.1.42</div></div>
            <div className="timeline-item"><div className="timeline-dot" style={{ background: 'var(--success)' }}></div><div className="timeline-time">14:00:12 — OP-0031 S. Desai</div><div className="timeline-text">Shift login — MFA verified</div><div className="timeline-sub">Device: Supervisor Terminal • IP: 192.168.1.10</div></div>
            <div className="timeline-item"><div className="timeline-dot" style={{ background: 'var(--danger)' }}></div><div className="timeline-time">14:28:44 — OP-0007 V. Patil</div><div className="timeline-text">⚠ Duplicate scan attempt flagged</div><div className="timeline-sub">Supervisor notified • Blockchain log: Block #10490</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operators;