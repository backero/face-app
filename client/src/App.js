import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import SolutionPage from './SolutionPage';
import './App.css';

// ─── Analysis step messages shown during the 9-second wait ───
const ANALYSIS_STEPS = [
  'Initializing biometric scan...',
  'Detecting facial landmarks...',
  'Analyzing skin parameters...',
  'Processing hair & scalp data...',
  'Generating personalized report...',
];

// ─── Scan mode configs ────────────────────────────────────────
const SCAN_MODES = [
  { key: 'face', label: 'Face Scan',       icon: '👤', hint: 'Center your face in the oval for best results' },
  { key: 'hair', label: 'Hair & Scalp',    icon: '💇', hint: 'Show your scalp/hair clearly in good lighting' },
  { key: 'both', label: 'Full Analysis',   icon: '🔬', hint: 'Position face + hair in frame together' },
];

// ─── Problems that mean "no issues found" ────────────────────
const HEALTHY_PROBLEMS = new Set(['Healthy Skin', 'Healthy Hair & Scalp', 'All Clear']);


// ═══════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════
const Landing = ({ theme, toggleTheme, scanType, setScanType, onStart }) => (
  <div className="app-viewport" data-theme={theme}>
    <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>

    <div className="landing-wrapper">
      {/* Hero */}
      <div className="hero-badge">AI-Powered Analysis</div>
      <h1 className="hero-title">
        TREYFA <span className="gradient-text">PRO</span>
      </h1>
      <p className="hero-subtitle">
        Advanced biometric skin &amp; hair analysis.<br />
        Get your personalised treatment plan in 60 seconds.
      </p>

      {/* Scan type selector */}
      <div className="scan-type-group">
        {SCAN_MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`scan-type-btn ${scanType === key ? 'active' : ''}`}
            onClick={() => setScanType(key)}
          >
            <span className="scan-type-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button className="cta-btn" onClick={onStart}>
        Start Free Analysis
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* Trust bar */}
      <div className="trust-bar">
        <span>✅ 50,000+ Analyses</span>
        <span>🌿 100% Natural</span>
        <span>🔒 Privacy First</span>
      </div>

      {/* Problem pills */}
      <div className="problem-pills">
        {['Oily Skin','Dark Circles','Acne','Sun Tan','Dark Spots',
          'Dandruff','Hair Fall','Frizzy Hair','Dry Hair','+ more'].map(p => (
          <span key={p} className="problem-pill">{p}</span>
        ))}
      </div>
    </div>
  </div>
);


// ═══════════════════════════════════════════════════════════════
// SCANNER PAGE
// ═══════════════════════════════════════════════════════════════
const Scanner = ({
  theme, toggleTheme,
  scanType,
  isReady, statusMsg,
  processing, analysisStep,
  capturedImg, webcamRef,
  onScan, onBack,
}) => {
  const mode = SCAN_MODES.find(m => m.key === scanType) || SCAN_MODES[0];

  return (
    <div className="app-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="scanner-card">
        {/* Header */}
        <div className="scanner-header">
          <span className="scanner-mode-badge">{mode.icon} {mode.label}</span>
          <h2 className="scanner-title">Position &amp; Scan</h2>
          <p className="scanner-hint">{mode.hint}</p>
        </div>

        {/* Camera */}
        <div className={`camera-frame ${processing ? 'frame-scanning' : ''} ${isReady ? 'frame-ready' : ''}`}>
          {processing
            ? <img src={capturedImg} className="camera-feed" alt="Captured" />
            : <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="camera-feed"
                videoConstraints={{ facingMode: 'user' }}
              />
          }

          {/* Oval face guide — only when not processing */}
          {!processing && (
            <div className="face-oval-wrap">
              <svg viewBox="0 0 100 120" className="face-oval-svg" preserveAspectRatio="none">
                <ellipse
                  cx="50" cy="60" rx="36" ry="48"
                  fill="none"
                  stroke={isReady ? '#10b981' : 'rgba(255,255,255,0.35)'}
                  strokeWidth="1.2"
                  strokeDasharray={isReady ? '0' : '3 2'}
                />
              </svg>
            </div>
          )}

          {/* Scanning laser */}
          {processing && <div className="scan-laser" />}

          {/* Corner brackets */}
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
        </div>

        {/* Status / Progress */}
        {processing ? (
          <div className="analysis-progress">
            <div className="spinner" />
            <p className="progress-text">{ANALYSIS_STEPS[analysisStep]}</p>
            <div className="progress-dots">
              {ANALYSIS_STEPS.map((_, i) => (
                <span key={i} className={`dot ${i <= analysisStep ? 'dot-active' : ''}`} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className={`status-label ${isReady ? 'status-ok' : 'status-wait'}`}>
              {isReady ? '✓ Ready to scan' : statusMsg}
            </p>
            <button
              className={`scan-btn ${(!isReady || processing) ? 'scan-btn-off' : ''}`}
              onClick={onScan}
              disabled={!isReady || processing}
            >
              ⚡ Analyze Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// RESULTS PAGE
// ═══════════════════════════════════════════════════════════════
const Results = ({
  theme, toggleTheme,
  data, scanType, capturedImg,
  onScanAgain, onViewSolutions,
}) => {
  const isHealthy = data.every(d => d.severity === 'none');
  const problemCount = data.filter(d => d.severity !== 'none').length;

  return (
    <div className="app-viewport results-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="results-wrapper">
        {/* Summary strip */}
        <div className="results-summary">
          {capturedImg && (
            <div className="results-avatar">
              <img src={capturedImg} alt="Your scan" />
            </div>
          )}
          <div>
            <div className={`results-badge ${isHealthy ? 'badge-healthy' : 'badge-issues'}`}>
              {isHealthy ? '✓ All Clear' : `${problemCount} Issue${problemCount > 1 ? 's' : ''} Detected`}
            </div>
            <h2 className="results-title">Your Analysis Report</h2>
            <p className="results-sub">
              {scanType === 'face' ? 'Skin Analysis'
                : scanType === 'hair' ? 'Hair & Scalp Analysis'
                : 'Complete Skin & Hair Analysis'}
            </p>
          </div>
        </div>

        {/* Problem cards */}
        <div className="results-grid">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={`result-card sev-${item.severity}`}
              style={{ animationDelay: `${idx * 90}ms` }}
            >
              <div className="result-card-top">
                <span className="result-icon">{item.icon || '⚡'}</span>
                <div className="result-card-meta">
                  <h4 className="result-problem">{item.problem}</h4>
                  <span className={`sev-badge sev-badge-${item.severity}`}>
                    {item.severity === 'none' ? 'Healthy' : item.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="result-desc">{item.description}</p>
              {item.severity !== 'none' && (
                <div className="sev-bar">
                  <div className={`sev-fill fill-${item.severity}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="secondary-action-btn" onClick={onScanAgain}>
            ↩ Scan Again
          </button>
          {!isHealthy && (
            <button className="primary-action-btn" onClick={onViewSolutions}>
              View My Solutions
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// ROOT SCANNER CONTROLLER
// ═══════════════════════════════════════════════════════════════
const ScannerController = () => {
  const navigate = useNavigate();

  const [phase, setPhase]           = useState('landing');   // landing | scanning | results
  const [scanType, setScanType]     = useState('face');
  const [isReady, setIsReady]       = useState(false);
  const [statusMsg, setStatusMsg]   = useState('Position your face inside the oval');
  const [processing, setProcessing] = useState(false);
  const [analysisStep, setStep]     = useState(0);
  const [capturedImg, setCaptured]  = useState(null);
  const [data, setData]             = useState(null);
  const [theme, setTheme]           = useState(
    () => localStorage.getItem('treyfa-theme') || 'dark'
  );

  const webcamRef       = useRef(null);
  const faceDetRef      = useRef(null);
  const isBusy          = useRef(false);
  const stepTimerRef    = useRef(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('treyfa-theme', next);
  };

  // ── Load MediaPipe face detection when scanner opens ──────
  useEffect(() => {
    if (phase !== 'scanning') return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const fd = new window.FaceDetection({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${f}`,
      });
      fd.setOptions({ model: 'short', minDetectionConfidence: 0.6 });
      fd.onResults(res => {
        if (res.detections?.length > 0) {
          setIsReady(true);
          setStatusMsg('Perfect! Ready to analyze');
        } else {
          setIsReady(false);
          const m = SCAN_MODES.find(m => m.key === scanType);
          setStatusMsg(m?.hint || 'Position in frame');
        }
        isBusy.current = false;
      });
      faceDetRef.current = fd;
    };

    return () => { faceDetRef.current = null; };
  }, [phase, scanType]);

  // ── Poll webcam for face presence ─────────────────────────
  useEffect(() => {
    if (phase !== 'scanning' || processing) return;
    const iv = setInterval(async () => {
      const v = webcamRef.current?.video;
      if (v?.readyState === 4 && !isBusy.current && faceDetRef.current) {
        isBusy.current = true;
        await faceDetRef.current.send({ image: v });
      }
    }, 500);
    return () => clearInterval(iv);
  }, [phase, processing]);

  // ── Step progress during analysis animation ───────────────
  useEffect(() => {
    if (!processing) { clearInterval(stepTimerRef.current); return; }
    setStep(0);
    let s = 0;
    stepTimerRef.current = setInterval(() => {
      s += 1;
      if (s < ANALYSIS_STEPS.length) setStep(s);
      else clearInterval(stepTimerRef.current);
    }, 1700);
    return () => clearInterval(stepTimerRef.current);
  }, [processing]);

  const handleStart = () => {
    setPhase('scanning');
    setIsReady(false);
    setData(null);
  };

  const handleBack = () => {
    setPhase('landing');
    setIsReady(false);
    setProcessing(false);
    faceDetRef.current = null;
  };

  const handleScan = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    setCaptured(screenshot);
    localStorage.setItem('userHeadImage', screenshot);
    setProcessing(true);
    setData(null);

    // 9-second delay gives the progress animation time to play
    setTimeout(async () => {
      try {
        const blob = await (await fetch(screenshot)).blob();
        const form = new FormData();
        form.append('file', blob, 'scan.jpg');
        form.append('scan_type', scanType);
        const res = await axios.post('http://127.0.0.1:8000/analyze', form);
        setData(res.data.problems);
        setPhase('results');
      } catch {
        setData([{
          problem: 'Connection Error',
          severity: 'high',
          description: 'Could not reach the analysis server. Make sure the backend is running.',
          icon: '⚠️',
          category: 'system',
        }]);
        setPhase('results');
      } finally {
        setProcessing(false);
      }
    }, 9000);
  };

  const handleScanAgain = () => {
    setPhase('scanning');
    setData(null);
    setIsReady(false);
  };

  const handleViewSolutions = () => {
    navigate('/solutions', { state: { problems: data, scanType } });
  };

  if (phase === 'landing') {
    return (
      <Landing
        theme={theme} toggleTheme={toggleTheme}
        scanType={scanType} setScanType={setScanType}
        onStart={handleStart}
      />
    );
  }

  if (phase === 'scanning') {
    return (
      <Scanner
        theme={theme} toggleTheme={toggleTheme}
        scanType={scanType}
        isReady={isReady} statusMsg={statusMsg}
        processing={processing} analysisStep={analysisStep}
        capturedImg={capturedImg} webcamRef={webcamRef}
        onScan={handleScan} onBack={handleBack}
      />
    );
  }

  return (
    <Results
      theme={theme} toggleTheme={toggleTheme}
      data={data || []} scanType={scanType} capturedImg={capturedImg}
      onScanAgain={handleScanAgain}
      onViewSolutions={handleViewSolutions}
    />
  );
};


// ═══════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════
const App = () => (
  <Router>
    <Routes>
      <Route path="/"          element={<ScannerController />} />
      <Route path="/solutions" element={<SolutionPage />} />
    </Routes>
  </Router>
);

export default App;
