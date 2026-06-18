import React, { useState, useEffect } from 'react';
import { scansAPI } from '../../services/api';

const RecentScansTable = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scansAPI.getRecent()
      .then(res => setRecentScans(Array.isArray(res.data) ? res.data.slice(0, 5) : []))
      .catch(() => setRecentScans([]))
      .finally(() => setLoading(false));
  }, []);

  const stageColor = (stage) => {
    const map = { Cutting: 'danger', Drilling: 'accent', 'Heat Treat': 'warn', Milling: 'accent2', Grinding: 'accent3', Inspection: 'accent2', Assembly: 'success', QC: 'success' };
    return map[stage] || 'accent';
  };

  const statusClass = (status) => {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s === 'ok' || s === 'success') return 'success';
    if (s === 'delay' || s === 'warning') return 'warn';
    if (s === 'anomaly' || s === 'danger') return 'danger';
    return 'neutral';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Recent Scans</div>
          <div className="card-subtitle">Latest DMC scan events</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '6px 12px' }}>View All</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Part ID</th><th>Stage</th><th>Operator</th><th>Block</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text3)' }}>Loading...</td></tr> :
            recentScans.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text3)' }}>No recent scans</td></tr> :
            recentScans.map((scan, idx) => (
              <tr key={scan.id || idx}>
                <td><span className="mono">{scan.partId}</span></td>
                <td><span className="stage-pill" style={{ color: `var(--${stageColor(scan.stage)})`, borderColor: `rgba(var(--${stageColor(scan.stage)}),0.2)`, background: `rgba(var(--${stageColor(scan.stage)}),0.06)` }}><span className="stage-dot" style={{ background: `var(--${stageColor(scan.stage)})` }}></span>{scan.stage}</span></td>
                <td>{scan.operatorName || scan.operatorId}</td>
                <td>
                  {scan.blockHash ? (
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--accent)' }} title={scan.blockHash}>#{scan.blockNumber} • {scan.blockHash.slice(0, 10)}...</span>
                  ) : (
                    <span style={{ color: 'var(--text3)', fontSize: '11px' }}>—</span>
                  )}
                </td>
                <td><span className={`badge badge-${statusClass(scan.status)}`}>● {scan.status || 'OK'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScansTable;