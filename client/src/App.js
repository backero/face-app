// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import axios from 'axios';
// import Webcam from "react-webcam";
// import SolutionPage from './SolutionPage';
// import './App.css';

// const Scanner = () => {
//   const navigate = useNavigate();
//   const [active, setActive] = useState(false);
//   const [data, setData] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [isFaceReady, setIsFaceReady] = useState(false);
//   const [capturedImg, setCapturedImg] = useState(null);
//   const [statusMsg, setStatusMsg] = useState("Aligning Sensors...");
//   const [theme, setTheme] = useState(localStorage.getItem('treyfa-theme') || 'dark');

//   const webcamRef = useRef(null);
//   const faceDetectionRef = useRef(null);
//   const isBusy = useRef(false);

//   const shouldHideSolution = data && data.some(msg => {
//     const m = msg.toLowerCase();
//     return m.includes("error") || m.includes("try again") || m.includes("clear and healthy");
//   });

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     localStorage.setItem('treyfa-theme', newTheme);
//   };

//   const handleCancel = () => {
//     setActive(false);
//     setData(null);
//     setProcessing(false);
//     setIsFaceReady(false);
//   };

//   useEffect(() => {
//     if (active) {
//       const script = document.createElement("script");
//       script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js";
//       script.async = true;
//       document.body.appendChild(script);
//       script.onload = () => {
//         const faceDetection = new window.FaceDetection({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
//         });
//         faceDetection.setOptions({ model: 'short', minDetectionConfidence: 0.8 });
//         faceDetection.onResults((res) => {
//           if (res.detections?.length > 0) {
//             const box = res.detections[0].boundingBox;
//             const valid = box.xCenter > 0.4 && box.xCenter < 0.6 && box.width > 0.35;
//             setIsFaceReady(valid);
//             setStatusMsg(valid ? "" : "Center your face for true analysis");
//           } else {
//             setIsFaceReady(false);
//             setStatusMsg("Face not detected");
//           }
//           isBusy.current = false;
//         });
//         faceDetectionRef.current = faceDetection;
//       };
//     }
//   }, [active]);

//   useEffect(() => {
//     let interval;
//     if (active && !processing) {
//       interval = setInterval(async () => {
//         if (webcamRef.current?.video?.readyState === 4 && !isBusy.current && faceDetectionRef.current) {
//           isBusy.current = true;
//           await faceDetectionRef.current.send({ image: webcamRef.current.video });
//         }
//       }, 500);
//     }
//     return () => clearInterval(interval);
//   }, [active, processing]);

//   const startScan = async () => {
//     const screenshot = webcamRef.current.getScreenshot();
//     setCapturedImg(screenshot);
    
//     // Save image for the 45-day transformation preview in SolutionPage
//     localStorage.setItem('userHeadImage', screenshot);
    
//     setProcessing(true);
//     setData(null);
    
//     setTimeout(async () => {
//       try {
//         const blob = await (await fetch(screenshot)).blob();
//         const formData = new FormData();
//         formData.append('file', blob, "face.jpg");
//         const res = await axios.post('http://127.0.0.1:8000/analyze', formData);
//         setData(res.data.problems);
//       } catch (err) {
//         setData(["Error: Backend connection failed."]);
//       } finally {
//         setProcessing(false);
//       }
//     }, 10000);
//   };

//   const openSolution = () => {
//     if (data && !shouldHideSolution) {
//       navigate("/solutions", { state: { problems: data } });
//     }
//   };

//   return (
//     <div className="app-viewport" data-theme={theme}>
//       <button className="theme-toggle-btn" onClick={toggleTheme}>
//         {theme === 'dark' ? '☀️' : '🌙'}
//       </button>

//       <div className="dashboard-wrapper">
//         <div className="main-card">
//           {active && (
//             <button className="close-x-btn" onClick={handleCancel}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           )}

//           <h1 className="header">TREYFA <span className="highlight">PRO</span></h1>
          
//           {!active ? (
//             <button className="action-btn" onClick={() => setActive(true)}>Access Scanner</button>
//           ) : (
//             <div className={processing ? "scanning" : ""}>
//               <div className={`camera-stage ${isFaceReady ? 'ready' : ''}`}>
//                 <div className="laser"></div>
//                 {processing ? <img src={capturedImg} className="webcam-view" alt="Scan" /> : 
//                 <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-view" />}
//               </div>
//               <p className="status-text">{statusMsg}</p>
//               <button 
//                 className={`action-btn ${(!isFaceReady || processing) ? 'disabled' : ''}`}
//                 onClick={startScan}
//                 disabled={!isFaceReady || processing}
//               >
//                 {processing ? "Analyzing..." : "Analyze Now"}
//               </button>
//             </div>
//           )}
//         </div>

//         {data && !processing && (
//           <div className="report-panel glassmorphic-panel">
//             <h4 className="report-header">Clinical Diagnosis</h4>
//             {data.map((item, idx) => (
//               <div key={idx} className="report-item"><span>✦</span> {item}</div>
//             ))}
//             {!shouldHideSolution && (
//               <button className="solution-btn animate-pop" onClick={openSolution}>
//                 SOLUTION
//               </button>
//             )}
//             {shouldHideSolution && !data.some(m => m.toLowerCase().includes("error")) && (
//               <p className="success-msg-clear">Keep up the great routine! No treatment needed.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/" element={<Scanner />} />
//       <Route path="/solutions" element={<SolutionPage />} />
//     </Routes>
//   </Router>
// );

// export default App;



import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Webcam from "react-webcam";
import SolutionPage from './SolutionPage';
import './App.css';

const Scanner = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [scanType, setScanType] = useState("skin"); // Default to skin
  const [statusMsg, setStatusMsg] = useState("Aligning Sensors...");
  const [theme, setTheme] = useState(localStorage.getItem('treyfa-theme') || 'dark');

  const webcamRef = useRef(null);
  const faceDetectionRef = useRef(null);
  const isBusy = useRef(false);

  // Logic to determine if we should hide the solution button
  const shouldHideSolution = data && data.some(msg => {
    const m = msg.toLowerCase();
    return m.includes("error") || m.includes("try again") || m.includes("clear and healthy") || m.includes("perfectly clear");
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('treyfa-theme', newTheme);
  };

  const handleCancel = () => {
    setActive(false);
    setData(null);
    setProcessing(false);
    setIsReady(false);
  };

  useEffect(() => {
    if (active) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        const faceDetection = new window.FaceDetection({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });
        faceDetection.setOptions({ model: 'short', minDetectionConfidence: 0.6 }); 
        faceDetection.onResults((res) => {
          if (res.detections?.length > 0) {
            setIsReady(true);
            setStatusMsg("");
            // Determine if scan is face or hair based on detection score/box size
            setScanType(res.detections[0].categories?.[0]?.score > 0.8 ? "skin" : "hair");
          } else {
            setIsReady(false);
            setStatusMsg("Position Face or Hair in frame");
          }
          isBusy.current = false;
        });
        faceDetectionRef.current = faceDetection;
      };
    }
  }, [active]);

  useEffect(() => {
    let interval;
    if (active && !processing) {
      interval = setInterval(async () => {
        if (webcamRef.current?.video?.readyState === 4 && !isBusy.current && faceDetectionRef.current) {
          isBusy.current = true;
          await faceDetectionRef.current.send({ image: webcamRef.current.video });
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [active, processing]);

  const startScan = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    setCapturedImg(screenshot);
    
    // Save image for 45-day transformation preview in SolutionPage
    localStorage.setItem('userHeadImage', screenshot);
    
    setProcessing(true);
    setData(null);
    
    setTimeout(async () => {
      try {
        const blob = await (await fetch(screenshot)).blob();
        const formData = new FormData();
        formData.append('file', blob, "analysis.jpg");
        const res = await axios.post('http://127.0.0.1:8000/analyze', formData);
        setData(res.data.problems);
      } catch (err) {
        setData(["Error: Backend connection failed."]);
      } finally {
        setProcessing(false);
      }
    }, 10000);
  };

  const openSolution = () => {
    if (data && !shouldHideSolution) {
      navigate("/solutions", { state: { problems: data } });
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}

          <h1 className="header">TREYFA <span className="highlight">PRO</span></h1>
          
          {!active ? (
            <button className="action-btn" onClick={() => setActive(true)}>Access Scanner</button>
          ) : (
            <div className={processing ? "scanning" : ""}>
              <div className={`camera-stage ${isReady ? 'ready' : ''}`}>
                <div className="laser"></div>
                {processing ? <img src={capturedImg} className="webcam-view" alt="Scan" /> : 
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-view" />}
              </div>
              <p className="status-text">{statusMsg}</p>
              <button 
                className={`action-btn ${(!isReady || processing) ? 'disabled' : ''}`}
                onClick={startScan}
                disabled={!isReady || processing}
              >
                {processing ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          )}
        </div>

        {data && !processing && (
          <div className="report-panel glassmorphic-panel">
            <h4 className="report-header">Clinical Diagnosis</h4>
            {data.map((item, idx) => (
              <div key={idx} className="report-item"><span>✦</span> {item}</div>
            ))}
            {!shouldHideSolution && (
              <button className="solution-btn animate-pop" onClick={openSolution}>
                SOLUTION
              </button>
            )}
            
            {/* Dynamic Success Message based on Scan Type */}
            {shouldHideSolution && !data.some(m => m.toLowerCase().includes("error")) && (
              <p style={{color: 'var(--accent)', fontWeight: 'bold', marginTop: '15px', textAlign: 'center'}}>
                {scanType === "skin" 
                  ? "Your skin looks perfectly clear and healthy! No treatment needed." 
                  : "Your hair and scalp look perfectly healthy! No treatment needed."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Scanner />} />
      <Route path="/solutions" element={<SolutionPage />} />
    </Routes>
  </Router>
);

export default App;