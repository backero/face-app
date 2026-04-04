import React, { useState } from 'react';

const ProductRow = ({ p, isRecommended, selectedSizes, setSelectedSizes, handleBuyNow, onAfter45 }) => {
  const [impactActive, setImpactActive] = useState(false);
  const isFacewash = p.name.toLowerCase().includes('facewash');

  const handleImpactToggle = () => {
    if (isRecommended) setImpactActive((prev) => !prev);
  };

  return (
    <div className={`masterpiece-row ${impactActive ? 'impact-active' : ''}`}>
      <div className="col-product">
        <div className="img-frame" onClick={handleImpactToggle} style={{ cursor: isRecommended ? 'pointer' : 'default' }}>
          <img src={p.img} alt={p.name} />
        </div>
        <h3 className="product-title-small">{p.name}</h3>
      </div>

      <div className="col-details-split">
        <h4 className="column-title">Description</h4>
        <div className="split-tables-container">
          <div className="info-table">
            <h5>Benefits</h5>
            <p>{p.benefits}</p>
          </div>
          <div className="info-table">
            <h5>How to Use</h5>
            <p>{p.howToUse}</p>
          </div>
        </div>
        {isRecommended && p.whyItWorks && (
          <div className="why-it-works">
            <span className="why-it-works-label">Why this works for you</span>
            <p>{p.whyItWorks}</p>
          </div>
        )}
        {impactActive && isRecommended && (
          <p className="product-impact-msg">
            ✓ Adding this to your routine targets the issue detected in your scan
          </p>
        )}
      </div>

      <div className="col-capacity">
        <select
          className="capacity-select"
          value={selectedSizes[p.id] || '100ml'}
          onChange={(e) => setSelectedSizes((prev) => ({ ...prev, [p.id]: e.target.value }))}
        >
          <option value="100ml">100ml</option>
          {isFacewash ? (
            <option value="150ml">150ml</option>
          ) : (
            <option value="200ml">200ml</option>
          )}
        </select>
      </div>

      <div className="col-buttons">
        <button
          className={`secondary-btn ${!isRecommended ? 'disabled-after-btn' : ''}`}
          onClick={() => isRecommended && onAfter45(p)}
          disabled={!isRecommended}
        >
          After 30 Days
        </button>
        <button className="primary-buy-btn" onClick={() => handleBuyNow(p)}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductRow;
