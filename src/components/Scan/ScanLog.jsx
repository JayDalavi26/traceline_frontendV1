import React from 'react';

const ScanLog = ({ logs }) => (
  <div className="card">
    <div className="card-title">Recent Scan Log</div>
    {logs.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '13px' }}>No scans yet. Scan a part to see blockchain entries here.</div>
    ) : (
    <div className="timeline">
      {logs.map(log => (
        <div key={log.id} className="timeline-item">
          <div className="timeline-dot" style={{ background: log.status === 'danger' ? 'var(--danger)' : 'var(--success)' }}></div>
          <div className="timeline-time">{log.timestamp?.slice(11, 19)} — {log.partId}</div>
          <div className="timeline-text">{log.stage} — {log.operatorId} — {log.operatorName}</div>
          <div className="timeline-sub">
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Block #{log.blockNumber}</span>
            {log.blockHash && (
              <span className="mono" style={{ marginLeft: '6px', color: 'var(--text2)', fontSize: '10px' }} title={log.blockHash}>
                Hash: {log.blockHash.slice(0, 16)}...
              </span>
            )}
            {log.onChain && <span style={{ color: 'var(--success)', marginLeft: '8px' }}>⛓ On-Chain</span>}
            {!log.onChain && <span style={{ color: 'var(--text3)', marginLeft: '8px', fontSize: '10px' }}>📦 Local</span>}
            {log.txHash && <span style={{ color: 'var(--accent2)', marginLeft: '6px', fontSize: '10px' }}>TX: {log.txHash.slice(0, 12)}...</span>}
          </div>
        </div>
      ))}
    </div>
    )}
  </div>
);
export default ScanLog;