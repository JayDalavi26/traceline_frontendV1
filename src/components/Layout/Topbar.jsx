import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

const Topbar = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();

  const pageTitles = {
    dashboard: { title: 'Dashboard', sub: 'Real-time manufacturing overview' },
    tracking: { title: 'Live Tracking', sub: 'Monitor all parts in real-time' },
    scan: { title: 'DMC Scanner', sub: 'Scan and log parts to blockchain' },
    ai: { title: 'AI Analytics', sub: 'Intelligent anomaly detection and insights' },
    anomalies: { title: 'Anomaly Management', sub: 'Review and resolve detected anomalies' },
    predictive: { title: 'Predictive Analytics', sub: 'AI-powered defect and delay forecasting' },
    blockchain: { title: 'Blockchain Ledger', sub: 'Distributed tamper-proof production log' },
    contracts: { title: 'Smart Contracts', sub: 'Automated validation logic on-chain' },
    parts: { title: 'Parts Registry', sub: 'Complete parts database and history' },
    operators: { title: 'Operator Management', sub: 'Authentication and performance tracking' },
    reports: { title: 'Reports', sub: 'Generate and export production reports' },
    settings: { title: 'Settings', sub: 'System configuration and integrations' },
  };

  const { title, sub } = pageTitles[currentPage] || pageTitles.dashboard;
  const isOperator = currentUser?.role === 'operator';

  return (
    <div className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{sub} — <span className="live-dot"></span> Live</div>
      </div>
      <div className="topbar-actions">
        <button className="btn btn-ghost" onClick={() => showToast('Refreshing data...', '🔄')}>↺ Refresh</button>
        <div className="user-badge" onClick={() => showToast('Profile settings coming soon', '👤')}>
          <div className={`user-avatar ${currentUser?.role}`}>{currentUser?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{currentUser?.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{currentUser?.role === 'admin' ? 'Administrator' : `Operator — ${currentUser?.opId}`}</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}>⏻ Logout</button>
        {isOperator && (
          <button className="btn btn-primary" onClick={() => setCurrentPage('scan')}>⊕ Scan Part</button>
        )}
      </div>
    </div>
  );
};

export default Topbar;