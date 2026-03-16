import React from 'react';

const TransformModal = ({ product, userImg, onClose, onBuy }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content glassmorphic-panel" onClick={(e) => e.stopPropagation()}>
      <button className="close-x-btn" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20 }}>
        ×
      </button>
      <h3 className="modal-title">45-Day Transformation: {product?.name}</h3>

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

      <button className="primary-buy-btn" onClick={() => onBuy(product)}>
        CLAIM THIS RESULT
      </button>
    </div>
  </div>
);

export default TransformModal;
