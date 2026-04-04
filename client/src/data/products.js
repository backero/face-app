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
  // ── Face Products ──
  {
    id: 2,
    img: choco_coffee_facewash,
    name: 'Choco Coffee Facewash',
    tags: ['skin_dry', 'skin_oily', 'skin_mixed'],
    routineSlots: ['morning_cleanser', 'night_cleanser'],
    benefits: 'Hydrates and Balances.',
    howToUse: 'Lather and rinse.',
    whyItWorks: "Coffee's natural acids gently exfoliate while cocoa butter restores moisture, directly addressing dryness and sebum imbalance.",
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
    routineSlots: ['morning_cleanser', 'night_cleanser'],
    benefits: 'Anti-bacterial formula.',
    howToUse: 'Use twice daily.',
    whyItWorks: "Neem's azadirachtin directly inhibits P. acnes bacteria growth, reducing breakouts and preventing new acne formation.",
    links: { '100ml': '...', '150ml': '...' },
  },
  {
    id: 11,
    img: turmeric_facewash,
    name: 'Turmeric Facewash',
    tags: ['skin_tan', 'hair_frizzy'],
    routineSlots: ['morning_cleanser'],
    benefits: 'Brightens and reduces tan.',
    howToUse: 'Massage 1 min.',
    whyItWorks: 'Curcumin in turmeric inhibits melanin production, progressively fading sun-induced pigmentation and uneven skin tone.',
    links: { '100ml': '...', '150ml': '...' },
  },
  // ── Hair Products ──
  {
    id: 10,
    img: neem_shampoo,
    name: 'Neem Shampoo',
    tags: ['dandruff', 'oily_scalp'],
    routineSlots: ['morning_cleanser'],
    benefits: 'Clears dandruff.',
    howToUse: 'Massage 2 mins.',
    whyItWorks: "Neem's antifungal compounds target Malassezia, the primary cause of dandruff, while cleansing excess scalp oil.",
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 9,
    img: neem_oil,
    name: 'Neem Oil',
    tags: ['dandruff', 'oily_scalp'],
    routineSlots: ['night_treatment'],
    benefits: 'Antidandruff.',
    howToUse: 'Pre-wash massage.',
    whyItWorks: 'Deep scalp penetration with anti-fungal properties addresses dandruff at the root, reducing flaking overnight.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 7,
    img: hibiscus_shampoo,
    name: 'Hibiscus Shampoo',
    tags: ['hairfall'],
    routineSlots: ['morning_cleanser'],
    benefits: 'Reduces fall.',
    howToUse: 'Wet hair, lather.',
    whyItWorks: 'Hibiscus amino acids strengthen the hair shaft from root to tip, directly reducing breakage and hairfall.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 5,
    img: hibiscus_conditioner,
    name: 'Hibiscus Conditioner',
    tags: ['hairfall'],
    routineSlots: ['morning_treatment'],
    benefits: 'Prevents breakage.',
    howToUse: 'Use after shampoo.',
    whyItWorks: 'Creates a protective protein film around fragile hair fibers, reducing mechanical breakage and split ends.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 6,
    img: hibiscus_oil,
    name: 'Hibiscus Oil',
    tags: ['hairfall'],
    routineSlots: ['night_treatment'],
    benefits: 'Growth booster.',
    howToUse: '3x weekly.',
    whyItWorks: 'Stimulates dormant hair follicles and improves scalp circulation, promoting new growth and reducing thinning.',
    links: {
      '100ml': 'https://treyfa.in/product/hibiscus-hair-oil-100ml/',
      '200ml': 'https://treyfa.in/product/hibiscus-hair-oil-200ml/',
    },
  },
  {
    id: 3,
    img: curry_leaves_oil,
    name: 'Curry Leaves Oil',
    tags: ['hair_frizzy'],
    routineSlots: ['night_treatment'],
    benefits: 'Tames frizz.',
    howToUse: 'Scalp massage.',
    whyItWorks: 'Rich in beta-carotene and proteins that smooth the hair cuticle, eliminating frizz caused by moisture imbalance.',
    links: { '100ml': '...', '200ml': '...' },
  },
  {
    id: 1,
    img: basil_oil,
    name: 'Basil Oil',
    tags: ['oily_scalp', 'skin_oily'],
    routineSlots: ['night_treatment'],
    benefits: 'Controls sebum.',
    howToUse: 'Apply to temples.',
    whyItWorks: "Basil's natural astringents regulate sebaceous gland activity, directly reducing excess oil production on scalp and skin.",
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
    routineSlots: ['night_treatment'],
    benefits: 'Conditions scalp.',
    howToUse: 'Leave for 1hr.',
    whyItWorks: "Henna's natural tannins balance scalp pH and absorb excess sebum while conditioning the scalp barrier.",
    links: { '100ml': '...', '200ml': '...' },
  },
];

export default products;
