import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import ProductRow from '../components/ProductRow';
import TransformModal from '../components/TransformModal';
import products from '../data/products';
import '../styles/theme.css';
import '../styles/solution.css';

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
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <button className="close-x-btn solution-close" onClick={() => navigate('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
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
              onAfter45={setModalProduct}
            />
          ))}
        </div>

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
