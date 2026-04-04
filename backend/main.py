# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from analyzer import FaceAnalyzer
# import uvicorn

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# analyzer = FaceAnalyzer()

# @app.post("/analyze")
# async def analyze_route(request: Request):
#     image_data = await request.body()
#     return analyzer.analyze(image_data)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)





from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def analyze_skin_simply(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)
    
    if len(faces) == 0:
        return [" "]

    (x, y, w, h) = faces[0]
    face_gray = gray[y:y+h, x:x+w]
    face_hsv = hsv[y:y+h, x:x+w]
    
    findings = []

    # Oily Skin Check
    if np.max(face_gray[0:int(h*0.3), :]) > 242:
        findings.append("Your forehead looks a bit oily.")

    # Dark Circle Check
    under_eye = face_gray[int(h*0.45):int(h*0.55), :]
    if np.mean(under_eye) < 92:
        findings.append("You have some dark circles under your eyes.")

    # Pimple/Blemish Check
    texture = cv2.Laplacian(face_gray, cv2.CV_64F).var()
    if texture > 420:
        findings.append("We found some pimples or rough spots on your skin.")

    # Sun Tan Check
    if np.mean(face_hsv[:,:,1]) > 125:
        findings.append("Your skin shows signs of sun tanning.")

    if not findings:
        findings.append("Your skin looks perfectly clear and healthy!")
    
    return findings

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    buffer = await file.read()
    nparr = np.frombuffer(buffer, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return {"problems": analyze_skin_simply(img)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)