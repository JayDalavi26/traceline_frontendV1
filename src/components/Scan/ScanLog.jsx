import React from 'react';

const ScanLog = ({ logs }) => (
  <div className="card">
    <div className="card-title">Recent Scan Log</div>
    <div className="timeline">
      {logs.map(log => (
        <div key={log.id} className="timeline-item">
          <div className="timeline-dot" style={{ background: log.status === 'danger' ? 'var(--danger)' : 'var(--success)' }}></div>
          <div className="timeline-time">{log.timestamp?.slice(11, 19)} — {log.partId}</div>
          <div className="timeline-text">{log.stage} — {log.operatorId} — {log.operatorName}</div>
          <div className="timeline-sub">Block #{log.blockNumber} • Hash: {log.blockHash?.slice(0, 10)}...</div>
        </div>
      ))}
    </div>
  </div>
);
export default ScanLog;