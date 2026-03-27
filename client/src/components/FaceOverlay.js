import React, { useState } from 'react';

const PROBLEM_ZONES = {
  acne: {
    zones: [
      { top: '14%', left: '22%', width: '56%', height: '26%', shape: 'ellipse' },
      { top: '56%', left: '16%', width: '24%', height: '20%', shape: 'ellipse' },
      { top: '56%', left: '60%', width: '24%', height: '20%', shape: 'ellipse' },
    ],
    color: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.55)',
    glow: '0 0 18px rgba(239, 68, 68, 0.35)',
    label: 'Active Acne',
    explanation: 'Excess sebum & P. acnes bacteria causing breakouts in T-zone and cheeks.',
  },
  dark_circles: {
    zones: [
      { top: '43%', left: '20%', width: '24%', height: '11%', shape: 'ellipse' },
      { top: '43%', left: '56%', width: '24%', height: '11%', shape: 'ellipse' },
    ],
    color: 'rgba(74, 144, 226, 0.2)',
    border: 'rgba(74, 144, 226, 0.55)',
    glow: '0 0 14px rgba(74, 144, 226, 0.35)',
    label: 'Dark Circles',
    explanation: 'Reduced periorbital circulation and thin skin revealing underlying pigmentation.',
  },
  oily: {
    zones: [
      { top: '20%', left: '33%', width: '34%', height: '22%', shape: 'ellipse' },
      { top: '46%', left: '38%', width: '24%', height: '22%', shape: 'ellipse' },
    ],
    color: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(245, 158, 11, 0.5)',
    glow: '0 0 14px rgba(245, 158, 11, 0.3)',
    label: 'Oily Skin',
    explanation: 'Overactive sebaceous glands producing excess sebum across T-zone.',
  },
  tan: {
    zones: [
      { top: '8%', left: '12%', width: '76%', height: '82%', shape: 'ellipse' },
    ],
    color: 'rgba(180, 120, 40, 0.12)',
    border: 'rgba(180, 120, 40, 0.4)',
    glow: '0 0 20px rgba(180, 120, 40, 0.25)',
    label: 'Sun Tan',
    explanation: 'UV-induced melanin clustering causing uneven skin tone across face.',
  },
  texture: {
    zones: [
      { top: '18%', left: '20%', width: '60%', height: '60%', shape: 'ellipse' },
    ],
    color: 'rgba(139, 92, 246, 0.14)',
    border: 'rgba(139, 92, 246, 0.45)',
    glow: '0 0 14px rgba(139, 92, 246, 0.28)',
    label: 'Skin Texture',
    explanation: 'Irregular skin surface with enlarged pores and uneven cellular turnover.',
  },
};

const detectProblems = (problems) => {
  if (!problems?.length) return [];
  const text = problems.join(' ').toLowerCase();
  const found = [];
  if (text.includes('acne') || text.includes('pimple')) found.push('acne');
  if (text.includes('dark circle') || text.includes('dark-circle')) found.push('dark_circles');
  if (text.includes('oily')) found.push('oily');
  if (text.includes('tan') || text.includes('pigment')) found.push('tan');
  if (text.includes('texture') || text.includes('rough') || text.includes('uneven')) found.push('texture');
  return found;
};

const FaceOverlay = ({ userImg, problems }) => {
  const [activeZone, setActiveZone] = useState(null);
  const detected = detectProblems(problems);

  if (!userImg) return null;

  return (
    <div className="face-overlay-wrapper">
      <img src={userImg} alt="Your skin scan" className="face-overlay-img" />

      {detected.map((key) => {
        const def = PROBLEM_ZONES[key];
        return def.zones.map((zone, i) => (
          <div
            key={`${key}-${i}`}
            className="overlay-zone"
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.width,
              height: zone.height,
              background: def.color,
              border: `1.5px solid ${def.border}`,
              boxShadow: activeZone === key ? def.glow : 'none',
              borderRadius: zone.shape === 'ellipse' ? '50%' : '12px',
            }}
            onMouseEnter={() => setActiveZone(key)}
            onMouseLeave={() => setActiveZone(null)}
            onTouchStart={() => setActiveZone(activeZone === key ? null : key)}
          >
            {activeZone === key && (
              <div className="overlay-tooltip">
                <span className="tooltip-label">{def.label}</span>
                <span className="tooltip-desc">{def.explanation}</span>
              </div>
            )}
          </div>
        ));
      })}

      {detected.length === 0 && (
        <div className="overlay-clear-badge">
          <span>✓</span> Skin looks clear
        </div>
      )}
    </div>
  );
};

export default FaceOverlay;
