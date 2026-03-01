from fastapi import FastAPI, APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
import shutil
import tempfile
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(title="STEM Engine API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    equation: str
    solve_for: Optional[str] = None
    known_variables: Optional[Dict[str, str]] = None
    explanation_level: Optional[str] = "Step by Step"

class PlotRequest(BaseModel):
    equation: str

@app.post("/api/solve")
async def solve_equation(request: SolveRequest):
    from engine.solver import process_equation, _is_natural_language
    from engine.word_problem_solver import solve_word_problem

    eq = request.equation.strip()
    if _is_natural_language(eq):
        return solve_word_problem(eq, request.explanation_level)
    return process_equation(eq, request.solve_for, request.known_variables, request.explanation_level)

@app.post("/api/plot")
async def generate_plot(request: PlotRequest):
    from engine.plotter import process_plot
    return process_plot(request.equation)

@app.get("/api/formulas")
async def get_formulas():
    import json
    # Use BASE_DIR for finding data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "data", "formulas.json")
    try:
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                return json.load(f)
        return {"categories": []}
    except Exception:
        return {"categories": []}

@app.get("/")
@app.get("/api")
def read_root():
    return {"status": "ok", "message": "STEM Engine API running on Vercel v2"}
