import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

const CameraScanner = ({ onScanComplete, onImageCaptured }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const { showToast } = useToast();
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [lastDetected, setLastDetected] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Initialize ZXing reader with Data Matrix + QR Code + TRY_HARDER
  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    // Enumerate cameras
    reader.listVideoInputDevices().then(devices => {
      setCameraDevices(devices);
      const rear = devices.find(d => 
        d.label.toLowerCase().includes('back') || 
        d.label.toLowerCase().includes('rear') || 
        d.label.toLowerCase().includes('environment')
      );
      setSelectedDevice(rear ? rear.deviceId : devices[0]?.deviceId || '');
    }).catch(() => {});

    return () => {
      if (readerRef.current) readerRef.current.reset();
    };
  }, []);

  const startCamera = async () => {
    if (!readerRef.current) return;
    
    try {
      setCameraActive(true);
      setScanning(true);
      setStatus('Scanning for DMC / QR codes...');
      showToast('Camera active — point at DMC code', '📷');

      const deviceId = selectedDevice || undefined;

      // Use continuous decoding — scans every frame until found
      readerRef.current.decodeFromInputVideoDeviceContinuously(
        deviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const text = result.getText();
            setLastDetected(text);
            setScanning(false);
            setStatus(`✅ Code detected: ${text}`);
            // Stop continuous decode after finding a code
            readerRef.current.stopContinuousDecode();
          }
          // Errors are normal (no code in frame) — ignore them
        }
      );

      // Check torch support after stream is attached
      setTimeout(() => {
        const video = videoRef.current;
        if (video && video.srcObject) {
          const track = video.srcObject.getVideoTracks()[0];
          if (track && track.getCapabilities) {
            const capabilities = track.getCapabilities();
            setTorchSupported(!!capabilities.torch);
          }
        }
      }, 1000);

    } catch (err) {
      setStatus('Camera permission denied');
      showToast('Camera permission denied', '❌');
      setCameraActive(false);
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setCameraActive(false);
    setScanning(false);
    setLastDetected(null);
    setStatus('');
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;
    const track = video.srcObject.getVideoTracks()[0];
    const newTorchState = !torchOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: newTorchState }] });
      setTorchOn(newTorchState);
      showToast(newTorchState ? 'Flashlight ON' : 'Flashlight OFF', '🔦');
    } catch (e) {
      showToast('Torch not supported on this device', '⚠️');
    }
  };

  const confirmAndSubmit = () => {
    if (lastDetected) {
      // Auto-capture photo from camera feed for AI defect inspection
      let capturedFile = null;
      if (videoRef.current && videoRef.current.srcObject) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              capturedFile = new File([blob], `scan-${lastDetected}.jpg`, { type: 'image/jpeg' });
              if (onImageCaptured) onImageCaptured(capturedFile);
            }
          }, 'image/jpeg', 0.9);
        } catch (e) {
          console.warn('Auto-capture failed:', e);
        }
      }
      showToast(`✓ DMC scanned: ${lastDetected}`, '✅');
      onScanComplete(lastDetected);
      stopCamera();
    }
  };

  const retryScanning = () => {
    setLastDetected(null);
    setStatus('Scanning for DMC / QR codes...');
    setScanning(true);

    const deviceId = selectedDevice || undefined;
    readerRef.current.decodeFromInputVideoDeviceContinuously(
      deviceId,
      videoRef.current,
      (result, error) => {
        if (result) {
          const text = result.getText();
          setLastDetected(text);
          setScanning(false);
          setStatus(`✅ Code detected: ${text}`);
          readerRef.current.stopContinuousDecode();
        }
      }
    );
  };

  return (
    <div>
      {/* Camera feed */}
      <div style={{ position: 'relative' }}>
        <div className="camera-placeholder" style={{ display: cameraActive ? 'none' : 'flex' }}>
          <div style={{ fontSize: '48px' }}>📷</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)' }}>Camera Not Active</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Open camera to scan DMC / QR codes on metal parts</div>
        </div>
        <video ref={videoRef} style={{ display: cameraActive ? 'block' : 'none', width: '100%', borderRadius: '12px' }} autoPlay playsInline muted />

        {/* Scanning overlay */}
        {cameraActive && scanning && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: '200px', height: '200px', border: '3px solid var(--accent)', borderRadius: '12px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)', animation: 'pulse 2s infinite' }} />
          </div>
        )}

        {/* Scanning indicator */}
        {cameraActive && scanning && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
            ● SCANNING...
          </div>
        )}
      </div>

      {/* Detection result */}
      {lastDetected && (
        <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(0,212,170,0.1)', border: '1px solid var(--accent)', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '6px' }}>✅ Code Detected</div>
          <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text1)', wordBreak: 'break-all' }}>{lastDetected}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={confirmAndSubmit} style={{ flex: 1 }}>✓ Use This Code</button>
            <button className="btn btn-ghost" onClick={retryScanning} style={{ flex: 1 }}>↻ Scan Again</button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {!cameraActive ? (
          <button className="btn btn-primary" onClick={startCamera} style={{ flex: 1 }}>📷 Open Camera</button>
        ) : (
          <>
            {!scanning && !lastDetected && (
              <button className="btn btn-primary" onClick={retryScanning} style={{ flex: 1 }}>🔄 Resume Scanning</button>
            )}
            {torchSupported && (
              <button className="btn btn-ghost" onClick={toggleTorch} style={{ flex: 'none', padding: '8px 14px' }}>
                🔦 {torchOn ? 'OFF' : 'ON'}
              </button>
            )}
            <button className="btn btn-ghost" onClick={stopCamera} style={{ flex: 'none', padding: '8px 14px' }}>✕ Stop</button>
          </>
        )}
      </div>

      {/* Camera selector */}
      {cameraDevices.length > 1 && !cameraActive && (
        <div style={{ marginTop: '8px' }}>
          <select className="form-input" value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)} style={{ fontSize: '11px' }}>
            {cameraDevices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 8)}`}</option>
            ))}
          </select>
        </div>
      )}

      {status && <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px', textAlign: 'center' }}>{status}</div>}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CameraScanner;