import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedCode, setDetectedCode] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      return true;
    } catch (err) {
      console.error('Camera error:', err);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setDetectedCode(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startScanLoop = useCallback((onDecode) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    intervalRef.current = setInterval(() => {
      if (!videoRef.current || !videoRef.current.videoWidth) return;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          setDetectedCode(code.data);
          if (onDecode) onDecode(code.data);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeout(() => {
            if (stream) startScanLoop(onDecode);
          }, 3000);
        }
      }
    }, 400);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return { videoRef, canvasRef, isActive, detectedCode, startCamera, stopCamera, startScanLoop };
};