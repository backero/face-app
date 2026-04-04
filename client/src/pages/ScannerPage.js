import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { analyzeImage } from '../api/analyzeApi';
import { useTheme } from '../hooks/useTheme';
import '../styles/theme.css';
import '../styles/scanner.css';

const SCAN_MESSAGES = [
  'Capturing facial geometry…',
  'Analyzing skin texture…',
  'Detecting acne patterns…',
  'Measuring hydration levels…',
  'Mapping problem zones…',
  'Generating your skin report…',
];

const ScannerPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [scanType, setScanType] = useState('skin');
  const [statusMsg, setStatusMsg] = useState('Align your face in the frame');
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

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
    setScanMsgIdx(0);
    setScanProgress(0);
  };

  const handleRetry = () => {
    setData(null);
    setProcessing(false);
    setIsReady(false);
    setStatusMsg('Align your face in the frame');
    setScanMsgIdx(0);
    setScanProgress(0);
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
          setStatusMsg('Position your face in the frame');
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

  // Cycle through scan messages during processing
  useEffect(() => {
    if (!processing) return;
    setScanMsgIdx(0);
    setScanProgress(0);

    const msgInterval = setInterval(() => {
      setScanMsgIdx((prev) => Math.min(prev + 1, SCAN_MESSAGES.length - 1));
    }, 1600);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + 1, 100));
    }, 95);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [processing]);

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
        {theme === 'dark' ? '☀ Light' : '⏾ Dark'}
      </button>

      <div className="dashboard-wrapper">
        {/* ── Main scanner card ── */}
        <div className="main-card">
          {active && (
            <button className="close-x-btn" onClick={handleCancel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <h1 className="header">
            Treyfa <span className="highlight">Pro</span>
          </h1>
          <p className="scanner-tagline">Botanical Skin Intelligence</p>

          {!active ? (
            <>
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 6px' }}>
                  AI-powered skin analysis in under 30 seconds.
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Detects acne, oiliness, dark circles & more.
                </p>
              </div>
              <button className="action-btn" onClick={() => setActive(true)}>
                Start Skin Scan
              </button>
            </>
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

              {processing ? (
                <div className="scan-progress-wrap">
                  <p className="scan-progress-msg">{SCAN_MESSAGES[scanMsgIdx]}</p>
                  <div className="scan-progress-bar-track">
                    <div
                      className="scan-progress-bar-fill"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="status-text">{statusMsg}</p>
              )}

              <button
                className={`action-btn ${!isReady || processing ? 'disabled' : ''}`}
                onClick={startScan}
                disabled={!isReady || processing}
              >
                {processing ? 'Analyzing…' : 'Analyze Now'}
              </button>
            </div>
          )}
        </div>

        {/* ── Results panel ── */}
        {data && !processing && (
          <div className="report-panel animate-pop">
            {data.some((m) => m.toLowerCase().includes('error')) ? (
              <div className="error-state">
                <div className="error-icon">⚠</div>
                <h4 className="report-header" style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.2)' }}>
                  Connection Error
                </h4>
                <p className="error-message">
                  Unable to reach the analysis server. Please check your connection and try again.
                </p>
                <button className="solution-btn" onClick={handleRetry}>
                  Retry Scan
                </button>
              </div>
            ) : (
              <>
                <h4 className="report-header">Skin Analysis Report</h4>
                {data.map((item, idx) => (
                  <div key={idx} className="report-item">
                    <span>◈</span> {item}
                  </div>
                ))}
                {!shouldHideSolution ? (
                  <button className="solution-btn" onClick={openSolution}>
                    View Skin Report →
                  </button>
                ) : (
                  <p style={{
                    color: 'var(--color-success)',
                    fontWeight: 600,
                    marginTop: '16px',
                    textAlign: 'center',
                    fontSize: '13.5px',
                    padding: '12px 16px',
                    background: 'rgba(34,197,94,0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(34,197,94,0.2)',
                  }}>
                    {scanType === 'skin'
                      ? '✓ Your skin looks clear and healthy!'
                      : '✓ Your hair and scalp look healthy!'}
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
