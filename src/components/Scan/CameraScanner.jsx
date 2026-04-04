import React, { useEffect } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useToast } from '../../hooks/useToast';

const CameraScanner = ({ onScanComplete }) => {
  const { videoRef, isActive, detectedCode, startCamera, stopCamera, startScanLoop } = useCamera();
  const { showToast } = useToast();

  useEffect(() => {
    if (detectedCode) {
      onScanComplete(detectedCode);
      showToast(`DMC Code detected: ${detectedCode}`, '⬡');
    }
  }, [detectedCode, onScanComplete, showToast]);

  const handleOpenCamera = async () => {
    const success = await startCamera();
    if (success) {
      setTimeout(() => {
        startScanLoop((code) => {
          // Callback handled by useEffect
        });
      }, 500);
    } else {
      showToast('Camera unavailable — use manual entry below.', '⚠️');
    }
  };

  const handleStopCamera = () => {
    stopCamera();
  };

  const handleCapture = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) {
      showToast('Frame captured — Simulating DMC decode (no code found in frame)', '⬡');
      const mockId = `TL-2024-${Math.floor(8825 + Math.random() * 100)}`;
      onScanComplete(mockId);
    }
  };

  return (
    <>
      {!isActive ? (
        <>
          <div className="camera-placeholder">
            <div style={{ fontSize: '48px' }}>📷</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text2)' }}>Camera Not Active</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Open camera to scan DMC codes in real-time</div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }} onClick={handleOpenCamera}>📷 Open Camera for DMC Scanning</button>
        </>
      ) : (
        <>
          <div className="camera-container">
            <video ref={videoRef} id="cameraFeed" autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            <div className="camera-overlay">
              <div className="scan-frame">
                <div className="sf-br"></div>
                <div className="sf-bl"></div>
                <div className="scan-line"></div>
              </div>
            </div>
          </div>
          <div className="camera-status-bar">
            <div className="dot green" style={{ animation: 'pulse 1s infinite' }}></div>
            <span>Camera active — Position DMC code in frame</span>
            <button className="btn btn-ghost" style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '11px' }} onClick={handleStopCamera}>✕ Stop</button>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }} onClick={handleCapture}>⬡ Capture & Decode DMC</button>
        </>
      )}
    </>
  );
};

export default CameraScanner;