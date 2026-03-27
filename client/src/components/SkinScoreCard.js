import React, { useEffect, useState } from 'react';

const computeScore = (problems) => {
  if (!problems?.length) return { overall: 88, acne: 'Low', hydration: 'Good', texture: 'Smooth' };
  const text = problems.join(' ').toLowerCase();
  let score = 100;
  if (text.includes('acne') || text.includes('pimple')) score -= 22;
  if (text.includes('oily')) score -= 10;
  if (text.includes('dry')) score -= 12;
  if (text.includes('dark circle')) score -= 8;
  if (text.includes('tan') || text.includes('pigment')) score -= 10;
  if (text.includes('texture') || text.includes('rough')) score -= 8;
  score = Math.max(score, 22);
  return {
    overall: score,
    acne: (text.includes('acne') || text.includes('pimple'))
      ? (score < 50 ? 'High' : 'Moderate') : 'Low',
    hydration: text.includes('dry') ? 'Low' : text.includes('oily') ? 'Excess' : 'Balanced',
    texture: (text.includes('texture') || text.includes('rough')) ? 'Uneven' : 'Smooth',
  };
};

const severityColor = (val) => {
  const v = val?.toLowerCase();
  if (v === 'low' || v === 'smooth' || v === 'balanced' || v === 'good') return '#22C55E';
  if (v === 'moderate' || v === 'excess') return '#F59E0B';
  if (v === 'high' || v === 'uneven' || v === 'low') return '#EF4444';
  return '#6B7280';
};

const scoreColor = (s) => {
  if (s >= 75) return '#22C55E';
  if (s >= 50) return '#F59E0B';
  return '#EF4444';
};

const ScoreRing = ({ score, animated }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = animated ? circ - (score / 100) * circ : circ;
  const color = scoreColor(score);

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="score-ring-svg">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#F0F0F2" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="700" fontFamily="DM Sans, sans-serif">
        {score}
      </text>
      <text x="70" y="84" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontFamily="DM Sans, sans-serif">
        /100
      </text>
    </svg>
  );
};

const SkinScoreCard = ({ problems }) => {
  const [animated, setAnimated] = useState(false);
  const scores = computeScore(problems);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const metrics = [
    { label: 'Acne Level', value: scores.acne, desc: scores.acne === 'Low' ? 'Minimal breakout activity' : scores.acne === 'Moderate' ? 'Some active breakouts detected' : 'Significant breakout activity found' },
    { label: 'Hydration', value: scores.hydration, desc: scores.hydration === 'Balanced' ? 'Skin moisture levels are healthy' : scores.hydration === 'Low' ? 'Skin showing signs of dryness' : 'Sebum overproduction detected' },
    { label: 'Texture', value: scores.texture, desc: scores.texture === 'Smooth' ? 'Skin surface appears uniform' : 'Surface irregularities detected' },
  ];

  const label = scores.overall >= 75 ? 'Healthy Skin' : scores.overall >= 50 ? 'Needs Attention' : 'Treatment Needed';

  return (
    <div className="skin-score-card">
      <h3 className="score-card-title">Skin Health Score</h3>
      <div className="score-ring-section">
        <ScoreRing score={scores.overall} animated={animated} />
        <div className="score-label-block">
          <span className="score-status-label" style={{ color: scoreColor(scores.overall) }}>{label}</span>
          <span className="score-status-sub">Based on facial analysis</span>
        </div>
      </div>
      <div className="score-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="score-metric-row">
            <div className="metric-row-top">
              <span className="metric-row-label">{m.label}</span>
              <span className="metric-row-value" style={{ color: severityColor(m.value) }}>{m.value}</span>
            </div>
            <p className="metric-row-desc">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinScoreCard;
