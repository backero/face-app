import cv2
import numpy as np

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def analyze_skin(img: np.ndarray) -> list:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    if len(faces) == 0:
        return ["No face detected. Position your face clearly in frame and try again."]

    (x, y, w, h) = faces[0]
    face_gray = gray[y : y + h, x : x + w]
    face_hsv = hsv[y : y + h, x : x + w]

    findings = []

    if np.max(face_gray[0 : int(h * 0.3), :]) > 242:
        findings.append("Your forehead looks a bit oily.")

    under_eye = face_gray[int(h * 0.45) : int(h * 0.55), :]
    if np.mean(under_eye) < 92:
        findings.append("You have some dark circles under your eyes.")

    texture = cv2.Laplacian(face_gray, cv2.CV_64F).var()
    if texture > 420:
        findings.append("We found some pimples or rough spots on your skin.")

    if np.mean(face_hsv[:, :, 1]) > 125:
        findings.append("Your skin shows signs of sun tanning.")

    if not findings:
        findings.append("Your skin looks perfectly clear and healthy!")

    return findings
