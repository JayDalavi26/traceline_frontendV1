import React from 'react';
import { useToast } from '../../hooks/useToast';

const Predictive = () => {
  const { showToast } = useToast();

  return (
    <>
      <div className="ai-insight section-gap">
        <div className="ai-tag">✦ Predictive Intelligence Engine</div>
        <p style={{ fontSize: '14px', color: 'var(--text)' }}>AI models trained on 6 months of production data. Predictions updated every 15 minutes based on real-time sensor readings and historical patterns.</p>
      </div>

      <div className="grid-2">
        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: '20px' }}>Bottleneck Forecast — Next 4 Hours</div>
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '13px', color: 'var(--text)' }}>Heat Treatment (Furnace 2)</span><span className="badge badge-danger">High Risk</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Predicted 45-min delay • 78% confidence</div>
            <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '78%', background: 'var(--danger)', borderRadius: '4px' }}></div></div>
          </div>
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '13px', color: 'var(--text)' }}>Inspection Bay 1</span><span className="badge badge-warn">Medium Risk</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Predicted 20-min delay • 55% confidence</div>
            <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '55%', background: 'var(--warn)', borderRadius: '4px' }}></div></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '13px', color: 'var(--text)' }}>Drilling Station 3</span><span className="badge badge-info">Low Risk</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Predicted 8-min delay • 31% confidence</div>
            <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: '31%', background: 'var(--accent2)', borderRadius: '4px' }}></div></div>
          </div>
        </div>

        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: '20px' }}>Part Defect Risk Scores</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Batch</th><th>Defect Risk</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><span className="mono">B-2024-11</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="risk-meter" style={{ width: '80px' }}><div className="risk-needle" style={{ left: '71%' }}></div></div><span style={{ color: 'var(--danger)', fontWeight: 600 }}>71%</span></div></td><td><button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => showToast('Alert sent to production team', '📨')}>Alert</button></td></tr>
                <tr><td><span className="mono">B-2024-10</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="risk-meter" style={{ width: '80px' }}><div className="risk-needle" style={{ left: '38%' }}></div></div><span style={{ color: 'var(--warn)', fontWeight: 600 }}>38%</span></div></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }}>Monitor</button></td></tr>
                <tr><td><span className="mono">B-2024-09</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="risk-meter" style={{ width: '80px' }}><div className="risk-needle" style={{ left: '12%' }}></div></div><span style={{ color: 'var(--success)', fontWeight: 600 }}>12%</span></div></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }}>Stable</button></td></tr>
                <tr><td><span className="mono">B-2024-08</span></td><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="risk-meter" style={{ width: '80px' }}><div className="risk-needle" style={{ left: '8%' }}></div></div><span style={{ color: 'var(--success)', fontWeight: 600 }}>8%</span></div></td><td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }}>Stable</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Predictive;