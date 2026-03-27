import React, { useState } from 'react';

const getFilterStyle = (day) => {
  const p = day / 30;
  const brightness = 1 + p * 0.09;
  const contrast = 1 + (1 - p) * 0.07;
  const saturate = 1 - p * 0.08;
  return {
    filter: `brightness(${brightness.toFixed(3)}) contrast(${contrast.toFixed(3)}) saturate(${saturate.toFixed(3)})`,
    transition: 'filter 0.25s ease',
  };
};

const SkinSlider = ({ userImg }) => {
  const [day, setDay] = useState(1);
  const [mode, setMode] = useState('before'); // 'before' | 'after' | 'slider'

  if (!userImg) return null;

  const displayFilter = mode === 'before'
    ? {}
    : mode === 'after'
    ? getFilterStyle(30)
    : getFilterStyle(day);

  const progressPercent = ((day - 1) / 29) * 100;

  return (
    <div className="skin-slider-card">
      <div className="skin-slider-header">
        <div>
          <h3 className="skin-slider-title">Skin Improvement Preview</h3>
          <p className="skin-slider-subtitle">See how your skin may look with consistent use</p>
        </div>
        <div className="slider-mode-tabs">
          {['before', 'slider', 'after'].map((m) => (
            <button
              key={m}
              className={`mode-tab ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'before' ? 'Before' : m === 'slider' ? 'Timeline' : 'After 30d'}
            </button>
          ))}
        </div>
      </div>

      <div className="slider-preview-area">
        <div className="slider-image-frame">
          <img
            src={userImg}
            alt="Skin preview"
            className="slider-face-img"
            style={displayFilter}
          />
          {mode !== 'slider' && (
            <div className={`before-after-badge ${mode}`}>
              {mode === 'before' ? 'Day 1' : 'Day 30'}
            </div>
          )}
        </div>

        {mode === 'slider' && (
          <div className="slider-controls">
            <div className="slider-track-wrapper">
              <input
                type="range"
                min={1}
                max={30}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="skin-range-input"
                style={{ '--progress': `${progressPercent}%` }}
              />
              <div className="slider-labels">
                <span>Day 1</span>
                <span className="slider-day-badge">Day {day}</span>
                <span>Day 30</span>
              </div>
            </div>
            <div className="slider-metrics">
              <div className="metric-pill">
                <span className="metric-label">Brightness</span>
                <span className="metric-val">+{Math.round((day / 30) * 9)}%</span>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Clarity</span>
                <span className="metric-val">+{Math.round((day / 30) * 22)}%</span>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Redness</span>
                <span className="metric-val down">-{Math.round((day / 30) * 35)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="slider-disclaimer">
        Preview is simulated using CSS filters. Individual results vary based on skin type and consistency of use.
      </p>
    </div>
  );
};

export default SkinSlider;
