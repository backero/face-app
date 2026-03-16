import basil_oil from '../assets/basil_oil.png';
import choco_coffee_facewash from '../assets/choco_coffee_facewash.png';
import curry_leaves_oil from '../assets/curry_leaves_oil.png';
import henna_oil from '../assets/henna_oil.png';
import hibiscus_conditioner from '../assets/hibiscus_conditioner.png';
import hibiscus_oil from '../assets/hibiscus_oil.png';
import hibiscus_shampoo from '../assets/hibiscus_shampoo.png';
import neem_facewash from '../assets/neem_facewash.png';
import neem_oil from '../assets/neem_oil.png';
import neem_shampoo from '../assets/neem_shampoo.png';
import turmeric_facewash from '../assets/turmeric_facewash.png';

const products = [
  // Face Products
  {
    id: 2,
    img: choco_coffee_facewash,
    name: 'Choco Coffee Facewash',
    tags: ['skin_dry', 'skin_oily', 'skin_mixed'],
    benefits: 'Hydrates and Balances.',
    howToUse: 'Lather and rinse.',
    links: {
      '100ml': 'https://treyfa.in/product/choco-coffee-face-wash-hydration-100ml/',
      '150ml': 'https://treyfa.in/product/choco-coffee-face-wash-150ml/',
    },
  },
  {
    id: 8,
    img: neem_facewash,
    name: 'Neem Facewash',
    tags: ['skin_acne', 'skin_pimples'],
    benefits: 'Anti-bacterial formula.',
    howToUse: 'Use twice daily.',
    links: { '100ml': '...', '150ml': '...' },
  },
  {
    id: 11,
    img: turmeric_facewash,
    name: 'Turmeric Facewash',
    tags: ['skin_tan', 'hair_frizzy'],
    benefits: 'Brightens and reduces tan.',
    howToUse: 'Massage 1 min.',
    links: { '100ml': '...', '150ml': '...' },
  },
  // Hair Products
  {
    id: 10,
    img: neem_shampoo,
    name: 'Neem Shampoo',
    tags: ['dandruff', 'oily_scalp'],
    benefits: 'Clears dandruff.',
    howToUse: 'Massage 2 mins.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 9,
    img: neem_oil,
    name: 'Neem Oil',
    tags: ['dandruff', 'oily_scalp'],
    benefits: 'Antidandruff.',
    howToUse: 'Pre-wash massage.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 7,
    img: hibiscus_shampoo,
    name: 'Hibiscus Shampoo',
    tags: ['hairfall'],
    benefits: 'Reduces fall.',
    howToUse: 'Wet hair, lather.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 5,
    img: hibiscus_conditioner,
    name: 'Hibiscus Conditioner',
    tags: ['hairfall'],
    benefits: 'Prevents breakage.',
    howToUse: 'Use after shampoo.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 6,
    img: hibiscus_oil,
    name: 'Hibiscus Oil',
    tags: ['hairfall'],
    benefits: 'Growth booster.',
    howToUse: '3x weekly.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 3,
    img: curry_leaves_oil,
    name: 'Curry Leaves Oil',
    tags: ['hair_frizzy'],
    benefits: 'Tames frizz.',
    howToUse: 'Scalp massage.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 1,
    img: basil_oil,
    name: 'Basil Oil',
    tags: ['oily_scalp', 'skin_oily'],
    benefits: 'Controls sebum.',
    howToUse: 'Apply to temples.',
    links: {
      '100ml': 'https://treyfa.in/product/basil-healing-oil-heaven-100ml/',
      '200ml': 'https://treyfa.in/product/basil-hair-oil-body-care-200ml/',
    },
  },
  {
    id: 4,
    img: henna_oil,
    name: 'Henna Oil',
    tags: ['oily_scalp'],
    benefits: 'Conditions scalp.',
    howToUse: 'Leave for 1hr.',
    links: { '100ml': '...', '200ml': '...' },
  },
];

export default products;
