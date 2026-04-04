import React from 'react';

const ScanLog = ({ logs }) => {
  return (
    <div className="timeline" id="scanLog">
      {logs.map((log, idx) => (
        <div key={idx} className="timeline-item">
          <div className="timeline-dot" style={{ background: log.status === 'danger' ? 'var(--danger)' : 'var(--success)' }}></div>
          <div className="timeline-time">{log.time} — {log.partId}</div>
          <div className="timeline-text">{log.stage} — {log.operator} — {log.name}</div>
          <div className="timeline-sub">{log.message || `Block ${log.block} • Hash: ${log.hash}`}</div>
        </div>
      ))}
    </div>
  );
};

export default ScanLog;