import React, { useState, useEffect, useRef } from 'react';
import { aiAPI, partsAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

const AIInspection = () => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedStage, setSelectedStage] = useState('Inspection');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [result, setResult] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stages = ['Cutting', 'Drilling', 'Milling', 'Grinding', 'Welding', 'Assembly', 'Inspection', 'QC'];

  useEffect(() => {
    partsAPI.getAll().then(res => setParts(res.data || [])).catch(() => {});
    aiAPI.getStatus().then(res => setAiStatus(res.data)).catch(() => setAiStatus({ online: false }));
    return () => stopCamera();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseCamera(true);
    } catch (err) {
      showToast('Camera access denied', '❌');
    }
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setImageFile(file);
      setImagePreview(canvas.toDataURL('image/jpeg'));
      setResult(null);
    }, 'image/jpeg', 0.9);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const runInspection = async () => {
    if (!imageFile) { showToast('Select or capture an image first', '⚠️'); return; }
    setInspecting(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('partId', selectedPartId || 'UNLINKED');
      formData.append('stage', selectedStage);
      formData.append('operatorId', currentUser?.opId || currentUser?.username || '');

      const res = await aiAPI.inspectPart(formData);
      setResult(res.data);
      setHistory(prev => [res.data, ...prev].slice(0, 20));

      if (res.data.passed) {
        showToast('Inspection passed — no critical defects', '✅');
      } else {
        showToast('CRITICAL DEFECT DETECTED — Part blocked!', '🚨');
      }

      // Draw bounding boxes on canvas
      if (res.data.detections?.length > 0) {
        drawDetections(res.data.detections);
      }
    } catch (err) {
      showToast('Inspection failed: ' + (err.response?.data?.error || err.message), '❌');
    } finally {
      setInspecting(false);
    }
  };

  const drawDetections = (detections) => {
    const canvas = canvasRef.current;
    const img = document.getElementById('inspection-image');
    if (!canvas || !img) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.style.width = img.clientWidth + 'px';
    canvas.style.height = img.clientHeight + 'px';

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = img.naturalWidth / (img.naturalWidth || 1);
    const scaleY = img.naturalHeight / (img.naturalHeight || 1);

    detections.forEach(det => {
      const colors = { critical: '#ff3b3b', medium: '#f0a500', low: '#3b82f6' };
      const color = colors[det.severity] || '#3b82f6';

      const x = (det.bbox.x - det.bbox.width / 2) * scaleX;
      const y = (det.bbox.y - det.bbox.height / 2) * scaleY;
      const w = det.bbox.width * scaleX;
      const h = det.bbox.height * scaleY;

      // Draw box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Draw label background
      const label = `${det.label} ${det.confidence}%`;
      ctx.font = 'bold 14px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 22, textWidth + 12, 22);

      // Draw label text
      ctx.fillStyle = '#fff';
      ctx.fillText(label, x + 6, y - 6);
    });
  };

  const severityColor = (s) => s === 'critical' ? 'var(--danger)' : s === 'medium' ? 'var(--warn)' : 'var(--accent2)';
  const severityBadge = (s) => s === 'critical' ? 'badge-danger' : s === 'medium' ? 'badge-warn' : 'badge-info';

  return (
    <>
      {/* AI Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px 16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: aiStatus?.online ? 'var(--success)' : 'var(--danger)', boxShadow: aiStatus?.online ? '0 0 8px var(--success)' : '0 0 8px var(--danger)' }}></div>
        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
          AI Engine: {aiStatus?.online ? `Online (${aiStatus.model})` : 'Offline — simulation mode'}
        </span>
        {aiStatus?.roboflowConfigured && <span className="badge badge-accent">Roboflow</span>}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text3)' }}>YOLOv10 Defect Detection</div>
      </div>

      <div className="grid-2">
        {/* Left: Upload / Camera */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Part Inspection</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => fileInputRef.current?.click()}>📁 Upload</button>
              <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={useCamera ? captureFromCamera : startCamera}>
                {useCamera ? '📸 Capture' : '🎥 Camera'}
              </button>
            </div>
          </div>

          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />

          {/* Camera View */}
          {useCamera && (
            <div style={{ position: 'relative', marginBottom: '16px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '2px solid var(--accent)' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block' }} />
              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={stopCamera}>✕ Close</button>
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}>
                <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '50px' }} onClick={captureFromCamera}>📸 Capture Photo</button>
              </div>
            </div>
          )}

          {/* Image Preview with Detection Overlay */}
          {imagePreview && !useCamera && (
            <div style={{ position: 'relative', marginBottom: '16px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img id="inspection-image" src={imagePreview} alt="Part" style={{ width: '100%', display: 'block' }}
                   onLoad={() => result?.detections?.length > 0 && drawDetections(result.detections)} />
              <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
            </div>
          )}

          {!imagePreview && !useCamera && (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '2px dashed var(--border)', cursor: 'pointer', marginBottom: '16px' }}
                 onClick={() => fileInputRef.current?.click()}>
              <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>📷</div>
              <div style={{ fontSize: '14px', color: 'var(--text2)', fontWeight: 600 }}>Upload part image or use camera</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>Supports JPG, PNG • Max 10MB</div>
            </div>
          )}

          {/* Part Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600 }}>Part ID</label>
              <select value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '13px' }}>
                <option value="">Select part...</option>
                {parts.map(p => <option key={p.partId} value={p.partId}>{p.partId}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 600 }}>Stage</label>
              <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '13px' }}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
                  onClick={runInspection} disabled={inspecting || !imageFile}>
            {inspecting ? '🔄 Analyzing with YOLOv10...' : '🔍 Run AI Inspection'}
          </button>
        </div>

        {/* Right: Results */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Detection Results</div>
            {result && <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`}>{result.passed ? '✅ PASSED' : '⛔ FAILED'}</span>}
          </div>

          {!result ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>🤖</div>
              <div style={{ color: 'var(--text3)', fontSize: '14px' }}>Upload an image and run inspection</div>
              <div style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '4px' }}>AI will detect cracks, dents, corrosion, and more</div>
            </div>
          ) : (
            <>
              {/* Summary Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '14px', background: 'var(--bg3)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase' }}>Defects</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-head)', color: result.defectsFound > 0 ? 'var(--danger)' : 'var(--success)' }}>{result.defectsFound}</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg3)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase' }}>Risk Score</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-head)', color: result.riskScore >= 70 ? 'var(--danger)' : result.riskScore >= 40 ? 'var(--warn)' : 'var(--success)' }}>{result.riskScore}</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg3)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase' }}>Inference</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{result.inferenceTimeMs}ms</div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{result.inferenceMode}</div>
                </div>
              </div>

              {/* Severity Badge */}
              {result.highestSeverity !== 'none' && (
                <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '16px',
                  background: result.highestSeverity === 'critical' ? 'rgba(255,59,59,0.08)' : result.highestSeverity === 'medium' ? 'rgba(240,165,0,0.08)' : 'rgba(59,130,246,0.08)',
                  border: `1px solid ${severityColor(result.highestSeverity)}30` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{result.highestSeverity === 'critical' ? '🔴' : result.highestSeverity === 'medium' ? '🟡' : '🔵'}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: severityColor(result.highestSeverity), textTransform: 'uppercase' }}>
                      {result.highestSeverity} Severity
                    </span>
                  </div>
                </div>
              )}

              {/* Detection List */}
              {result.detections?.map((det, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', marginBottom: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                    background: det.severity === 'critical' ? 'rgba(255,59,59,0.12)' : det.severity === 'medium' ? 'rgba(240,165,0,0.12)' : 'rgba(59,130,246,0.12)' }}>
                    {det.severity === 'critical' ? '💥' : det.severity === 'medium' ? '⚡' : 'ℹ️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{det.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                      Risk: {det.riskWeight} • {det.bbox.width.toFixed(0)}×{det.bbox.height.toFixed(0)}px
                      {det.simulated && ' • Simulated'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-head)', color: severityColor(det.severity) }}>{det.confidence}%</div>
                    <span className={`badge ${severityBadge(det.severity)}`} style={{ fontSize: '10px' }}>{det.severity}</span>
                  </div>
                </div>
              ))}

              {result.defectsFound === 0 && (
                <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(0,212,170,0.06)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '14px' }}>No Defects Detected</div>
                  <div style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '4px' }}>Part cleared for next stage</div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className="ai-insight" style={{ marginTop: '16px' }}>
                <div className="ai-tag">✦ AI Recommendation</div>
                <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.6' }}>{result.recommendation}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inspection History */}
      {history.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <div className="card-title">Inspection History (This Session)</div>
            <span className="badge">{history.length} inspections</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Part ID</th><th>Stage</th><th>Defects</th><th>Severity</th><th>Risk</th><th>Result</th><th>Time</th></tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td><span className="mono">{h.partId}</span></td>
                    <td>{h.stage}</td>
                    <td style={{ fontWeight: 700, color: h.defectsFound > 0 ? 'var(--danger)' : 'var(--success)' }}>{h.defectsFound}</td>
                    <td><span className={`badge ${severityBadge(h.highestSeverity)}`}>{h.highestSeverity}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', height: '6px', background: 'var(--bg3)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${h.riskScore}%`, background: h.riskScore >= 70 ? 'var(--danger)' : h.riskScore >= 40 ? 'var(--warn)' : 'var(--success)', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{h.riskScore}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${h.passed ? 'badge-success' : 'badge-danger'}`}>{h.passed ? 'PASS' : 'FAIL'}</span></td>
                    <td style={{ fontSize: '11px', color: 'var(--text3)' }}>{h.inferenceTimeMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AIInspection;
