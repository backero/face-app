# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TREYFA PRO** — a face/hair analysis web app. Uses webcam + MediaPipe to detect a face, sends the capture to a Python backend for OpenCV-based skin analysis, then recommends Treyfa brand products based on detected issues.

## Architecture

Two services that must run concurrently:

### `backend/` — FastAPI (Python) on port `8000`
| File | Role |
|---|---|
| `main.py` | App factory + CORS middleware + `/health` and `/analyze` endpoints |
| `analyzer.py` | `analyze_skin(img)` — Haar cascade face detection + heuristic checks (oily skin, dark circles, texture, sun tan) |
| `config.py` | Reads `ALLOWED_ORIGINS`, `HOST`, `PORT` from environment with safe defaults |
| `requirements.txt` | Pinned deps: fastapi, uvicorn, opencv-python-headless, numpy, python-multipart |

### `client/src/` — React SPA (CRA) on port `3000`
| Path | Role |
|---|---|
| `App.js` | Router shell only — two `<Route>` entries |
| `pages/ScannerPage.js` | Main scanner UI; loads MediaPipe from CDN, polls webcam, calls `analyzeImage()` |
| `pages/SolutionPage.js` | Receives scan results via `location.state`; filters `products` by tag match |
| `components/ProductRow.js` | Single product card (image, benefits, size selector, buy/45-day buttons) |
| `components/TransformModal.js` | 45-day transformation modal using CSS filters on the saved webcam screenshot |
| `data/products.js` | `products` array — 11 items with image imports, tags, benefits, links |
| `hooks/useTheme.js` | `{ theme, toggleTheme }` — persists to `localStorage` under `treyfa-theme` |
| `api/analyzeApi.js` | `analyzeImage(blob)` — POSTs to `REACT_APP_API_URL`; single point of API contact |
| `styles/theme.css` | CSS variables (`:root`/`[data-theme='light']`) + `.app-viewport` + `.solution-viewport` |
| `styles/scanner.css` | Cards, camera stage, laser animation, report panel, action buttons |
| `styles/solution.css` | Product rows, capacity select, more-products divider, modal, transformation grid |

### Data flow
```
Webcam → MediaPipe (CDN) → face validated → screenshot
  → POST /analyze (FastAPI) → OpenCV analysis → problems[]
    → ScannerPage shows report → navigate /solutions { state: problems }
      → SolutionPage maps keywords → product tags → recommended products
```

## Development Commands

### Backend
```bash
cd backend
python -m venv venv
venv/Scripts/activate        # Windows
pip install -r requirements.txt
python main.py               # runs on http://127.0.0.1:8000
```

### Frontend
```bash
cd client
npm install
npm start                    # dev server at http://localhost:3000
npm run build                # production build
```

### Tests
```bash
cd client
npx react-scripts test --watchAll=false
```

## Key Implementation Notes

- **API URL**: Configured via `client/.env` → `REACT_APP_API_URL`. Never hardcoded.
- **CORS**: Backend reads `ALLOWED_ORIGINS` env var. Set it to your frontend domain in production.
- **10-second delay**: `setTimeout(..., 10000)` in `ScannerPage.startScan` is intentional UX — simulates deep scanning before the real API call.
- **`scanType`**: Inferred from MediaPipe detection confidence score (>0.8 = skin, else hair) — not a separate hair model.
- **Product links**: Most `links` values are placeholder `"..."` — only Choco Coffee Facewash and Basil Oil/Hibiscus Oil have real URLs pointing to `treyfa.in`.
- **45-day modal**: Applies CSS `filter` (brightness/contrast/saturation) to the same user image at three stages — no real ML transformation.

## Deployment

### Production environment variables

**Backend** (`backend/.env`):
```
ALLOWED_ORIGINS=https://your-frontend-domain.com
HOST=0.0.0.0
PORT=8000
```

**Frontend** (`client/.env.production`):
```
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://your-backend-domain.com
```

### Recommended stack

| Layer | Option |
|---|---|
| Frontend | **Vercel** or **Netlify** — `npm run build`, deploy `client/build/` |
| Backend | **Railway** or **Render** — `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Backend (self-hosted) | Docker + Nginx reverse proxy |

### Docker (backend)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Checklist before go-live
- [ ] Set `ALLOWED_ORIGINS` to exact frontend domain (no wildcard)
- [ ] Fill in placeholder `"..."` product links in `client/src/data/products.js`
- [ ] Add HTTPS (required for webcam access in browsers)
- [ ] Set `REACT_APP_API_URL` to production backend URL
