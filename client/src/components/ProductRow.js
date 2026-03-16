import React from 'react';

const ProductRow = ({ p, isRecommended, selectedSizes, setSelectedSizes, handleBuyNow, onAfter45 }) => {
  const isFacewash = p.name.toLowerCase().includes('facewash');

  return (
    <div className="masterpiece-row">
      <div className="col-product">
        <div className="img-frame">
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
          AFTER 45 DAYS
        </button>
        <button className="primary-buy-btn" onClick={() => handleBuyNow(p)}>
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default ProductRow;
