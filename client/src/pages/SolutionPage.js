import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ProductRow from '../components/ProductRow';
import TransformModal from '../components/TransformModal';
import FaceOverlay from '../components/FaceOverlay';
import SkinSlider from '../components/SkinSlider';
import SkinScoreCard from '../components/SkinScoreCard';
import products from '../data/products';
import '../styles/theme.css';
import '../styles/solution.css';

// ── Tag detection (unchanged from original) ──────────────────
const getActiveTags = (scanResults) => {
  const text = scanResults.join(' ').toLowerCase();
  const tags = [];
  if (text.includes('dandruff')) tags.push('dandruff');
  if (text.includes('hairfall')) tags.push('hairfall');
  if (text.includes('frizzy')) tags.push('hair_frizzy');
  if (text.includes('oily scalp')) tags.push('oily_scalp');
  if (text.includes('acne') || text.includes('pimples')) tags.push('skin_acne', 'skin_pimples');
  if (text.includes('tan')) tags.push('skin_tan');
  if (text.includes('dry') || text.includes('oily') || text.includes('combination'))
    tags.push('skin_dry', 'skin_oily', 'skin_mixed');
  return tags;
};

// ── Routine mapping ───────────────────────────────────────────
const ROUTINE_SLOTS = {
  morning: [
    { slot: 'morning_cleanser',  stepLabel: 'Cleanser' },
    { slot: 'morning_treatment', stepLabel: 'Treatment' },
  ],
  night: [
    { slot: 'night_cleanser',  stepLabel: 'Cleanser' },
    { slot: 'night_treatment', stepLabel: 'Treatment Oil' },
  ],
};

const buildRoutine = (recommendedProducts) => {
  const routine = { morning: [], night: [] };
  ['morning', 'night'].forEach((time) => {
    ROUTINE_SLOTS[time].forEach(({ slot, stepLabel }) => {
      const match = recommendedProducts.find(
        (p) => p.routineSlots?.includes(slot)
      );
      if (match) {
        routine[time].push({ ...match, stepLabel });
      }
    });
  });
  return routine;
};

// ── Routine step card ─────────────────────────────────────────
const RoutineStep = ({ product, stepNum, stepLabel }) => (
  <div className="routine-step">
    <span className="routine-step-num">{stepNum}</span>
    <img src={product.img} alt={product.name} className="routine-step-img" />
    <div className="routine-step-body">
      <span className="routine-step-role">{stepLabel}</span>
      <div className="routine-step-name">{product.name}</div>
      {product.whyItWorks && (
        <p className="routine-step-why">{product.whyItWorks}</p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
const SolutionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [modalProduct, setModalProduct] = useState(null);

  const scanResults = location.state?.problems || [];
  const userImg = localStorage.getItem('userHeadImage');

  const activeTags = getActiveTags(scanResults);
  const recommended = products.filter((p) => p.tags?.some((t) => activeTags.includes(t)));
  const others = products.filter((p) => !p.tags?.some((t) => activeTags.includes(t)));

  const routine = buildRoutine(recommended);
  const hasRoutine = routine.morning.length > 0 || routine.night.length > 0;

  const handleBuyNow = (product) => {
    const size = selectedSizes[product.id] || '100ml';
    const link = product.links[size];
    if (link && link !== '...') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="solution-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'dark' ? '☀ Light' : '⏾ Dark'}
      </button>

      <button className="close-x-btn solution-close" onClick={() => navigate('/')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="full-width-container">
        <h2 className="cherry-header-main">Your Skin Report</h2>

        {/* ── Hero: Score + Face Overlay ── */}
        {(scanResults.length > 0 || userImg) && (
          <div className="report-hero">
            <SkinScoreCard problems={scanResults} />
            {userImg
              ? <FaceOverlay userImg={userImg} problems={scanResults} />
              : <div className="skin-score-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No scan image available</div>
            }
          </div>
        )}

        {/* ── Improvement Slider ── */}
        {userImg && <SkinSlider userImg={userImg} />}

        {/* ── Personalized Routine ── */}
        {hasRoutine && (
          <div className="routine-section">
            <h3 className="routine-section-title">Your Personalized Routine</h3>
            <p className="routine-section-sub">
              Products selected based on your scan results, organized by time of day.
            </p>
            <div className="routine-grid">
              {/* Morning */}
              <div className="routine-time-card">
                <div className="routine-time-header">
                  <div className="routine-time-icon morning">☀</div>
                  <span className="routine-time-label">Morning Routine</span>
                </div>
                <div className="routine-steps">
                  {routine.morning.length > 0 ? (
                    routine.morning.map((p, i) => (
                      <RoutineStep key={p.id} product={p} stepNum={i + 1} stepLabel={p.stepLabel} />
                    ))
                  ) : (
                    <p className="routine-empty">No morning products detected for your skin type.</p>
                  )}
                </div>
              </div>

              {/* Night */}
              <div className="routine-time-card">
                <div className="routine-time-header">
                  <div className="routine-time-icon night">☽</div>
                  <span className="routine-time-label">Night Routine</span>
                </div>
                <div className="routine-steps">
                  {routine.night.length > 0 ? (
                    routine.night.map((p, i) => (
                      <RoutineStep key={p.id} product={p} stepNum={i + 1} stepLabel={p.stepLabel} />
                    ))
                  ) : (
                    <p className="routine-empty">No night products detected for your skin type.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Recommended Products (full detail rows) ── */}
        {recommended.length > 0 && (
          <>
            <div className="more-products-divider">
              <span>All Recommended Products</span>
            </div>
            <div className="product-stack-full">
              {recommended.map((p) => (
                <ProductRow
                  key={p.id}
                  p={p}
                  isRecommended={true}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  handleBuyNow={handleBuyNow}
                  onAfter45={setModalProduct}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Other Products ── */}
        {others.length > 0 && (
          <>
            <div className="more-products-divider">
              <span>More Products</span>
            </div>
            <div className="product-stack-full secondary-stack">
              {others.map((p) => (
                <ProductRow
                  key={p.id}
                  p={p}
                  isRecommended={false}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  handleBuyNow={handleBuyNow}
                  onAfter45={setModalProduct}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {modalProduct && (
        <TransformModal
          product={modalProduct}
          userImg={userImg}
          onClose={() => setModalProduct(null)}
          onBuy={handleBuyNow}
        />
      )}
    </div>
  );
};

export default SolutionPage;
