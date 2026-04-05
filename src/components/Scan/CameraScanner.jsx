import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { BrowserMultiFormatReader } from '@zxing/library';

const CameraScanner = ({ onScanComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { showToast } = useToast();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    // Load jsQR as fallback
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.onload = () => console.log('jsQR loaded as fallback');
    document.head.appendChild(script);
    
    return () => {
      if (streamRef.current) stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      videoRef.current.play();
      setCameraActive(true);
      setStatus('Camera ready – position code, then click Validate or Capture');
      showToast('Camera active', '📷');
    } catch (err) {
      setStatus('Camera permission denied');
      showToast('Camera permission denied', '❌');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setPreview(null);
    setValidationResult(null);
    setStatus('');
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video || video.readyState !== 4 || video.videoWidth === 0) {
      showToast('Camera not ready', '⚠️');
      return null;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const previewUrl = canvas.toDataURL('image/png');
    setPreview(previewUrl);
    return { canvas, ctx };
  };

  const decodeImage = async (canvas, ctx) => {
    let decoded = null;
    const reader = new BrowserMultiFormatReader();
    
    try {
      // Decode using ZXing
      const result = await reader.decodeFromCanvas(canvas);
      if (result) decoded = result.getText();
    } catch (err) {
      console.warn('ZXing decode error:', err);
    }
    
    // Fallback to jsQR if ZXing fails
    if (!decoded && window.jsQR) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) decoded = code.data;
      } catch (err) {
        console.warn('jsQR error:', err);
      }
    }
    
    return decoded;
  };

  const handleValidate = async () => {
    const capture = captureImage();
    if (!capture) return;
    setValidating(true);
    setStatus('Validating...');
    setValidationResult(null);
    const decoded = await decodeImage(capture.canvas, capture.ctx);
    if (decoded) {
      setValidationResult({ valid: true, data: decoded });
      setStatus(`✅ Valid DMC code detected: ${decoded}`);
      showToast(`Valid DMC: ${decoded}`, '✅');
    } else {
      setValidationResult({ valid: false });
      setStatus('❌ No valid DMC code found. Adjust focus/lighting.');
      showToast('Invalid or unreadable code', '❌');
    }
    setValidating(false);
  };

  const handleCaptureAndScan = async () => {
    const capture = captureImage();
    if (!capture) return;
    setCapturing(true);
    setStatus('Capturing and decoding...');
    const decoded = await decodeImage(capture.canvas, capture.ctx);
    if (decoded) {
      showToast(`✓ DMC scanned: ${decoded}`, '✅');
      onScanComplete(decoded);
      stopCamera();
    } else {
      setStatus('No code detected. Please retry.');
      showToast('No code found', '❌');
    }
    setCapturing(false);
  };

  return (
    <div>
      <div className="camera-placeholder" style={{ display: cameraActive ? 'none' : 'flex' }}>
        <div style={{ fontSize: '48px' }}>📷</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)' }}>Camera Not Active</div>
        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Open camera to validate or scan DMC code</div>
      </div>
      <video ref={videoRef} style={{ display: cameraActive ? 'block' : 'none', width: '100%', borderRadius: '12px' }} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {preview && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Captured image:</div>
          <img src={preview} alt="Captured" style={{ maxWidth: '100%', maxHeight: '150px', border: '1px solid var(--border)', borderRadius: '8px' }} />
        </div>
      )}
      {validationResult && !validationResult.valid && (
        <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: 'var(--danger)' }}>
          ❌ Invalid or unreadable DMC code
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button className="btn btn-primary" onClick={startCamera} style={{ flex: 1 }}>📷 Open Camera</button>
        {cameraActive && (
          <>
            <button className="btn btn-ghost" onClick={handleValidate} disabled={validating} style={{ flex: 1 }}>
              {validating ? 'Validating...' : '🔍 Validate'}
            </button>
            <button className="btn btn-primary" onClick={handleCaptureAndScan} disabled={capturing} style={{ flex: 1 }}>
              {capturing ? 'Scanning...' : '📸 Capture & Scan'}
            </button>
          </>
        )}
        <button className="btn btn-ghost" onClick={stopCamera} style={{ flex: 1 }}>✕ Stop</button>
      </div>
      {status && <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px', textAlign: 'center' }}>{status}</div>}
    </div>
  );
};

export default CameraScanner;