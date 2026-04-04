import React from 'react';
import { useToast } from '../../hooks/useToast';

const Settings = () => {
  const { showToast } = useToast();

  return (
    <div className="grid-2">
      <div>
        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: '20px' }}>System Configuration</div>
          <div className="form-group"><label className="form-label">Plant Name</label><input type="text" className="form-input" value="Pune Manufacturing Unit 1" /></div>
          <div className="form-group"><label className="form-label">Blockchain Network</label><select className="form-input"><option>Private Network (Ganache)</option><option>Ethereum Testnet</option><option>Hyperledger Fabric</option></select></div>
          <div className="form-group"><label className="form-label">AI Model Version</label><select className="form-input"><option selected>v2.4 — Current (Recommended)</option><option>v2.3 — Stable</option><option>v3.0 — Beta</option></select></div>
          <div className="form-group"><label className="form-label">Anomaly Alert Threshold</label><input type="range" style={{ width: '100%', marginTop: '8px' }} min="50" max="99" defaultValue="75" /><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}><span>50% (Sensitive)</span><span>75%</span><span>99% (Strict)</span></div></div>
          <button className="btn btn-primary" onClick={() => showToast('Settings saved successfully', '✅')}>Save Configuration</button>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>Notification Settings</div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Critical Anomaly Alerts</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>Immediate notification</div></div><input type="checkbox" defaultChecked /></div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Email Reports</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>Daily digest at 7AM</div></div><input type="checkbox" defaultChecked /></div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Blockchain Confirmation</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>Per-transaction log</div></div><input type="checkbox" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>AI Recommendation Push</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>Predictive insights</div></div><input type="checkbox" defaultChecked /></div>
        </div>
      </div>

      <div>
        <div className="card section-gap">
          <div className="card-title" style={{ marginBottom: '20px' }}>Integration & API</div>
          <div className="form-group"><label className="form-label">API Key</label><div style={{ display: 'flex', gap: '8px' }}><input type="password" className="form-input" value="sk-traceline-prod-xxxxxxxxxxxx" style={{ flex: 1 }} /><button className="btn btn-ghost" onClick={() => showToast('API key copied to clipboard', '📋')}>Copy</button></div></div>
          <div className="form-group"><label className="form-label">Webhook URL</label><input type="text" className="form-input" placeholder="https://your-erp-system.com/webhook" /></div>
          <div className="form-group"><label className="form-label">ERP Integration</label><select className="form-input"><option>SAP S/4HANA</option><option>Oracle ERP</option><option>None</option></select></div>
          <div style={{ display: 'flex', gap: '8px' }}><span className="badge badge-success">API Active</span><span className="badge badge-success">Webhook Connected</span></div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>System Info</div>
          <table>
            <tbody>
              <tr><td style={{ color: 'var(--text3)' }}>Version</td><td style={{ textAlign: 'right' }}><span className="mono">TraceLine v1.0.0</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>Backend</td><td style={{ textAlign: 'right' }}><span className="mono">Spring Boot 3.2</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>Frontend</td><td style={{ textAlign: 'right' }}><span className="mono">React 18.2</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>Blockchain</td><td style={{ textAlign: 'right' }}><span className="mono">Solidity 0.8.0</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>AI Engine</td><td style={{ textAlign: 'right' }}><span className="mono">PyTorch 2.1</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>Database</td><td style={{ textAlign: 'right' }}><span className="mono">MySQL 8.0</span></td></tr>
              <tr><td style={{ color: 'var(--text3)' }}>Uptime</td><td style={{ textAlign: 'right' }}><span style={{ color: 'var(--success)' }}>99.94% — 23d 14h</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settings;