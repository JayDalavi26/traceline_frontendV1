import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { currentUser } = useAuth();
  const isOperator = currentUser?.role === 'operator';
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⬛', roles: ['admin', 'operator'] },
    { id: 'tracking', label: 'Live Tracking', icon: '◎', roles: ['admin', 'operator'], badge: '12', badgeClass: 'warn' },
    { id: 'scan', label: 'DMC Scanner', icon: '⬡', roles: ['admin', 'operator'] },
    { id: 'ai', label: 'AI Analytics', icon: '✦', roles: ['admin'], badge: '3' },
    { id: 'anomalies', label: 'Anomalies', icon: '⚠', roles: ['admin'], badge: '7' },
    { id: 'predictive', label: 'Predictive', icon: '◈', roles: ['admin'] },
    { id: 'blockchain', label: 'Ledger', icon: '⛓', roles: ['admin', 'operator'] },
    { id: 'contracts', label: 'Smart Contracts', icon: '📋', roles: ['admin'] },
    { id: 'parts', label: 'Parts Registry', icon: '⚙', roles: ['admin', 'operator'] },
    { id: 'operators', label: 'Operators', icon: '👤', roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: '📊', roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: '⚙', roles: ['admin'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-mark">
          <div className="logo-icon">⬡</div>
          <span className="logo-text">TraceLine</span>
        </div>
        <div className="logo-sub">Industry 4.0 Traceability</div>
      </div>

      {isOperator && (
        <div className="operator-banner">
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '4px' }}>Your Pipeline</div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{currentUser.name} · {currentUser.opId}</div>
          <div style={{ color: 'var(--text3)', marginTop: '2px' }}>0 parts active</div>
        </div>
      )}

      <nav className="nav">
        <div className="nav-section">
          <div className="nav-label">Overview</div>
          {visibleItems.filter(i => ['dashboard', 'tracking', 'scan'].includes(i.id)).map(item => (
            <div key={item.id} className={`nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => setCurrentPage(item.id)}>
              <span className="nav-icon">{item.icon}</span> {item.label}
              {item.badge && <span className={`nav-badge ${item.badgeClass || ''}`}>{item.badge}</span>}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="nav-section">
            <div className="nav-label">Intelligence</div>
            {visibleItems.filter(i => ['ai', 'anomalies', 'predictive'].includes(i.id)).map(item => (
              <div key={item.id} className={`nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => setCurrentPage(item.id)}>
                <span className="nav-icon">{item.icon}</span> {item.label}
                {item.badge && <span className={`nav-badge ${item.badgeClass || ''}`}>{item.badge}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="nav-section">
          <div className="nav-label">Blockchain</div>
          {visibleItems.filter(i => ['blockchain', 'contracts'].includes(i.id)).map(item => (
            <div key={item.id} className={`nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => setCurrentPage(item.id)}>
              <span className="nav-icon">{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="nav-section">
            <div className="nav-label">Management</div>
            {visibleItems.filter(i => ['parts', 'operators', 'reports', 'settings'].includes(i.id)).map(item => (
              <div key={item.id} className={`nav-item ${currentPage === item.id ? 'active' : ''}`} onClick={() => setCurrentPage(item.id)}>
                <span className="nav-icon">{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>System Status</div>
          <div className="status-row"><div className="dot green"></div><span style={{ color: 'var(--text2)', fontSize: '12px' }}>Blockchain Node</span><span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text3)' }}>Active</span></div>
          <div className="status-row"><div className="dot green"></div><span style={{ color: 'var(--text2)', fontSize: '12px' }}>AI Engine</span><span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text3)' }}>Online</span></div>
          <div className="status-row"><div className="dot yellow"></div><span style={{ color: 'var(--text2)', fontSize: '12px' }}>DMC Scanners</span><span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text3)' }}>8/10</span></div>
          <div className="status-row"><div className="dot green"></div><span style={{ color: 'var(--text2)', fontSize: '12px' }}>Database</span><span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text3)' }}>Synced</span></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;