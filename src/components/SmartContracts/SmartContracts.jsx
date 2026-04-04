import React from 'react';
import { useToast } from '../../hooks/useToast';

const SmartContracts = () => {
  const { showToast } = useToast();

  const contracts = [
    { name: 'ProcessSequenceValidator', address: '0x7f3a...9e2b', status: 'Active', desc: 'Validates that each part follows the correct manufacturing sequence', invocations: '5,284', violations: '3' },
    { name: 'DuplicateScanGuard', address: '0x2b9c...4d1f', status: 'Active', desc: 'Prevents duplicate DMC scan entries for the same part ID within a configurable time window', invocations: '5,831', violations: '12' },
    { name: 'OperatorAuthorizationGate', address: '0x8e4a...6c3d', status: 'Active', desc: 'Enforces role-based access control, ensuring operators can only update stages they are authorized for', invocations: '3,291', violations: '1' },
  ];

  return (
    <div className="grid-2">
      <div>
        {contracts.map(contract => (
          <div key={contract.name} className="card section-gap" style={{ cursor: 'pointer' }} onClick={() => showToast('Contract details loaded', '📋')}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div className="card-title">{contract.name}</div>
                <div className="card-subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '4px' }}>{contract.address}</div>
              </div>
              <span className="badge badge-success">{contract.status}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>{contract.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px', borderRadius: 'var(--radius)' }}><div style={{ fontSize: '10px', color: 'var(--text3)' }}>Invocations Today</div><div style={{ fontWeight: 700, color: 'var(--text)' }}>{contract.invocations}</div></div>
              <div style={{ background: 'var(--bg3)', padding: '10px', borderRadius: 'var(--radius)' }}><div style={{ fontSize: '10px', color: 'var(--text3)' }}>Violations Caught</div><div style={{ fontWeight: 700, color: 'var(--danger)' }}>{contract.violations}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Contract Code Preview</div>
          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.8', overflowX: 'auto', border: '1px solid var(--border)' }}>
            <span style={{ color: '#7c3aed' }}>pragma</span> <span style={{ color: 'var(--accent)' }}>solidity</span> ^0.8.0;<br /><br />
            <span style={{ color: '#7c3aed' }}>contract</span> <span style={{ color: 'var(--warn)' }}>ProcessSequenceValidator</span> {`{`}<br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>mapping</span>(<span style={{ color: 'var(--accent2)' }}>string</span> =&gt; <span style={{ color: 'var(--accent2)' }}>uint8</span>) <span style={{ color: 'var(--text2)' }}>currentStage</span>;<br /><br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>event</span> <span style={{ color: 'var(--warn)' }}>StageValidated</span>(<span style={{ color: 'var(--accent2)' }}>string</span> partId, <span style={{ color: 'var(--accent2)' }}>uint8</span> stage);<br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>event</span> <span style={{ color: 'var(--danger)' }}>SequenceViolation</span>(<span style={{ color: 'var(--accent2)' }}>string</span> partId, <span style={{ color: 'var(--accent2)' }}>uint8</span> expected, <span style={{ color: 'var(--accent2)' }}>uint8</span> actual);<br /><br />
            &nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>function</span> <span style={{ color: 'var(--accent)' }}>validateStage</span>(<span style={{ color: 'var(--accent2)' }}>string memory</span> partId, <span style={{ color: 'var(--accent2)' }}>uint8</span> stage) <span style={{ color: '#7c3aed' }}>public</span> {`{`}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>require</span>(stage == currentStage[partId] + 1, <span style={{ color: 'var(--warn)' }}>"Invalid sequence"</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;currentStage[partId] = stage;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#7c3aed' }}>emit</span> <span style={{ color: 'var(--accent)' }}>StageValidated</span>(partId, stage);<br />
            &nbsp;&nbsp;{`}`}<br />
            {`}`}
          </div>

          <div className="card-title" style={{ margin: '20px 0 16px' }}>Deploy New Contract</div>
          <div className="form-group"><label className="form-label">Contract Name</label><input type="text" className="form-input" placeholder="e.g. QualityThresholdEnforcer" /></div>
          <div className="form-group"><label className="form-label">Contract Type</label><select className="form-input"><option>Validation Rule</option><option>Access Control</option><option>Alert Trigger</option><option>Data Immutability</option></select></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => showToast('Contract deployment initiated — pending network confirmation', '⛓')}>Deploy to Blockchain</button>
        </div>
      </div>
    </div>
  );
};

export default SmartContracts;