import pytesseract
from PIL import Image
import re
import os
import google.generativeai as genai
import json

# Explicitly set Tesseract path for Windows (as fallback)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class STEMScanner:
    def __init__(self):
        # Tesseract configuration
        self.config = '--oem 3 --psm 6'
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def scan_image(self, image_path):
        """
        Extract text from an image using Gemini AI (primary) or Tesseract OCR (fallback).
        """
        if self.model:
            try:
                print(f"[OCR] Using Gemini for scanning: {image_path}")
                img = Image.open(image_path)
                
                # We ask Gemini to return JSON for both the full text and individual questions
                prompt = """Extract all text from this image. 
                Identify if there are multiple distinct STEM / exam questions.
                Return the result in JSON format:
                {
                  "full_text": "the entire text content",
                  "questions": ["Question 1 text", "Question 2 text", ...]
                }
                If it's just one problem, the questions array should have one item.
                Return ONLY the JSON block."""
                
                response = self.model.generate_content([prompt, img])
                text_response = response.text.strip()
                
                # Clean up JSON from response
                if "```json" in text_response:
                    text_response = text_response.split("```json")[1].split("```")[0].strip()
                elif "```" in text_response:
                    text_response = text_response.split("```")[1].split("```")[0].strip()
                
                try:
                    data = json.loads(text_response)
                    self.last_extraction = data.get("questions", [])
                    return data.get("full_text", text_response)
                except:
                    # If JSON parsing fails, return the raw text
                    return text_response
            except Exception as e:
                print(f"[OCR] Gemini Error, falling back to Tesseract: {e}")

        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, config=self.config)
            return text.strip()
        except Exception as e:
            return f"[Error] Scanning failed: {str(e)}"

    def extract_questions(self, text):
        """
        Extract individual questions from the scanned text.
        """
        # If we just came from a successful Gemini scan, we might already have the questions
        if hasattr(self, 'last_extraction') and self.last_extraction:
            qs = self.last_extraction
            self.last_extraction = [] # Reset
            return qs

        if not text:
            return []

        # Fallback split logic
        patterns = [
            r'\n\s*\d+[\.\)]\s+',
            r'\n\s*Q(?:uestion)?\s*\.?\s*\d+\s*[\.\:\-]?\s*',
            r'\n\s*\[\d+\]\s*'
        ]
        combined_pattern = '|'.join(patterns)
        if re.match(r'^(?:\d+[\.\)]|Q(?:uestion)?\s*\d+)', text.strip()):
            text = "\n" + text
            
        parts = re.split(combined_pattern, text)
        questions = [q.strip() for q in parts if q.strip() and len(q.strip()) > 5]
        
        if not questions and text.strip():
            questions = [text.strip()]
            
        return questions

scanner = STEMScanner()
