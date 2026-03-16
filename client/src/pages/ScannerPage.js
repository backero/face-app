import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { analyzeImage } from '../api/analyzeApi';
import { useTheme } from '../hooks/useTheme';
import '../styles/theme.css';
import '../styles/scanner.css';

const ScannerPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  console.log('data: ', data);
  const [processing, setProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [scanType, setScanType] = useState('skin');
  const [statusMsg, setStatusMsg] = useState('Aligning Sensors...');

  const webcamRef = useRef(null);
  const faceDetectionRef = useRef(null);
  const isBusy = useRef(false);

  const shouldHideSolution = data && data.some((msg) => {
    const m = msg.toLowerCase();
    return (
      m.includes('error') ||
      m.includes('try again') ||
      m.includes('clear and healthy') ||
      m.includes('perfectly clear') ||
      m.includes('no face detected')
    );
  });

  const handleCancel = () => {
    setActive(false);
    setData(null);
    setProcessing(false);
    setIsReady(false);
  };

  const handleRetry = () => {
    setData(null);
    setProcessing(false);
    setIsReady(false);
    setStatusMsg('Aligning Sensors...');
  };

  // Load MediaPipe face detection when scanner is opened
  useEffect(() => {
    if (!active) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const faceDetection = new window.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });
      faceDetection.setOptions({ model: 'short', minDetectionConfidence: 0.6 });
      faceDetection.onResults((res) => {
        if (res.detections?.length > 0) {
          setIsReady(true);
          setStatusMsg('');
          setScanType(
            res.detections[0].categories?.[0]?.score > 0.8 ? 'skin' : 'hair'
          );
        } else {
          setIsReady(false);
          setStatusMsg('Position Face or Hair in frame');
        }
        isBusy.current = false;
      });
      faceDetectionRef.current = faceDetection;
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [active]);

  // Poll webcam frames for face detection
  useEffect(() => {
    if (!active || processing) return;
    const interval = setInterval(async () => {
      if (
        webcamRef.current?.video?.readyState === 4 &&
        !isBusy.current &&
        faceDetectionRef.current
      ) {
        isBusy.current = true;
        await faceDetectionRef.current.send({ image: webcamRef.current.video });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [active, processing]);

  const startScan = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    setCapturedImg(screenshot);
    localStorage.setItem('userHeadImage', screenshot);
    setProcessing(true);
    setData(null);

    // 10-second artificial delay for UX effect before API call
    setTimeout(async () => {
      try {
        const blob = await (await fetch(screenshot)).blob();
        const problems = await analyzeImage(blob);
        setData(problems);
      } catch {
        setData(['Error: Backend connection failed. Please try again.']);
      } finally {
        setProcessing(false);
      }
    }, 10000);
  };

  const openSolution = () => {
    if (data && !shouldHideSolution) {
      navigate('/solutions', { state: { problems: data } });
    }
  };

  return (
    <div className="app-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="dashboard-wrapper">
        <div className="main-card">
          {active && (
            <button className="close-x-btn" onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <h1 className="header">
            TREYFA <span className="highlight">PRO</span>
          </h1>

          {!active ? (
            <button className="action-btn" onClick={() => setActive(true)}>
              Access Scanner
            </button>
          ) : (
            <div className={processing ? 'scanning' : ''}>
              <div className={`camera-stage ${isReady ? 'ready' : ''}`}>
                <div className="laser" />
                {processing ? (
                  <img src={capturedImg} className="webcam-view" alt="Scan" />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    mirrored={true}
                    className="webcam-view"
                  />
                )}
              </div>
              <p className="status-text">{statusMsg}</p>
              <button
                className={`action-btn ${!isReady || processing ? 'disabled' : ''}`}
                onClick={startScan}
                disabled={!isReady || processing}
              >
                {processing ? 'Analyzing...' : 'Analyze Now'}
              </button>
            </div>
          )}
        </div>

        {data && !processing && (
          <div className="report-panel glassmorphic-panel">
            {data.some((m) => m.toLowerCase().includes('error')) ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h4 className="report-header" style={{ color: 'var(--cherry)' }}>Connection Error</h4>
                <p className="error-message">Unable to reach the analysis server. Please check your connection and try again.</p>
                <button className="solution-btn animate-pop" onClick={handleRetry}>
                  Retry Scan
                </button>
              </div>
            ) : (
              <>
                <h4 className="report-header">Clinical Diagnosis</h4>
                {data.map((item, idx) => (
                  <div key={idx} className="report-item">
                    <span>✦</span> {item}
                  </div>
                ))}
                {!shouldHideSolution && (
                  <button className="solution-btn animate-pop" onClick={openSolution}>
                    SOLUTION
                  </button>
                )}
                {shouldHideSolution && (
                  <p style={{ color: 'var(--accent)', fontWeight: 'bold', marginTop: '15px', textAlign: 'center' }}>
                    {scanType === 'skin'
                      ? 'Your skin looks perfectly clear and healthy! No treatment needed.'
                      : 'Your hair and scalp look perfectly healthy! No treatment needed.'}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
