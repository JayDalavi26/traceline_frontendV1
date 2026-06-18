import React, { useState, useEffect, useRef } from 'react';
import { partsAPI, scansAPI, assignmentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat, HTMLCanvasElementLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';
import CameraScanner from './CameraScanner';

const ScanForm = ({ onScanComplete }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [partId, setPartId] = useState('');
  const [stage, setStage] = useState('');
  const [partDetails, setPartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [nextAssignment, setNextAssignment] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // Auto-captured photo for AI
  const [aiResult, setAiResult] = useState(null); // AI inspection result
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

  const handleImageCaptured = (imageFile) => {
    setCapturedImage(imageFile);
    showToast('📸 Photo auto-captured for AI inspection', '🤖');
  };

  const handleProcessScan = async () => {
    if (!partId || !stage) {
      showToast('Please enter Part ID and select a stage', '⚠️');
      return;
    }
    const operatorId = currentUser?.opId || 'OP-0000';
    const operatorName = currentUser?.name || 'Unknown';
    try {
      let response;

      if (capturedImage) {
        // Send scan WITH image → AI will auto-inspect for defects
        showToast('🤖 Running AI defect detection...', '🔍');
        const formData = new FormData();
        formData.append('image', capturedImage);
        formData.append('partId', partId);
        formData.append('stage', stage);
        formData.append('operatorId', operatorId);
        formData.append('operatorName', operatorName);
        response = await scansAPI.recordWithImage(formData);
      } else {
        // No image → standard scan (no AI inspection)
        response = await scansAPI.record({ partId, stage, operatorId, operatorName });
      }

      const scanData = response.data;
      setScanResult(scanData);

      // Set AI result from scan response
      if (scanData.aiInspected) {
        setAiResult({
          defectsFound: scanData.defectsFound,
          riskScore: scanData.riskScore,
          passed: scanData.aiPassed,
        });
        if (!scanData.aiPassed) {
          showToast('🚨 CRITICAL DEFECT — Part blocked by AI!', '⛔');
        } else if (scanData.defectsFound > 0) {
          showToast(`⚠️ ${scanData.defectsFound} defect(s) found — Block #${scanData.blockNumber}`, '⚠️');
        } else {
          showToast(`✅ AI Clear — Block #${scanData.blockNumber}`, '✅');
        }
      } else {
        setAiResult(null);
        showToast(`${partId} logged — Block #${scanData.blockNumber}`, '✅');
      }

      // Fetch updated part to show next assignment
      try {
        const partRes = await partsAPI.getById(partId);
        if (partRes.data.operatorId !== operatorId) {
          setNextAssignment({ operatorName: partRes.data.operatorName, operatorId: partRes.data.operatorId, stage: partRes.data.stage });
        } else {
          setNextAssignment(null);
        }
      } catch (e) { setNextAssignment(null); }

      setPartId('');
      setStage('');
      setPartDetails(null);
      setCapturedImage(null);
      if (onScanComplete) onScanComplete(scanData);
    } catch (err) {
      showToast('Scan failed: ' + (err.response?.data?.message || err.message || 'Not authorized'), '❌');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Use ZXing with Data Matrix support via HTMLCanvasElementLuminanceSource
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128]);
        hints.set(DecodeHintType.TRY_HARDER, true);
        const zxingReader = new BrowserMultiFormatReader(hints);

        let decoded = null;
        try {
          const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
          const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
          const result = zxingReader.decodeBitmap(binaryBitmap);
          if (result) decoded = result.getText();
        } catch (err) {
          console.warn('ZXing image decode failed, trying with preprocessing:', err);
        }

        // Retry with contrast-enhanced preprocessing for metal DMC
        if (!decoded) {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              const val = ((gray - 128) * 1.5 + 128) > 140 ? 255 : 0;
              data[i] = data[i + 1] = data[i + 2] = val;
            }
            ctx.putImageData(imgData, 0, 0);
            const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
            const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
            const result = zxingReader.decodeBitmap(binaryBitmap);
            if (result) decoded = result.getText();
          } catch (err) {
            console.warn('Preprocessed decode also failed:', err);
          }
        }

        if (decoded) {
          showToast(`✓ Code decoded from image: ${decoded}`, '✅');
          setPartId(decoded);
        } else {
          showToast('No DMC/QR code found in image. Try better lighting or angle.', '❌');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '16px' }}>📷 DMC Scanner</div>
      <CameraScanner onScanComplete={handleScanComplete} onImageCaptured={handleImageCaptured} />

      {/* AI capture indicator */}
      {capturedImage && (
        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent3)' }}>Photo captured for AI inspection</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>YOLOv10 will analyze for defects when you process the scan</div>
          </div>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '10px' }} onClick={() => setCapturedImage(null)}>✕</button>
        </div>
      )}
      
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
      
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProcessScan}>
        {capturedImage ? '🔍 Process Scan + AI Inspection' : '⊕ Process Scan & Log to Blockchain'}
      </button>

      {scanResult && (
        <div style={{ marginTop: '16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '16px', border: '1px solid rgba(0,212,170,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}>✅</span>
            <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '14px' }}>Scan Recorded on Blockchain</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div><span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Part ID</span><br /><span className="mono">{scanResult.partId}</span></div>
            <div><span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Stage</span><br /><span>{scanResult.stage}</span></div>
            <div><span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Block Number</span><br /><span style={{ fontWeight: 700, color: 'var(--accent)' }}>#{scanResult.blockNumber}</span></div>
            <div><span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Status</span><br /><span className={`badge ${scanResult.onChain ? 'badge-success' : 'badge-accent'}`}>{scanResult.onChain ? '⛓ On-Chain' : '📦 Local Chain'}</span></div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Block Hash (SHA-256)</span>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--bg)', padding: '8px', borderRadius: '4px', marginTop: '4px', wordBreak: 'break-all', letterSpacing: '0.5px' }}>
              {scanResult.blockHash || '—'}
            </div>
          </div>
          {scanResult.txHash && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase' }}>Ethereum TX Hash</span>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--accent2)', background: 'var(--bg)', padding: '8px', borderRadius: '4px', marginTop: '4px', wordBreak: 'break-all' }}>
                {scanResult.txHash}
              </div>
            </div>
          )}
          {/* AI Inspection Result */}
          {aiResult && (
            <div style={{ marginTop: '12px', padding: '12px', background: aiResult.passed ? 'rgba(0,212,170,0.06)' : 'rgba(255,59,59,0.06)', border: `1px solid ${aiResult.passed ? 'rgba(0,212,170,0.3)' : 'rgba(255,59,59,0.3)'}`, borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '16px' }}>{aiResult.passed ? '🤖' : '🚨'}</span>
                <span style={{ fontWeight: 700, fontSize: '13px', color: aiResult.passed ? 'var(--success)' : 'var(--danger)' }}>
                  {aiResult.passed ? 'AI Inspection Passed' : '⛔ CRITICAL DEFECT — Part Blocked'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Defects</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-head)', color: aiResult.defectsFound > 0 ? 'var(--danger)' : 'var(--success)' }}>{aiResult.defectsFound}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Risk Score</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-head)', color: aiResult.riskScore >= 70 ? 'var(--danger)' : aiResult.riskScore >= 40 ? 'var(--warn)' : 'var(--success)' }}>{aiResult.riskScore}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase' }}>Verdict</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: aiResult.passed ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>{aiResult.passed ? '✅ PASS' : '⛔ FAIL'}</div>
                </div>
              </div>
              {!aiResult.passed && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>
                  Part has been blocked. Admin has been notified. Resolve defect before proceeding.
                </div>
              )}
            </div>
          )}
          {nextAssignment && (
            <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>⚡ Auto-Reassigned to Next Stage</div>
              <div style={{ fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div><span style={{ color: 'var(--text3)', fontSize: '10px' }}>NEXT STAGE</span><br/>{nextAssignment.stage}</div>
                <div><span style={{ color: 'var(--text3)', fontSize: '10px' }}>ASSIGNED TO</span><br/>{nextAssignment.operatorName} ({nextAssignment.operatorId})</div>
              </div>
            </div>
          )}
          <button className="btn btn-ghost" style={{ marginTop: '10px', fontSize: '11px', width: '100%' }} onClick={() => { setScanResult(null); setNextAssignment(null); setAiResult(null); }}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default ScanForm;