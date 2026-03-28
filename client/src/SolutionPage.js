// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './App.css';

// // Image imports
// import basil_oil from './basil_oil.png';
// import choco_coffee_facewash from './choco_coffee_facewash.png';
// import curry_leaves_oil from './curry_leaves_oil.png';
// import henna_oil from './henna_oil.png';
// import hibiscus_conditioner from './hibiscus_conditioner.png';
// import hibiscus_oil from './hibiscus_oil.png';
// import hibiscus_shampoo from './hibiscus_shampoo.png';
// import neem_facewash from './neem_facewash.png';
// import neem_oil from './neem_oil.png';
// import neem_shampoo from './neem_shampoo.png';
// import turmeric_facewash from './turmeric_facewash.png';

// const productsData = [
//   { id: 1, img: basil_oil, name: "Basil Oil", tags: ["skin_oily", "oily_scalp"], benefits: "Controls sebum.", howToUse: "Apply to temples.", links: {"100ml": "https://treyfa.in/product/basil-healing-oil-heaven-100ml/", "200ml": "https://treyfa.in/product/basil-hair-oil-body-care-200ml/"}},
//   { id: 2, img: choco_coffee_facewash, name: "Choco Coffee Facewash", tags: ["skin_dry", "skin_oily", "skin_mixed", "split_ends"], benefits: "Hydrates & Balances.", howToUse: "Lather & rinse.", links: {"100ml": "https://treyfa.in/product/choco-coffee-face-wash-hydration-100ml/", "150ml": "https://treyfa.in/product/choco-coffee-face-wash-150ml/"}},
//   { id: 3, img: curry_leaves_oil, name: "Curry Leaves Oil", tags: ["hair_frizzy"], benefits: "Tames frizz.", howToUse: "Massage into scalp.", links: {"100ml": "https://treyfa.in/product/curry-leaves-hair-oil-growth-100ml/", "200ml": "https://treyfa.in/product/coconut-curry-leaves-hair-oil-200ml/"}},
//   { id: 4, img: henna_oil, name: "Henna Oil", tags: ["oily_scalp"], benefits: "Deep conditions.", howToUse: "Leave for 1hr.", links: {"100ml": "...", "200ml": "..."}},
//   { id: 5, img: hibiscus_conditioner, name: "Hibiscus Conditioner", tags: ["hairfall"], benefits: "Reduces fall.", howToUse: "Use after shampoo.", links: {"100ml": "...", "200ml": "..."} },
//   { id: 6, img: hibiscus_oil, name: "Hibiscus Oil", tags: ["hairfall"], benefits: "Boosts growth.", howToUse: "Apply 3x weekly.", links: {"100ml": "...", "200ml": "..."} },
//   { id: 7, img: hibiscus_shampoo, name: "Hibiscus Shampoo", tags: ["hairfall"], benefits: "Gentle cleanse.", howToUse: "Wet hair, lather.", links: {"100ml": "...", "200ml": "..."} },
//   { id: 8, img: neem_facewash, name: "Neem Facewash", tags: ["skin_acne", "skin_pimples"], benefits: "Anti-bacterial.", howToUse: "Twice daily.", links: {"100ml": "...", "150ml": "..."}},
//   { id: 9, img: neem_oil, name: "Neem Oil", tags: ["dandruff", "oily_scalp"], benefits: "Antidandruff.", howToUse: "Massage scalp.", links: {"100ml": "...", "200ml": "..."}},
//   { id: 10, img: neem_shampoo, name: "Neem Shampoo", tags: ["dandruff", "oily_scalp"], benefits: "Clears flakes.", howToUse: "Massage 2 mins.", links: {"100ml": "...", "200ml": "..."}},
//   { id: 11, img: turmeric_facewash, name: "Turmeric Facewash", tags: ["skin_tan", "hair_frizzy"], benefits: "Brightens skin.", howToUse: "Massage 1 min.", links: {"100ml": "...", "150ml": "..."}},
// ];

// const SolutionPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [theme, setTheme] = useState(localStorage.getItem('treyfa-theme') || 'dark');
//   const [selectedSizes, setSelectedSizes] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [modalProduct, setModalProduct] = useState(null);
  
//   const scanResults = location.state?.problems || [];
//   const userImg = localStorage.getItem('userHeadImage');

//   const handleGoBack = () => navigate('/');

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     localStorage.setItem('treyfa-theme', newTheme);
//   };

//   const getActiveTags = () => {
//     const text = scanResults.join(" ").toLowerCase();
//     const tags = [];
//     if (text.includes("dandruff")) tags.push("dandruff");
//     if (text.includes("hairfall")) tags.push("hairfall");
//     if (text.includes("split")) tags.push("split_ends");
//     if (text.includes("frizzy")) tags.push("hair_frizzy");
//     if (text.includes("oily scalp")) tags.push("oily_scalp");
//     if (text.includes("acne") || text.includes("pimples")) tags.push("skin_acne", "skin_pimples");
//     if (text.includes("tan")) tags.push("skin_tan");
//     if (text.includes("dry") || text.includes("oily") || text.includes("combination")) tags.push("skin_dry", "skin_oily", "skin_mixed");
//     return tags;
//   };

//   const activeTags = getActiveTags();
//   const recommended = productsData.filter(p => p.tags?.some(t => activeTags.includes(t)));
//   const others = productsData.filter(p => !p.tags?.some(t => activeTags.includes(t)));

//   const handleBuyNow = (product) => {
//     const currentSize = selectedSizes[product.id] || "100ml";
//     const targetLink = product.links[currentSize];
//     if (targetLink) window.open(targetLink, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <div className="solution-viewport" data-theme={theme}>
//       <button className="theme-toggle-btn" onClick={toggleTheme}>
//         {theme === 'dark' ? '☀️' : '🌙'}
//       </button>

//       <button className="close-x-btn solution-close" onClick={handleGoBack}>
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
//       </button>

//       <div className="full-width-container">
//         <h2 className="cherry-header-main">Your Clinical Prescription</h2>
//         <div className="product-stack-full">
//           {recommended.map((p) => (
//             <ProductRow 
//               key={p.id} 
//               p={p} 
//               isRecommended={true} 
//               selectedSizes={selectedSizes} 
//               setSelectedSizes={setSelectedSizes} 
//               handleBuyNow={handleBuyNow} 
//               onAfter45={(prod) => {setModalProduct(prod); setShowModal(true);}} 
//             />
//           ))}
//         </div>

//         <div className="more-products-divider"><span>More Products</span></div>
//         <div className="product-stack-full secondary-stack">
//           {others.map((p) => (
//             <ProductRow 
//               key={p.id} 
//               p={p} 
//               isRecommended={false} 
//               selectedSizes={selectedSizes} 
//               setSelectedSizes={setSelectedSizes} 
//               handleBuyNow={handleBuyNow} 
//               onAfter45={(prod) => {setModalProduct(prod); setShowModal(true);}} 
//             />
//           ))}
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal-content glassmorphic-panel" onClick={e => e.stopPropagation()}>
//             <button className="close-x-btn" onClick={() => setShowModal(false)}>×</button>
//             <h3 className="modal-title">45-Day Transformation: {modalProduct?.name}</h3>
            
//             <div className="transformation-grid">
//               <div className="stage-box">
//                 <img src={userImg} className="face-preview day-15" alt="Day 15 preview" />
//                 <span className="day-label">15 days</span>
//                 <p className="stage-desc">Active botanical penetration.</p>
//               </div>
//               <div className="stage-box">
//                 <img src={userImg} className="face-preview day-28" alt="Day 28 preview" />
//                 <span className="day-label">28 days</span>
//                 <p className="stage-desc">Visible texture healing.</p>
//               </div>
//               <div className="stage-box active-stage">
//                 <img src={userImg} className="face-preview day-45" alt="Day 45 preview" />
//                 <span className="day-label cherry">45 days</span>
//                 <p className="stage-desc">Problem fully rectified.</p>
//               </div>
//             </div>
//             <button className="primary-buy-btn" onClick={() => handleBuyNow(modalProduct)}>CLAIM THIS RESULT</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const ProductRow = ({ p, isRecommended, selectedSizes, setSelectedSizes, handleBuyNow, onAfter45 }) => {
//   const isFacewash = p.name.toLowerCase().includes("facewash");
//   return (
//     <div className="masterpiece-row">
//       <div className="col-product">
//         <div className="img-frame"><img src={p.img} alt={p.name} /></div>
//         <h3 className="product-title-small">{p.name}</h3>
//       </div>
//       <div className="col-details-split">
//         <h4 className="column-title">Description</h4>
//         <div className="split-tables-container">
//           <div className="info-table"><h5>Benefits</h5><p>{p.benefits}</p></div>
//           <div className="info-table"><h5>How to Use</h5><p>{p.howToUse}</p></div>
//         </div>
//       </div>
//       <div className="col-capacity">
//         <select className="capacity-select" value={selectedSizes[p.id] || "100ml"} onChange={(e) => setSelectedSizes(prev => ({...prev, [p.id]: e.target.value}))}>
//           <option value="100ml">100ml</option>
//           {isFacewash && <option value="150ml">150ml</option>}
//           {!isFacewash && <option value="200ml">200ml</option>}
//         </select>
//       </div>
//       <div className="col-buttons">
//         <button 
//           className={`secondary-btn ${!isRecommended ? 'disabled-after-btn' : ''}`} 
//           onClick={() => isRecommended && onAfter45(p)}
//           disabled={!isRecommended}
//         >
//           AFTER 45 DAYS
//         </button>
//         <button className="primary-buy-btn" onClick={() => handleBuyNow(p)}>BUY NOW</button>
//       </div>
//     </div>
//   );
// };

// export default SolutionPage;





import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Image imports
import basil_oil from './basil_oil.png';
import choco_coffee_facewash from './choco_coffee_facewash.png';
import curry_leaves_oil from './curry_leaves_oil.png';
import henna_oil from './henna_oil.png';
import hibiscus_conditioner from './hibiscus_conditioner.png';
import hibiscus_oil from './hibiscus_oil.png';
import hibiscus_shampoo from './hibiscus_shampoo.png';
import neem_facewash from './neem_facewash.png';
import neem_oil from './neem_oil.png';
import neem_shampoo from './neem_shampoo.png';
import turmeric_facewash from './turmeric_facewash.png';

const productsData = [
  // Face Products
  { id: 2, img: choco_coffee_facewash, name: "Choco Coffee Facewash", tags: ["skin_dry", "skin_oily", "skin_mixed"], benefits: "Hydrates and Balances.", howToUse: "Lather and rinse.", links: {"100ml": "https://treyfa.in/product/choco-coffee-face-wash-hydration-100ml/", "150ml": "https://treyfa.in/product/choco-coffee-face-wash-150ml/"}},
  { id: 8, img: neem_facewash, name: "Neem Facewash", tags: ["skin_acne", "skin_pimples"], benefits: "Anti-bacterial formula.", howToUse: "Use twice daily.", links: {"100ml": "https://treyfa.in/product/neem-face-wash-100ml/", "150ml": "https://treyfa.in/product/herbal-neem-foaming-face-wash-150ml/"}},
  { id: 11, img: turmeric_facewash, name: "Turmeric Facewash", tags: ["skin_tan", "hair_frizzy"], benefits: "Brightens and reduces tan.", howToUse: "Massage 1 min.", links: {"100ml": "https://treyfa.in/product/turmeric-face-wash-100ml/", "150ml": "https://treyfa.in/product/turmeric-foaming-face-wash-150ml/"}},
  // Hair Products
  { id: 10, img: neem_shampoo, name: "Neem Shampoo", tags: ["dandruff", "oily_scalp"], benefits: "Clears dandruff.", howToUse: "Massage 2 mins.", links: {"100ml": "https://treyfa.in/product/neem-dandruff-shampoo-100ml/", "200ml": "https://treyfa.in/product/powerful-neem-anti-dandruff-shampoo-conditioner/"}},
  { id: 9, img: neem_oil, name: "Neem Oil", tags: ["dandruff", "oily_scalp"], benefits: "Antidandruff.", howToUse: "Pre-wash massage.", links: {"100ml": "https://treyfa.in/product/neem-face-wash-100ml/", "200ml": "https://treyfa.in/product/coconut-neem-anti-dandruff-oil-200ml/"}},
  { id: 7, img: hibiscus_shampoo, name: "Hibiscus Shampoo", tags: ["hairfall"], benefits: "Reduces fall.", howToUse: "Wet hair, lather.", links: {"100ml": "https://treyfa.in/product/hibiscus-shampoo-hair-growth-100ml/", "200ml": "https://treyfa.in/product/hair-fall-shampoo-hibiscus-amla-200ml/"}},
  { id: 5, img: hibiscus_conditioner, name: "Hibiscus Conditioner", tags: ["hairfall"], benefits: "Prevents breakage.", howToUse: "Use after shampoo.", links: {"100ml": "https://treyfa.in/product/hibiscus-conditioner-hair-growth-100ml/", "200ml": "https://treyfa.in/product/hibiscus-argan-conditioner-for-deep-hair-repair/"}},
  { id: 6, img: hibiscus_oil, name: "Hibiscus Oil", tags: ["hairfall"], benefits: "Growth booster.", howToUse: "3x weekly.", links: {"100ml": "https://treyfa.in/product/hibiscus-chamomile-hair-oil/", "200ml": "https://treyfa.in/product/coconut-chamomile-hibiscus-hair-oil-200ml/"}},
  { id: 3, img: curry_leaves_oil, name: "Curry Leaves Oil", tags: ["hair_frizzy"], benefits: "Tames frizz.", howToUse: "Scalp massage.", links: {"100ml": "https://treyfa.in/product/curry-leaves-hair-oil-growth-100ml/", "200ml": "https://treyfa.in/product/coconut-curry-leaves-hair-oil-200ml/"}},
  { id: 1, img: basil_oil, name: "Basil Oil", tags: ["oily_scalp", "skin_oily"], benefits: "Controls sebum.", howToUse: "Apply to temples.", links: {"100ml": "https://treyfa.in/product/basil-healing-oil-heaven-100ml/", "200ml": "https://treyfa.in/product/basil-hair-oil-body-care-200ml/"}},
  { id: 4, img: henna_oil, name: "Henna Oil", tags: ["oily_scalp"], benefits: "Conditions scalp.", howToUse: "Leave for 1hr.", links: {"100ml": "https://treyfa.in/product/herbal-henna-black-hair-oil/", "200ml": "https://treyfa.in/product/coconut-henna-black-hair-oil/"}},
];

const SolutionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('treyfa-theme') || 'dark');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  
  const scanResults = location.state?.problems || [];
  const userImg = localStorage.getItem('userHeadImage');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('treyfa-theme', newTheme);
  };

  const getActiveTags = () => {
    const text = scanResults.join(" ").toLowerCase();
    const tags = [];
    if (text.includes("dandruff")) tags.push("dandruff");
    if (text.includes("hairfall")) tags.push("hairfall");
    if (text.includes("frizzy")) tags.push("hair_frizzy");
    if (text.includes("oily scalp")) tags.push("oily_scalp");
    if (text.includes("acne") || text.includes("pimples")) tags.push("skin_acne", "skin_pimples");
    if (text.includes("tan")) tags.push("skin_tan");
    if (text.includes("dry") || text.includes("oily") || text.includes("combination")) tags.push("skin_dry", "skin_oily", "skin_mixed");
    return tags;
  };

  const activeTags = getActiveTags();
  const recommended = productsData.filter(p => p.tags?.some(t => activeTags.includes(t)));
  const others = productsData.filter(p => !p.tags?.some(t => activeTags.includes(t)));

  const handleBuyNow = (product) => {
    const currentSize = selectedSizes[product.id] || "100ml";
    const targetLink = product.links[currentSize];
    if (targetLink) window.open(targetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="solution-viewport" data-theme={theme}>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <button className="close-x-btn solution-close" onClick={() => navigate('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="full-width-container">
        <h2 className="cherry-header-main">Your Clinical Prescription</h2>
        <div className="product-stack-full">
          {recommended.map((p) => (
            <ProductRow 
              key={p.id} 
              p={p} 
              isRecommended={true} 
              selectedSizes={selectedSizes} 
              setSelectedSizes={setSelectedSizes} 
              handleBuyNow={handleBuyNow} 
              onAfter45={(prod) => {setModalProduct(prod); setShowModal(true);}} 
            />
          ))}
        </div>

        <div className="more-products-divider"><span>More Products</span></div>
        <div className="product-stack-full secondary-stack">
          {others.map((p) => (
            <ProductRow 
              key={p.id} 
              p={p} 
              isRecommended={false} 
              selectedSizes={selectedSizes} 
              setSelectedSizes={setSelectedSizes} 
              handleBuyNow={handleBuyNow} 
              onAfter45={(prod) => {setModalProduct(prod); setShowModal(true);}} 
            />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glassmorphic-panel" onClick={e => e.stopPropagation()}>
            <button className="close-x-btn" onClick={() => setShowModal(false)}>×</button>
            <h3 className="modal-title">45-Day Transformation: {modalProduct?.name}</h3>
            
            {/* LABELED TRANSFORMATION GRID */}
            <div className="transformation-grid">
              <div className="stage-box">
                <img src={userImg} className="face-preview day-15" alt="15 days" />
                <span className="day-label">15 days</span>
                <p className="stage-desc">Visible healing starts.</p>
              </div>
              <div className="stage-box">
                <img src={userImg} className="face-preview day-28" alt="28 days" />
                <span className="day-label">28 days</span>
                <p className="stage-desc">Significant improvement.</p>
              </div>
              <div className="stage-box active-stage">
                <img src={userImg} className="face-preview day-45" alt="45 days" />
                <span className="day-label cherry">45 days</span>
                <p className="stage-desc">Approx you may look like this.</p>
              </div>
            </div>
            <button className="primary-buy-btn" onClick={() => handleBuyNow(modalProduct)}>CLAIM THIS RESULT</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductRow = ({ p, isRecommended, selectedSizes, setSelectedSizes, handleBuyNow, onAfter45 }) => {
  const isFacewash = p.name.toLowerCase().includes("facewash");
  return (
    <div className="masterpiece-row">
      <div className="col-product">
        <div className="img-frame"><img src={p.img} alt={p.name} /></div>
        <h3 className="product-title-small">{p.name}</h3>
      </div>
      <div className="col-details-split">
        <h4 className="column-title">Description</h4>
        <div className="split-tables-container">
          <div className="info-table"><h5>Benefits</h5><p>{p.benefits}</p></div>
          <div className="info-table"><h5>How to Use</h5><p>{p.howToUse}</p></div>
        </div>
      </div>
      <div className="col-capacity">
        <select className="capacity-select" value={selectedSizes[p.id] || "100ml"} onChange={(e) => setSelectedSizes(prev => ({...prev, [p.id]: e.target.value}))}>
          <option value="100ml">100ml</option>
          {isFacewash && <option value="150ml">150ml</option>}
          {!isFacewash && <option value="200ml">200ml</option>}
        </select>
      </div>
      <div className="col-buttons">
        <button 
          className={`secondary-btn ${!isRecommended ? 'disabled-after-btn' : ''}`} 
          onClick={() => isRecommended && onAfter45(p)}
          disabled={!isRecommended}
        >
          AFTER 45 DAYS
        </button>
        <button className="primary-buy-btn" onClick={() => handleBuyNow(p)}>BUY NOW</button>
      </div>
    </div>
  );
};

export default SolutionPage;