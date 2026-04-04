import mediapipe
import os

print(f"--- DIAGNOSTIC REPORT ---")
print(f"Mediapipe File Location: {mediapipe.__file__}")
print(f"Current Working Directory: {os.getcwd()}")
print(f"Does it have 'solutions'?: {hasattr(mediapipe, 'solutions')}")