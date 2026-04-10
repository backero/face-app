import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

import basil_oil            from './basil_oil.png';
import choco_coffee_facewash from './choco_coffee_facewash.png';
import curry_leaves_oil     from './curry_leaves_oil.png';
import henna_oil            from './henna_oil.png';
import hibiscus_conditioner from './hibiscus_conditioner.png';
import hibiscus_oil         from './hibiscus_oil.png';
import hibiscus_shampoo     from './hibiscus_shampoo.png';
import neem_facewash        from './neem_facewash.png';
import neem_oil             from './neem_oil.png';
import neem_shampoo         from './neem_shampoo.png';
import turmeric_facewash    from './turmeric_facewash.png';

// ─── Maps detected problem names → product tags ──────────────
const PROBLEM_TAGS = {
  'Oily T-Zone':         ['skin_oily'],
  'Dark Circles':        ['skin_dark_circles'],
  'Acne & Pimples':      ['skin_acne'],
  'Sun Tan':             ['skin_tan'],
  'Dry Skin':            ['skin_dry'],
  'Dull & Tired Skin':   ['skin_dull'],
  'Uneven Skin Tone':    ['skin_tan', 'skin_dull'],
  'Skin Redness':        ['skin_acne', 'skin_dry'],
  'Dark Spots':          ['skin_tan', 'skin_dark_circles'],
  'Oily Scalp':          ['oily_scalp'],
  'Dandruff':            ['dandruff'],
  'Dry & Brittle Hair':  ['hair_dry'],
  'Frizzy Hair':         ['hair_frizzy'],
  'Hair Thinning':       ['hairfall'],
  'Scalp Irritation':    ['oily_scalp', 'dandruff'],
};

const PRODUCTS = [
  {
    id: 1,
    img: turmeric_facewash,
    name: 'Turmeric Facewash',
    tags: ['skin_tan', 'skin_dull', 'skin_dark_circles'],
    category: 'face',
    tagline: 'Brightens & De-Tans',
    benefits: 'Curcumin inhibits melanin overproduction, visibly reducing tan lines and dark spots within 4 weeks of regular use.',
    howToUse: 'Wet face, apply a small amount and massage in circular motions for 60 seconds. Focus on tan-prone areas. Rinse with cool water. Use morning and evening.',
    ingredients: 'Turmeric Root Extract, Vitamin C, Kojic Acid, Aloe Vera Gel',
    rating: 4.7,
    reviews: 445,
    links: { '100ml': 'https://treyfa.in/product/turmeric-face-wash-100ml/', '150ml': 'https://treyfa.in/product/turmeric-foaming-face-wash-150ml/' },
  },
  {
    id: 2,
    img: neem_facewash,
    name: 'Neem Facewash',
    tags: ['skin_acne', 'skin_dark_circles', 'skin_oily'],
    category: 'face',
    tagline: 'Anti-Acne & Purifying',
    benefits: 'Neem\'s nimbin and nimbidine compounds are clinically proven antibacterials. Clears acne-causing bacteria and unblocks clogged pores without stripping moisture.',
    howToUse: 'Apply to damp face, lather gently for 30 seconds. Use twice daily (morning and night). Suitable for oily and acne-prone skin types.',
    ingredients: 'Neem Leaf Extract, Tea Tree Oil, Turmeric, Salicylic Acid',
    rating: 4.6,
    reviews: 489,
    links: { '100ml': 'https://treyfa.in/product/neem-face-wash-100ml/', '150ml': 'https://treyfa.in/product/herbal-neem-foaming-face-wash-150ml/' },
  },
  {
    id: 3,
    img: choco_coffee_facewash,
    name: 'Choco Coffee Facewash',
    tags: ['skin_dry', 'skin_oily', 'skin_dull'],
    category: 'face',
    tagline: 'Hydrates & Balances',
    benefits: 'Caffeine in coffee stimulates circulation for a natural glow. Cocoa butter locks in moisture while balancing sebum production for combination skin types.',
    howToUse: 'Apply on damp face and massage gently in circular motions for 60 seconds. Suitable for dry, oily, and combination skin. Use twice daily.',
    ingredients: 'Cocoa Butter Extract, Coffee Bean Oil, Aloe Vera, Glycerin',
    rating: 4.7,
    reviews: 412,
    links: { '100ml': 'https://treyfa.in/product/choco-coffee-face-wash-hydration-100ml/', '150ml': 'https://treyfa.in/product/choco-coffee-face-wash-150ml/' },
  },
  {
    id: 4,
    img: neem_shampoo,
    name: 'Neem Anti-Dandruff Shampoo',
    tags: ['dandruff', 'oily_scalp'],
    category: 'hair',
    tagline: 'Clears Flakes & Balances Scalp',
    benefits: 'Powerful anti-fungal formula targets Malassezia at the root cause. Peppermint soothes irritated scalp while neem extract clears stubborn flakes in 2 weeks.',
    howToUse: 'Wet hair thoroughly. Apply to scalp and massage vigorously for 2-3 minutes. Leave on for 1 minute for best results. Rinse completely. Use 3x per week.',
    ingredients: 'Neem Extract, Salicylic Acid, Peppermint Oil, Zinc Pyrithione',
    rating: 4.5,
    reviews: 312,
    links: { '100ml': 'https://treyfa.in/product/neem-dandruff-shampoo-100ml/', '200ml': 'https://treyfa.in/product/powerful-neem-anti-dandruff-shampoo-conditioner/' },
  },
  {
    id: 5,
    img: neem_oil,
    name: 'Neem Oil',
    tags: ['dandruff', 'oily_scalp'],
    category: 'hair',
    tagline: 'Deep Anti-Dandruff Treatment',
    benefits: 'Cold-pressed neem oil\'s azadirachtin directly combats dandruff-causing fungi. Controls excess scalp oil without drying, restoring scalp microbiome balance.',
    howToUse: 'Mix with equal parts coconut oil. Apply to scalp 30 minutes before shampooing. Massage gently. Can be used as overnight treatment for severe dandruff.',
    ingredients: 'Cold-Pressed Neem Oil, Coconut Oil, Vitamin E',
    rating: 4.4,
    reviews: 203,
    links: { '100ml': 'https://treyfa.in/product/neem-face-wash-100ml/', '200ml': 'https://treyfa.in/product/coconut-neem-anti-dandruff-oil-200ml/' },
  },
  {
    id: 6,
    img: hibiscus_oil,
    name: 'Hibiscus Oil',
    tags: ['hairfall', 'hair_dry'],
    category: 'hair',
    tagline: 'Growth Booster & Nourisher',
    benefits: 'Rich in amino acids and vitamin C, hibiscus strengthens hair follicles at the root. Improves scalp circulation and reduces breakage by 40% with regular use.',
    howToUse: 'Warm slightly and apply to scalp and hair lengths. Massage for 5 minutes. Leave for minimum 1 hour or overnight. Use 3x per week for best results.',
    ingredients: 'Hibiscus Flower Extract, Chamomile, Coconut Oil, Bhringraj',
    rating: 4.8,
    reviews: 521,
    links: { '100ml': 'https://treyfa.in/product/hibiscus-chamomile-hair-oil/', '200ml': 'https://treyfa.in/product/coconut-chamomile-hibiscus-hair-oil-200ml/' },
  },
  {
    id: 7,
    img: hibiscus_shampoo,
    name: 'Hibiscus Shampoo',
    tags: ['hairfall', 'dandruff'],
    category: 'hair',
    tagline: 'Anti-Hairfall & Strengthening',
    benefits: 'Amla and hibiscus create a protein shield around each hair shaft, preventing breakage. Reduces hair fall by up to 60% after 4 weeks of consistent use.',
    howToUse: 'Wet hair thoroughly. Apply and massage into scalp in circular motions for 2-3 minutes. Let lather sit for 1 minute. Rinse well. Use 3x per week.',
    ingredients: 'Hibiscus Extract, Amla, Bhringraj, Keratin Protein',
    rating: 4.5,
    reviews: 367,
    links: { '100ml': 'https://treyfa.in/product/hibiscus-shampoo-hair-growth-100ml/', '200ml': 'https://treyfa.in/product/hair-fall-shampoo-hibiscus-amla-200ml/' },
  },
  {
    id: 8,
    img: hibiscus_conditioner,
    name: 'Hibiscus Conditioner',
    tags: ['hairfall', 'hair_dry'],
    category: 'hair',
    tagline: 'Repairs & Prevents Breakage',
    benefits: 'Argan oil and hibiscus reconstruct damaged hair cuticles. Locks in 3x more moisture than regular conditioners, preventing split ends and reducing frizz.',
    howToUse: 'After shampooing, apply from mid-lengths to tips. Avoid roots. Leave for 3-5 minutes for light conditioning, 10 minutes for deep repair. Rinse with cool water.',
    ingredients: 'Hibiscus Flower Extract, Argan Oil, Keratin, Coconut Milk',
    rating: 4.6,
    reviews: 298,
    links: { '100ml': 'https://treyfa.in/product/hibiscus-conditioner-hair-growth-100ml/', '200ml': 'https://treyfa.in/product/hibiscus-argan-conditioner-for-deep-hair-repair/' },
  },
  {
    id: 9,
    img: curry_leaves_oil,
    name: 'Curry Leaves Oil',
    tags: ['hair_frizzy', 'hair_dry'],
    category: 'hair',
    tagline: 'Frizz Control & Shine',
    benefits: 'Beta-carotene and proteins in curry leaves smooth the hair cuticle from inside out. Eliminates frizz, adds natural shine and strengthens each strand.',
    howToUse: 'Warm slightly. Apply evenly through hair and scalp. Leave for minimum 1 hour or overnight for deep conditioning. Use 2x per week.',
    ingredients: 'Curry Leaves Extract, Coconut Oil, Vitamin E, Biotin',
    rating: 4.4,
    reviews: 189,
    links: { '100ml': 'https://treyfa.in/product/curry-leaves-hair-oil-growth-100ml/', '200ml': 'https://treyfa.in/product/coconut-curry-leaves-hair-oil-200ml/' },
  },
  {
    id: 10,
    img: basil_oil,
    name: 'Basil Oil',
    tags: ['oily_scalp', 'skin_oily'],
    category: 'hair',
    tagline: 'Sebum Control & Balance',
    benefits: 'Eugenol in basil regulates sebaceous gland activity, reducing excess scalp and skin oil without over-drying. Anti-bacterial properties prevent scalp infections.',
    howToUse: 'Apply 2-3 drops to scalp and temples. Massage gently. Can be mixed with carrier oil. Use as a pre-wash treatment, leave for 30 minutes.',
    ingredients: 'Pure Basil Extract, Coconut Oil, Eucalyptus Oil',
    rating: 4.5,
    reviews: 234,
    links: { '100ml': 'https://treyfa.in/product/basil-healing-oil-heaven-100ml/', '200ml': 'https://treyfa.in/product/basil-hair-oil-body-care-200ml/' },
  },
  {
    id: 11,
    img: henna_oil,
    name: 'Henna Oil',
    tags: ['oily_scalp', 'hairfall'],
    category: 'hair',
    tagline: 'Deep Scalp Conditioning',
    benefits: 'Henna\'s natural astringent properties tighten scalp pores and reduce oiliness while its conditioning agents strengthen hair roots and reduce fall.',
    howToUse: 'Apply generously to scalp and hair. Leave for 1 hour. For best results, cover with a warm towel for 20 minutes. Shampoo out thoroughly.',
    ingredients: 'Henna Leaf Extract, Sesame Oil, Amla, Fenugreek',
    rating: 4.3,
    reviews: 156,
    links: { '100ml': 'https://treyfa.in/product/herbal-henna-black-hair-oil/', '200ml': 'https://treyfa.in/product/coconut-henna-black-hair-oil/' },
  },
];

// ─── Star rating component ────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} className={`star ${n <= Math.round(rating) ? 'star-on' : 'star-off'}`}>★</span>
    ))}
    <span className="rating-val">{rating.toFixed(1)}</span>
  </div>
);

// ─── Individual product card ──────────────────────────────────
const ProductCard = ({
  product: p,
  isRecommended,
  matchScore,
  selectedSizes,
  setSelectedSizes,
  onBuy,
  onAfter45,
}) => {
  const isFacewash = p.name.toLowerCase().includes('facewash');
  const sizes = isFacewash ? ['100ml', '150ml'] : ['100ml', '200ml'];
  const currentSize = selectedSizes[p.id] || '100ml';

  return (
    <div className={`pcard ${isRecommended ? 'pcard-rec' : 'pcard-other'}`}>

      {/* Match ribbon */}
      {isRecommended && matchScore > 0 && (
        <div className="match-ribbon">
          <span>{matchScore}% Match</span>
        </div>
      )}

      {/* Col 1: Image + name + meta */}
      <div className="pcard-col-img">
        <div className="pcard-img-frame">
          <img src={p.img} alt={p.name} />
        </div>
        <h3 className="pcard-name">{p.name}</h3>
        <p className="pcard-tagline">{p.tagline}</p>
        <Stars rating={p.rating} />
        <span className="pcard-reviews">({p.reviews.toLocaleString()} reviews)</span>
        <span className={`pcard-cat-badge cat-${p.category}`}>
          {p.category === 'face' ? '👤 Face' : '💇 Hair'}
        </span>
      </div>

      {/* Col 2: Details */}
      <div className="pcard-col-details">
        <div className="detail-box">
          <h5 className="detail-box-title">Benefits</h5>
          <p className="detail-box-text">{p.benefits}</p>
        </div>
        <div className="detail-box">
          <h5 className="detail-box-title">How to Use</h5>
          <p className="detail-box-text">{p.howToUse}</p>
        </div>
        <div className="detail-box">
          <h5 className="detail-box-title">Key Ingredients</h5>
          <p className="detail-box-text">{p.ingredients}</p>
        </div>
      </div>

      {/* Col 3: Size selector */}
      <div className="pcard-col-size">
        <h5 className="detail-box-title">Size</h5>
        <div className="size-btns">
          {sizes.map(s => (
            <button
              key={s}
              className={`size-btn ${currentSize === s ? 'size-btn-on' : ''}`}
              onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: s }))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Col 4: Action buttons */}
      <div className="pcard-col-actions">
        {isRecommended ? (
          <button className="after45-btn" onClick={onAfter45}>
            📊 45-Day Result
          </button>
        ) : (
          <button className="after45-btn after45-disabled" disabled>
            📊 45-Day Result
          </button>
        )}
        <button className="buy-btn" onClick={() => onBuy(p)}>
          Buy Now →
        </button>
      </div>
    </div>
  );
};

// ─── 45-Day Transformation Modal ─────────────────────────────
const TransformModal = ({ product, userImg, onClose, onBuy }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="transform-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>✕</button>

      <div className="modal-head">
        <span className="modal-badge">45-Day Journey</span>
        <h3 className="modal-title">{product.name}</h3>
        <p className="modal-sub">Your estimated transformation with consistent use</p>
      </div>

      <div className="transform-stages">
        {[
          { day: 'Day 15', cls: 'stage-15', status: 'Starting', desc: 'Active botanicals begin penetrating. Initial soothing effect and reduced inflammation visible.' },
          { day: 'Day 28', cls: 'stage-28', status: 'Improving', desc: 'Significant texture improvement. Skin tone balancing, pore size reduction becoming visible.' },
          { day: 'Day 45 ✓', cls: 'stage-45', status: 'Transformed', desc: 'Problem fully addressed. Clear, healthy, radiant skin achieved with continued improvement.' },
        ].map(({ day, cls, status, desc }, i) => (
          <React.Fragment key={day}>
            {i > 0 && <span className="stage-arrow">→</span>}
            <div className={`stage-card ${i === 2 ? 'stage-card-final' : ''}`}>
              <div className={`stage-day-label ${i === 2 ? 'stage-day-final' : ''}`}>{day}</div>
              <div className={`stage-img-wrap ${cls}`}>
                {userImg && <img src={userImg} alt={day} />}
              </div>
              <div className={`stage-status ${i === 2 ? 'stage-status-complete' : ''}`}>{status}</div>
              <p className="stage-desc">{desc}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      <p className="modal-disclaimer">
        * Individual results may vary based on skin type, consistency of use, and lifestyle factors.
      </p>

      <button className="claim-btn" onClick={() => onBuy(product)}>
        Claim This Result — Buy Now →
      </button>
    </div>
  </div>
);


// ═══════════════════════════════════════════════════════════════
// SOLUTION PAGE ROOT
// ═══════════════════════════════════════════════════════════════
const SolutionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [theme, setTheme]           = useState(() => localStorage.getItem('treyfa-theme') || 'dark');
  const [selectedSizes, setSizes]   = useState({});
  const [modalProduct, setModal]    = useState(null);

  const problems  = state?.problems  || [];
  const userImg   = localStorage.getItem('userHeadImage');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('treyfa-theme', next);
  };

  // Build active tag set from detected problems (non-healthy only)
  const activeTags = problems
    .filter(p => p.severity !== 'none')
    .flatMap(p => PROBLEM_TAGS[p.problem] || []);

  const detectedIssues = problems.filter(p => p.severity !== 'none');

  // Score: how many of the product's tags match active tags / total product tags
  const matchScore = p => {
    const hits = p.tags.filter(t => activeTags.includes(t)).length;
    return activeTags.length === 0 ? 0 : Math.round((hits / p.tags.length) * 100);
  };

  const recommended = PRODUCTS
    .filter(p => p.tags.some(t => activeTags.includes(t)))
    .sort((a, b) => matchScore(b) - matchScore(a));

  const others = PRODUCTS.filter(p => !p.tags.some(t => activeTags.includes(t)));

  const handleBuy = product => {
    const size = selectedSizes[product.id] || '100ml';
    const link = product.links[size];
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="sol-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <button className="back-btn sol-back-btn" onClick={() => navigate('/')} aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="sol-container">

        {/* Page header */}
        <div className="sol-header">
          <span className="sol-header-badge">Personalised Treatment Plan</span>
          <h2 className="sol-main-title">Your Clinical Prescription</h2>
          {userImg && (
            <div className="sol-user-img">
              <img src={userImg} alt="Your scan" />
            </div>
          )}
        </div>

        {/* Detected problem tags */}
        {detectedIssues.length > 0 && (
          <div className="detected-bar">
            <span className="detected-label">Analysed for:</span>
            {detectedIssues.map((p, i) => (
              <span key={i} className={`detected-tag tag-sev-${p.severity}`}>
                {p.icon} {p.problem}
              </span>
            ))}
          </div>
        )}

        {/* Recommended section */}
        {recommended.length > 0 && (
          <>
            <div className="sol-section-head">
              <h3 className="sol-section-title">Recommended For You</h3>
              <span className="sol-section-sub">{recommended.length} products matched to your needs</span>
            </div>
            <div className="pcards-list">
              {recommended.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isRecommended
                  matchScore={matchScore(p)}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSizes}
                  onBuy={handleBuy}
                  onAfter45={() => setModal(p)}
                />
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        <div className="explore-divider">
          <span>Explore More Products</span>
        </div>

        {/* Other products */}
        <div className="pcards-list pcards-other">
          {others.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              isRecommended={false}
              matchScore={0}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSizes}
              onBuy={handleBuy}
              onAfter45={() => {}}
            />
          ))}
        </div>
      </div>

      {/* 45-day modal */}
      {modalProduct && (
        <TransformModal
          product={modalProduct}
          userImg={userImg}
          onClose={() => setModal(null)}
          onBuy={handleBuy}
        />
      )}
    </div>
  );
};

export default SolutionPage;
