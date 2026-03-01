from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
import shutil
import tempfile
from dotenv import load_dotenv
load_dotenv()

router = APIRouter()

class SolveRequest(BaseModel):
    equation: str
    solve_for: Optional[str] = None
    known_variables: Optional[Dict[str, str]] = None # Example: {"m": "2 kg"}
    explanation_level: Optional[str] = "Step by Step"

class PlotRequest(BaseModel):
    equation: str

@router.post("/solve")
async def solve_equation(request: SolveRequest):
    from engine.solver import process_equation, _is_natural_language
    from engine.word_problem_solver import solve_word_problem

    eq = request.equation.strip()

    # Route natural language to the word problem solver
    if _is_natural_language(eq):
        result = solve_word_problem(eq, request.explanation_level)
        return result

    # Otherwise use the symbolic SymPy engine
    return process_equation(eq, request.solve_for, request.known_variables, request.explanation_level)

@router.post("/plot")
async def generate_plot(request: PlotRequest):
    from engine.plotter import process_plot
    return process_plot(request.equation)

@router.get("/formulas")
async def get_formulas():
    import json
    import os
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "formulas.json")
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"categories": []}

@router.get("/formulas/search")
async def search_formulas(q: str):
    import json
    import os
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "formulas.json")
    results = []
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
            q = q.lower()
            for cat in data.get("categories", []):
                for topic in cat.get("topics", []):
                    for form in topic.get("formulas", []):
                        if (q in form["name"].lower() or 
                            q in form["description"].lower() or 
                            any(q in tag.lower() for tag in form.get("tags", [])) or
                            any(q in str(var).lower() for var in form.get("variables", {}))):
                            results.append(form)
    except FileNotFoundError:
        pass
    return {"results": results}

@router.post("/scan-image")
async def scan_image(file: UploadFile = File(...)):
    from engine.scanner import scanner
    
    # Save uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    print(f"[OCR] Scanning image: {tmp_path}")
    try:
        text = scanner.scan_image(tmp_path)
        print(f"[OCR] Scanned text length: {len(text)}")
        
        # Check if scanning failed with a message
        if text.startswith("[Error"):
            return {"success": False, "error": text}
            
        questions = scanner.extract_questions(text)
        
        return {
            "success": True,
            "text": text,
            "questions": questions,
            "is_paper": len(questions) > 1
        }
    finally:
        # Clean up
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

class AIRequest(BaseModel):
    problem: Optional[str] = None
    prompt: Optional[str] = None
    subject: Optional[str] = "General STEM"
    level: Optional[str] = "Detailed"
    language: Optional[str] = "English"
    provider: Optional[str] = "gemini" # Default changed to gemini
    model: Optional[str] = None

@router.post("/ai")
async def solve_with_ai(request: AIRequest):
    print(f"[AI] Request: provider={request.provider}, problem={request.problem[:50] if request.problem else 'None'}")
    
    import requests
    import json
    
    language = request.language
    subject = request.subject
    level = request.level
    problem = request.problem
    
    # Structure requirement
    system_prompt = f"""You are an AI STEM Intelligence Engine.
            Always provide the solution in this specific structure:
            1. Subject: Identify the field (Physics, Chemistry, Math, Biology)
            2. Formula: The main LaTeX formula used
            3. Variable Explanation: Define all variables and units as an ARRAY of objects
            4. Step-by-Step Solution: Show clear logical steps with LaTeX
            5. Final Answer: The result with units as a string
            6. Concept Explanation: A brief summary
            7. Related Concepts: Array of 3 topics
            8. Next Steps: Array of 3 topics
            9. Real World Applications: Array of 3 objects
            
            CRITICAL: Respond in {language}. Keys must be English.
            Return response in VALID JSON format ONLY.
            Example: {{"subject": "...", "formula": "...", "variable_explanation": [...], "steps": [...], "final_answer": "...", "concept_explanation": "..."}}"""

    user_prompt = f"Solve this for {subject} at {level} level in {language}: {problem}"

    # --- PROVIDER: GOOGLE GEMINI ---
    if request.provider == "gemini":
        try:
            import google.generativeai as genai
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                return {"success": False, "error": "GEMINI_API_KEY not found"}
            
            genai.configure(api_key=api_key)
            # Use gemini-1.5-flash which is great for scanning too
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Combine system prompt with user prompt for easier handling in some versions
            full_prompt = f"{system_prompt}\n\nUser Question: {user_prompt}"
            response = model.generate_content(full_prompt)
            generated_text = response.text
            return _process_ai_response(generated_text)
        except Exception as e:
            print(f"[AI] Gemini Error: {e}")
            # Fallback to HF if Gemini fails
            request.provider = "huggingface"

    # --- PROVIDER: HUGGING FACE (with multi-model fallback) ---
    HF_TOKEN = os.getenv("HF_TOKEN")
    if not HF_TOKEN:
        return {"success": False, "error": "HF_TOKEN not found"}

    models_to_try = [
        "Qwen/Qwen2.5-7B-Instruct",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "meta-llama/Llama-3.2-3B-Instruct"
    ]
    
    # If a specific model was requested, put it first
    if request.model:
        models_to_try.insert(0, request.model)

    last_error = ""
    for model_id in models_to_try:
        print(f"[AI] Trying Hugging Face model: {model_id}")
        payload = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "parameters": {"max_new_tokens": 1500, "temperature": 0.1}
        }
        
        try:
            resp = requests.post(
                "https://router.huggingface.co/v1/chat/completions",
                headers={"Authorization": f"Bearer {HF_TOKEN}"},
                json=payload,
                timeout=25
            )
            
            if resp.status_code == 200:
                generated_text = resp.json()['choices'][0]['message']['content']
                return _process_ai_response(generated_text)
            elif resp.status_code == 503:
                print(f"[AI] Model {model_id} is loading, trying next...")
                continue
            else:
                last_error = f"HF API Error ({resp.status_code}): {resp.text}"
                print(f"[AI] {last_error}")
        except Exception as e:
            last_error = str(e)
            print(f"[AI] Request error with {model_id}: {e}")
            continue

    return {"success": False, "error": f"All AI models failed. Last error: {last_error}"}

def _process_ai_response(generated_text: str):
    import json
    # Clean up JSON
    clean_json = generated_text.strip()
    if "```" in clean_json:
        parts = clean_json.split("```")
        for part in parts:
            if "{" in part and "}" in part:
                clean_json = part
                break
        if clean_json.startswith("json"):
            clean_json = clean_json[4:]
    
    try:
        ai_res = json.loads(clean_json)
    except json.JSONDecodeError:
        if "{" in clean_json and "}" in clean_json:
            start = clean_json.find("{")
            end = clean_json.rfind("}") + 1
            ai_res = json.loads(clean_json[start:end])
        else:
            return {"success": False, "error": "Invalid JSON from AI", "raw": generated_text}

    # Map keys for robustness
    def getter(keys, default=None):
        for k in keys:
            if k in ai_res: return ai_res[k]
        return default

    subject = getter(["subject", "Subject", "problem_type"], "General STEM")
    formula = getter(["formula", "Formula", "formula_used"], "")
    steps = getter(["steps", "Steps", "solution_steps"], [])
    final_answer = getter(["final_answer", "Final Answer", "answer", "result"], "Check calculation")
    explanation = getter(["concept_explanation", "Concept Explanation", "explanation", "description"], "")
    
    # Standardize steps format
    clean_steps = []
    for s in steps:
        if isinstance(s, dict):
            clean_steps.append({
                "description": s.get("description", "Next Step"),
                "latex": s.get("latex", "")
            })
        elif isinstance(s, str):
            clean_steps.append({"description": s, "latex": ""})

    # Standardize variables format
    vars_raw = getter(["variable_explanation", "Variables", "formula_variables"], [])
    formatted_vars = []
    if isinstance(vars_raw, list):
        for v in vars_raw:
            if isinstance(v, dict):
                formatted_vars.append({
                    "name": v.get("name", "?"),
                    "description": v.get("description", ""),
                    "unit": v.get("unit", "")
                })
            elif isinstance(v, str):
                formatted_vars.append({"name": "?", "description": v, "unit": ""})
    elif isinstance(vars_raw, str):
        formatted_vars = [{"name": "Info", "description": vars_raw, "unit": ""}]

    return {
        "success": True,
        **ai_res,
        "subject": subject,
        "problem_type": subject,
        "formula_used": formula,
        "steps": clean_steps,
        "final_answer": final_answer,
        "final_values": [final_answer],
        "explanation": explanation,
        "formula_variables": formatted_vars,
        "related_concepts": getter(["related_concepts"], []),
        "next_steps": getter(["next_steps"], []),
        "real_world_applications": getter(["real_world_applications"], [])
    }
