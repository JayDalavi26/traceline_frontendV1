import React from 'react';

const recentScans = [
  { id: 'TL-2024-8821', stage: 'Drilling', stageColor: 'accent', operator: 'R. Sharma', status: 'OK', statusClass: 'success' },
  { id: 'TL-2024-8820', stage: 'Heat Treat', stageColor: 'warn', operator: 'A. Kumar', status: 'Delay', statusClass: 'warn' },
  { id: 'TL-2024-8819', stage: 'Inspection', stageColor: 'accent2', operator: 'P. Joshi', status: 'OK', statusClass: 'success' },
  { id: 'TL-2024-8818', stage: 'Cutting', stageColor: 'danger', operator: 'V. Patil', status: 'Anomaly', statusClass: 'danger' },
  { id: 'TL-2024-8817', stage: 'Assembly', stageColor: 'success', operator: 'S. Desai', status: 'OK', statusClass: 'success' },
];

const RecentScansTable = () => {
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
          <thead><tr><th>Part ID</th><th>Stage</th><th>Operator</th><th>Status</th></tr></thead>
          <tbody>
            {recentScans.map(scan => (
              <tr key={scan.id}>
                <td><span className="mono">{scan.id}</span></td>
                <td><span className="stage-pill" style={{ color: `var(--${scan.stageColor})`, borderColor: `rgba(var(--${scan.stageColor}),0.2)`, background: `rgba(var(--${scan.stageColor}),0.06)` }}><span className="stage-dot" style={{ background: `var(--${scan.stageColor})` }}></span>{scan.stage}</span></td>
                <td>{scan.operator}</td>
                <td><span className={`badge badge-${scan.statusClass}`}>● {scan.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScansTable;