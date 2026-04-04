import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CameraScanner from './CameraScanner';
import ScanForm from './ScanForm';
import ScanLog from './ScanLog';

const Scan = () => {
  const { currentUser } = useAuth();
  const [scannedResult, setScannedResult] = useState(null);
  const [scanLogs, setScanLogs] = useState([
    { time: '14:32:18', partId: 'TL-2024-8821', stage: 'Drilling Stage', operator: 'OP-0042', name: 'R. Sharma', block: '#10492', hash: '0x4f3e...', status: 'success' },
    { time: '14:30:05', partId: 'TL-2024-8820', stage: 'Heat Treatment', operator: 'OP-0018', name: 'A. Kumar', block: '#10491', hash: '0x9a7b...', status: 'success' },
    { time: '14:28:44', partId: 'TL-2024-8818', stage: 'Cutting', operator: 'OP-0007', name: 'V. Patil', block: '#10490', hash: '0xf2a8...', status: 'danger', message: 'Duplicate scan detected' },
  ]);

  const addScanLog = (log) => {
    setScanLogs(prev => [log, ...prev]);
  };

  return (
    <>
      <div className="operator-only-hint">
        <span>🔒</span> You are scanning as <strong>{currentUser?.name || 'Operator'}</strong> — scans will be logged under your ID automatically.
      </div>
      <div className="grid-2">
        <div>
          <div className="card section-gap">
            <div className="card-title" style={{ marginBottom: '16px' }}>📷 Camera DMC Scanner</div>
            <CameraScanner onScanComplete={(partId) => setScannedResult(partId)} />
            <ScanForm scannedResult={scannedResult} onScanComplete={addScanLog} />
          </div>
        </div>
        <div>
          <div className="card section-gap">
            <div className="card-title" style={{ marginBottom: '16px' }}>Recent Scan Log</div>
            <ScanLog logs={scanLogs} />
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>Scanner Health</div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Scanner Station 1 — Cutting</span><span style={{ fontSize: '12px', color: 'var(--success)' }}>Online</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '98%', background: 'var(--success)' }}></div></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Scanner Station 2 — Drilling</span><span style={{ fontSize: '12px', color: 'var(--success)' }}>Online</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '100%', background: 'var(--success)' }}></div></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Scanner Station 3 — Heat Treat</span><span style={{ fontSize: '12px', color: 'var(--warn)' }}>Degraded</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '72%', background: 'var(--warn)' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Scanner Station 4 — Inspection</span><span style={{ fontSize: '12px', color: 'var(--danger)' }}>Offline</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '0%', background: 'var(--danger)' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scan;