import React, { useState, useEffect, useRef } from 'react';
import { partsAPI, scansAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import CameraScanner from './CameraScanner';

const ScanForm = ({ onScanComplete }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [partId, setPartId] = useState('');
  const [stage, setStage] = useState('');
  const [partDetails, setPartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const stages = ['Intake', 'Cutting', 'Drilling', 'Heat Treatment', 'Inspection', 'Assembly'];

  // Auto-fetch part details when Part ID changes
  useEffect(() => {
    if (!partId || partId.length < 5) {
      setPartDetails(null);
      return;
    }
    const fetchPart = async () => {
      setLoading(true);
      try {
        const res = await partsAPI.getById(partId);
        setPartDetails(res.data);
        const currentIndex = stages.indexOf(res.data.stage);
        if (currentIndex !== -1 && currentIndex + 1 < stages.length) {
          setStage(stages[currentIndex + 1]);
        } else {
          setStage('');
        }
      } catch (err) {
        setPartDetails(null);
        showToast('Part not found or not assigned to you', '❌');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchPart, 500);
    return () => clearTimeout(timer);
  }, [partId]);

  const handleScanComplete = (decodedId) => {
    setPartId(decodedId);
    showToast(`DMC detected: ${decodedId}`, '⬡');
  };

  const handleProcessScan = async () => {
    if (!partId || !stage) {
      showToast('Please enter Part ID and select a stage', '⚠️');
      return;
    }
    const operatorId = currentUser?.opId || 'OP-0000';
    const operatorName = currentUser?.name || 'Unknown';
    try {
      const response = await scansAPI.record({ partId, stage, operatorId, operatorName });
      showToast(`${partId} logged — Block #${response.data.blockNumber}`, '✅');
      setPartId('');
      setStage('');
      setPartDetails(null);
      if (onScanComplete) onScanComplete(response.data);
    } catch (err) {
      showToast('Scan failed. You may not be authorized.', '❌');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Ensure jsQR is loaded
        if (!window.jsQR) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
          script.onload = () => decodeWithJSQR(imageData, canvas.width, canvas.height);
          document.head.appendChild(script);
        } else {
          decodeWithJSQR(imageData, canvas.width, canvas.height);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const decodeWithJSQR = (imageData, width, height) => {
    const code = window.jsQR(imageData.data, width, height);
    if (code && code.data) {
      showToast(`✓ DMC decoded from image: ${code.data}`, '✅');
      setPartId(code.data);
    } else {
      showToast('No DMC code found in the uploaded image', '❌');
    }
    // Reset file input so same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '16px' }}>📷 DMC Scanner</div>
      <CameraScanner onScanComplete={handleScanComplete} />
      
      <div style={{ position: 'relative', margin: '16px 0' }}>
        <div style={{ height: '1px', background: 'var(--border)' }}></div>
        <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', padding: '0 10px', fontSize: '11px', color: 'var(--text3)' }}>or</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className="btn btn-ghost" onClick={triggerFileUpload} style={{ flex: 1 }}>
          📂 Upload DMC Image
        </button>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>
      
      <div style={{ position: 'relative', margin: '16px 0' }}>
        <div style={{ height: '1px', background: 'var(--border)' }}></div>
        <span style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', padding: '0 10px', fontSize: '11px', color: 'var(--text3)' }}>or enter manually</span>
      </div>
      
      <div className="form-group">
        <label className="form-label">Part ID (DMC Code)</label>
        <input type="text" className="form-input" placeholder="e.g. TL-2024-9001" value={partId} onChange={(e) => setPartId(e.target.value)} />
      </div>
      
      {loading && <div style={{ textAlign: 'center', margin: '10px 0' }}>Loading part details...</div>}
      {partDetails && !loading && (
        <div className="scanned-result show" style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>✓ Part Found</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div><span style={{ color: 'var(--text3)' }}>Batch</span><br /><span>{partDetails.batch}</span></div>
            <div><span style={{ color: 'var(--text3)' }}>Material</span><br /><span>{partDetails.material}</span></div>
            <div><span style={{ color: 'var(--text3)' }}>Current Stage</span><br /><span>{partDetails.stage}</span></div>
            <div><span style={{ color: 'var(--text3)' }}>Assigned Operator</span><br /><span>{partDetails.operatorName}</span></div>
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Next Process Stage</label>
        <select className="form-input" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">Select stage</option>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Operator ID</label>
        <input type="text" className="form-input" value={currentUser?.opId || ''} readOnly disabled style={{ opacity: 0.7 }} />
      </div>
      
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProcessScan}>⊕ Process Scan &amp; Log to Blockchain</button>
    </div>
  );
};

export default ScanForm;