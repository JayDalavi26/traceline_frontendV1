import React from 'react';
import { useToast } from '../../hooks/useToast';

const Reports = () => {
  const { showToast } = useToast();

  return (
    <>
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="metric teal"><div className="metric-label">Monthly Parts Processed</div><div className="metric-value teal">28,441</div><div className="metric-change"><span className="up">↑ 14%</span> vs last month</div></div>
        <div className="metric green"><div className="metric-label">Quality Rate</div><div className="metric-value green">96.2%</div><div className="metric-change"><span className="up">↑ 3.1%</span> improvement</div></div>
        <div className="metric blue"><div className="metric-label">Avg Cycle Time</div><div className="metric-value blue">4.8h</div><div className="metric-change"><span className="up">↓ 22min</span> faster</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Generate Report</div></div>
          <div className="form-group"><label className="form-label">Report Type</label><select className="form-input"><option>Production Summary</option><option>Quality Analysis</option><option>Anomaly Report</option><option>Blockchain Audit Trail</option><option>Operator Performance</option><option>Batch Traceability</option></select></div>
          <div className="form-group"><label className="form-label">Date Range</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input type="date" className="form-input" value="2024-04-01" /><input type="date" className="form-input" value="2024-04-03" /></div></div>
          <div className="form-group"><label className="form-label">Format</label><select className="form-input"><option>PDF Report</option><option>CSV Export</option><option>Excel Workbook</option><option>JSON (API)</option></select></div>
          <div className="form-group"><label className="form-label">Include Sections</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}><span className="chip active">Executive Summary</span><span className="chip active">Part Tracking</span><span className="chip active">Anomaly Log</span><span className="chip">Blockchain Hashes</span><span className="chip">AI Predictions</span></div></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => showToast('Report generation started — will be ready in 30 seconds', '📊')}>Generate Report</button>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Recent Reports</div></div>
          <table>
            <thead><tr><th>Report</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr><td><div style={{ fontSize: '13px', color: 'var(--text)' }}>Production Summary</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>April 2024</div></td><td style={{ fontSize: '12px' }}>Apr 3</td><td><span className="badge badge-success">Ready</span></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast('Downloading report...', '📥')}>↓</button></td></tr>
              <tr><td><div style={{ fontSize: '13px', color: 'var(--text)' }}>Anomaly Analysis</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Week 13</div></td><td style={{ fontSize: '12px' }}>Apr 2</td><td><span className="badge badge-success">Ready</span></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast('Downloading report...', '📥')}>↓</button></td></tr>
              <tr><td><div style={{ fontSize: '13px', color: 'var(--text)' }}>Blockchain Audit</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>March 2024</div></td><td style={{ fontSize: '12px' }}>Apr 1</td><td><span className="badge badge-success">Ready</span></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast('Downloading report...', '📥')}>↓</button></td></tr>
              <tr><td><div style={{ fontSize: '13px', color: 'var(--text)' }}>Quality Report</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Q1 2024</div></td><td style={{ fontSize: '12px' }}>Mar 31</td><td><span className="badge badge-success">Ready</span></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast('Downloading report...', '📥')}>↓</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Reports;