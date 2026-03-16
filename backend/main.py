from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import uvicorn

from config import ALLOWED_ORIGINS, HOST, PORT
from analyzer import analyze_skin

app = FastAPI(title="TREYFA PRO API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    buffer = await file.read()

    if len(buffer) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image too large. Max size is 10MB.")

    nparr = np.frombuffer(buffer, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=422, detail="Could not decode image.")

    problems = analyze_skin(img)
    return {"problems": problems}


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=False)
