import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { partsData } from '../../data/mockData';

const ScanForm = ({ scannedResult, onScanComplete }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [partId, setPartId] = useState('');
  const [stage, setStage] = useState('Intake');
  const [operatorId, setOperatorId] = useState(currentUser?.opId || 'OP-0042');
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (scannedResult) {
      setPartId(scannedResult);
      const found = partsData.find(p => p.id === scannedResult);
      if (found) {
        setResultData(found);
        setShowResult(true);
      } else {
        setResultData(null);
        setShowResult(true);
      }
    }
  }, [scannedResult]);

  const handleSimulate = () => {
    const newId = `TL-2024-${Math.floor(8825 + Math.random() * 100)}`;
    setPartId(newId);
    setResultData(null);
    setShowResult(true);
    showToast(`DMC code simulated: ${newId}`, '⬡');
  };

  const handleProcessScan = () => {
    if (!partId) {
      showToast('Please enter a Part ID', '⚠️');
      return;
    }

    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const opName = currentUser?.name || 'R. Sharma';
    const opIdFinal = currentUser?.opId || operatorId;

    const newLog = {
      time,
      partId,
      stage,
      operator: opIdFinal,
      name: opName,
      block: `#${10492 + Math.floor(Math.random() * 100)}`,
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
      status: 'success'
    };

    onScanComplete(newLog);
    showToast(`${partId} logged to blockchain — Stage: ${stage}`, '✅');
    setPartId('');
    setShowResult(false);
    setResultData(null);
  };

  return (
    <>
      <div style={{ position: 'relative', margin: '8px 0 16px' }}>
        <div style={{ height: '1px', background: 'var(--border)' }}></div>
        <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', padding: '0 10px', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>or enter manually</span>
      </div>

      <div className="form-group">
        <label className="form-label">Part ID (DMC Code)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" className="form-input" placeholder="e.g. TL-2024-8825" value={partId} onChange={(e) => setPartId(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={handleSimulate} style={{ whiteSpace: 'nowrap' }}>⬡ Auto-fill</button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Process Stage</label>
        <select className="form-input" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option>Intake</option><option>Cutting</option><option>Drilling</option><option>Heat Treatment</option><option>Surface Finish</option><option>Inspection</option><option>Assembly</option>
        </select>
      </div>

      <div className="form-group" id="operatorIdField">
        <label className="form-label">Operator ID</label>
        <input type="text" className="form-input" placeholder="Scan operator badge..." value={operatorId} onChange={(e) => setOperatorId(e.target.value)} readOnly={!!currentUser?.opId} style={{ opacity: currentUser?.opId ? '0.6' : '1' }} />
      </div>

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProcessScan}>⊕ Process Scan &amp; Log to Blockchain</button>

      <div className={`scanned-result ${showResult ? 'show' : ''}`} id="scannedResult">
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '10px' }}>✓ DMC Decoded — Part Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
          <div><span style={{ color: 'var(--text3)' }}>Part ID</span><br /><span className="mono">{resultData?.id || partId || '—'}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Batch</span><br /><span style={{ color: 'var(--text)' }}>{resultData?.batch || 'B-2024-12'}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Material</span><br /><span style={{ color: 'var(--text)' }}>{resultData?.material || 'Steel AISI 1018'}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Current Stage</span><br /><span style={{ color: 'var(--text)' }}>{resultData?.stage || stage}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Operator</span><br /><span style={{ color: 'var(--text)' }}>{resultData?.operator || currentUser?.name || 'Unknown'}</span></div>
          <div><span style={{ color: 'var(--text3)' }}>Risk Score</span><br /><span style={{ fontWeight: 700, color: resultData?.risk > 70 ? 'var(--danger)' : resultData?.risk > 40 ? 'var(--warn)' : 'var(--text2)' }}>{resultData?.risk || '—'}%</span></div>
        </div>
      </div>
    </>
  );
};

export default ScanForm;