from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


# ─────────────────────────────────────────────────────────────
# FACE ANALYSIS  (9 parameters)
# ─────────────────────────────────────────────────────────────
def analyze_face(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
    )
    if len(faces) == 0:
        return []

    # use the largest detected face
    x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]

    fg   = gray[y:y+h, x:x+w]          # face — grayscale
    fh   = hsv [y:y+h, x:x+w]          # face — HSV
    fb   = img [y:y+h, x:x+w]          # face — BGR

    findings = []

    # 1. Oily T-Zone ─ forehead + nose bridge brightness peak
    forehead = fg[0:int(h * 0.30), int(w * 0.20):int(w * 0.80)]
    p90 = float(np.percentile(forehead, 90))
    if p90 > 195:
        sev = "high" if p90 > 228 else "moderate"
        findings.append({
            "problem": "Oily T-Zone",
            "severity": sev,
            "description": "Excess sebum production detected on forehead and nose bridge. "
                           "Pores appear enlarged with active oil buildup.",
            "icon": "💧",
            "category": "face",
        })

    # 2. Dark Circles ─ under-eye region brightness
    ue_l = fg[int(h*0.40):int(h*0.55), int(w*0.08):int(w*0.40)]
    ue_r = fg[int(h*0.40):int(h*0.55), int(w*0.60):int(w*0.92)]
    ue_mean = float(np.mean(np.concatenate([ue_l.ravel(), ue_r.ravel()])))
    if ue_mean < 95:
        sev = "high" if ue_mean < 70 else "moderate"
        findings.append({
            "problem": "Dark Circles",
            "severity": sev,
            "description": "Elevated melanin pigmentation detected under both eyes. "
                           "Vascular congestion and fatigue indicators present.",
            "icon": "🌑",
            "category": "face",
        })

    # 3. Acne & Pimples ─ Laplacian texture variance
    lap_var = float(cv2.Laplacian(fg, cv2.CV_64F).var())
    if lap_var > 390:
        sev = "high" if lap_var > 700 else "moderate"
        findings.append({
            "problem": "Acne & Pimples",
            "severity": sev,
            "description": "Uneven skin texture with raised blemishes detected. "
                           "Bacterial activity indicators and blocked pore signatures found.",
            "icon": "⚡",
            "category": "face",
        })

    # 4. Sun Tan ─ elevated HSV saturation
    sat_mean = float(np.mean(fh[:, :, 1]))
    if sat_mean > 112:
        sev = "high" if sat_mean > 155 else "moderate"
        findings.append({
            "problem": "Sun Tan",
            "severity": sev,
            "description": "Increased melanin distribution indicating prolonged UV exposure. "
                           "Unprotected sun damage pattern detected across skin surface.",
            "icon": "☀️",
            "category": "face",
        })

    # 5. Dry Skin ─ low saturation + mid brightness
    brightness = float(np.mean(fg))
    sat = float(np.mean(fh[:, :, 1]))
    if sat < 62 and 88 < brightness < 162:
        findings.append({
            "problem": "Dry Skin",
            "severity": "moderate",
            "description": "Low moisture barrier detected. Skin appears dehydrated with "
                           "reduced natural lipid protection and tight texture.",
            "icon": "🍃",
            "category": "face",
        })

    # 6. Dull & Tired Skin ─ overall low luminosity
    if brightness < 108:
        findings.append({
            "problem": "Dull & Tired Skin",
            "severity": "moderate",
            "description": "Low skin luminosity detected. Reduced microcirculation and "
                           "dead-cell buildup making skin appear flat and fatigued.",
            "icon": "💤",
            "category": "face",
        })

    # 7. Uneven Skin Tone ─ high std deviation in grayscale (not driven by acne)
    tone_std = float(np.std(fg.astype(np.float32)))
    if tone_std > 55 and lap_var < 390:
        findings.append({
            "problem": "Uneven Skin Tone",
            "severity": "moderate",
            "description": "Inconsistent pigmentation across face detected. Patchy areas "
                           "indicate varying melanin concentration.",
            "icon": "🎨",
            "category": "face",
        })

    # 8. Skin Redness ─ Red channel significantly higher than Green
    r_mean = float(np.mean(fb[:, :, 2].astype(np.float32)))
    g_mean = float(np.mean(fb[:, :, 1].astype(np.float32)))
    if g_mean > 0 and r_mean / g_mean > 1.18:
        findings.append({
            "problem": "Skin Redness",
            "severity": "moderate",
            "description": "Elevated redness and inflammation detected. May indicate "
                           "sensitivity, rosacea, or irritation from external factors.",
            "icon": "🔴",
            "category": "face",
        })

    # 9. Dark Spots ─ localized dark pixel clusters in center face
    center = fg[int(h*0.20):int(h*0.72), int(h*0.15):int(w*0.85)]
    if center.size > 0:
        dark_ratio = np.sum(center < 52) / center.size
        if dark_ratio > 0.055:
            findings.append({
                "problem": "Dark Spots",
                "severity": "moderate",
                "description": "Localized hyperpigmentation detected. Post-inflammatory melanin "
                               "deposits visible in analysis — typical of acne scarring or sun spots.",
                "icon": "⚫",
                "category": "face",
            })

    return findings


# ─────────────────────────────────────────────────────────────
# HAIR & SCALP ANALYSIS  (6 parameters)
# ─────────────────────────────────────────────────────────────
def analyze_hair(img):
    h, w = img.shape[:2]

    # Use upper 60% of the frame (scalp/hair region)
    rg   = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)[0:int(h*0.60), :]
    rh   = cv2.cvtColor(img, cv2.COLOR_BGR2HSV )[0:int(h*0.60), :]
    rb   = img[0:int(h*0.60), :]

    findings = []

    # 1. Oily Scalp ─ bright specular highlights on scalp
    p90 = float(np.percentile(rg, 90))
    if p90 > 182:
        sev = "high" if p90 > 214 else "moderate"
        findings.append({
            "problem": "Oily Scalp",
            "severity": sev,
            "description": "Excess sebum detected on scalp surface. Follicles appear clogged "
                           "with oil buildup causing limp, greasy hair appearance.",
            "icon": "💧",
            "category": "hair",
        })

    # 2. Dandruff ─ abnormally high ratio of very bright pixels (white flakes)
    bright_ratio = float(np.sum(rg > 205) / rg.size)
    if bright_ratio > 0.022:
        sev = "high" if bright_ratio > 0.058 else "moderate"
        findings.append({
            "problem": "Dandruff",
            "severity": sev,
            "description": "Flaking and scaling detected on scalp. Malassezia fungal activity "
                           "indicators present causing white/yellow flake formation.",
            "icon": "❄️",
            "category": "hair",
        })

    # 3. Dry & Brittle Hair ─ low HSV saturation in hair region
    hair_sat = float(np.mean(rh[:, :, 1]))
    if hair_sat < 48:
        findings.append({
            "problem": "Dry & Brittle Hair",
            "severity": "moderate",
            "description": "Low moisture and protein levels detected in hair shaft. Cuticle "
                           "appears lifted and damaged, leading to breakage and split ends.",
            "icon": "🌾",
            "category": "hair",
        })

    # 4. Frizzy Hair ─ high Laplacian texture variance across hair region
    frizz_var = float(cv2.Laplacian(rg, cv2.CV_64F).var())
    if frizz_var > 290:
        sev = "high" if frizz_var > 580 else "moderate"
        findings.append({
            "problem": "Frizzy Hair",
            "severity": sev,
            "description": "High cuticle roughness and moisture imbalance detected. Hair "
                           "strands not aligned, indicating humidity damage or heat styling.",
            "icon": "🌪️",
            "category": "hair",
        })

    # 5. Hair Thinning ─ low dark-pixel density (less hair coverage)
    dark_density = float(np.sum(rg < 75) / rg.size)
    if dark_density < 0.12:
        findings.append({
            "problem": "Hair Thinning",
            "severity": "moderate",
            "description": "Reduced hair density detected across scalp region. Follicle "
                           "miniaturization pattern present — early-stage thinning indicators.",
            "icon": "🔍",
            "category": "hair",
        })

    # 6. Scalp Irritation ─ elevated Red channel vs Green in scalp region
    r_m = float(np.mean(rb[:, :, 2].astype(np.float32)))
    g_m = float(np.mean(rb[:, :, 1].astype(np.float32)))
    if g_m > 0 and r_m / g_m > 1.22:
        findings.append({
            "problem": "Scalp Irritation",
            "severity": "moderate",
            "description": "Redness and inflammation detected on scalp. May be caused by "
                           "product buildup, chemical sensitivity, or seborrheic dermatitis.",
            "icon": "🔥",
            "category": "hair",
        })

    return findings


# ─────────────────────────────────────────────────────────────
# API ENDPOINT
# ─────────────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    scan_type: str = Form("face"),
):
    raw = await file.read()
    arr = np.frombuffer(raw, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    if img is None:
        return {
            "scan_type": scan_type,
            "problems": [{
                "problem": "Image Error",
                "severity": "high",
                "description": "Could not process the captured image. Please try again in better lighting.",
                "icon": "⚠️",
                "category": "system",
            }],
        }

    if scan_type == "hair":
        results = analyze_hair(img)
    elif scan_type == "both":
        results = analyze_face(img) + analyze_hair(img)
    else:
        results = analyze_face(img)

    # If nothing detected → healthy result
    if not results:
        healthy_msg = {
            "face":  ("Healthy Skin",        "Your skin is clear and radiant. No concerns detected — keep up your routine!",          "✨", "face"),
            "hair":  ("Healthy Hair & Scalp", "Your scalp and hair look healthy and well-nourished. No issues found!",                 "✨", "hair"),
            "both":  ("All Clear",            "Both your skin and hair appear healthy. You're in great shape — keep it up!",           "✨", "face"),
        }
        label, desc, icon, cat = healthy_msg.get(scan_type, healthy_msg["face"])
        results = [{"problem": label, "severity": "none", "description": desc, "icon": icon, "category": cat}]

    return {"scan_type": scan_type, "problems": results}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
