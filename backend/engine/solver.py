import sympy as sp
from typing import Dict, Any, Tuple, Optional
import re


def _is_natural_language(text: str) -> bool:
    """Heuristic: detect if the input is a word problem / NL sentence rather than an equation."""
    text = text.strip()
    # Contains question mark → likely NL
    if '?' in text:
        return True
    words = text.split()
    # More than 8 words that aren't joined by operators → likely NL
    if len(words) > 8:
        # Count alphabetic characters vs math operators
        alpha_chars = sum(c.isalpha() for c in text)
        total_printable = max(len(text.replace(' ', '')), 1)
        if alpha_chars / total_printable > 0.65:
            return True
    # Starts with an article or common NL word
    first_word = words[0].lower() if words else ''
    nl_starters = {'a', 'an', 'the', 'find', 'calculate', 'what', 'how', 'if', 'given', 'determine', 'compute', 'prove', 'show', 'explain'}
    if first_word in nl_starters and len(words) > 5:
        return True
    return False


def parse_equation(eq_str: str) -> Tuple[sp.Expr, sp.Expr]:
    """Parse a string equation like 'E = m*c**2' into LHS and RHS expressions."""
    if "=" not in eq_str:
        # Assume it's an expression set to 0 if no equals sign
        return sp.sympify(eq_str), sp.Integer(0)
    
    lhs_str, rhs_str = eq_str.split("=", 1)
    lhs = sp.sympify(lhs_str.strip())
    rhs = sp.sympify(rhs_str.strip())
    return lhs, rhs

def generate_latex_steps(original_eq: sp.Eq, solve_var: sp.Symbol, solutions: list, substituted: list = None, final_vals: list = None, explanation_level: str = "Step by Step") -> list:
    """Generate KaTeX compatible LaTeX steps for the UI based on explanation level."""
    steps = []
    
    # Levels: 'Quick', 'Step by Step', 'Detailed', 'Proof', 'ELI10'
    level = explanation_level.strip()
    
    if level == "Quick":
        # Just show the final answer
        for i, _ in enumerate(solutions):
            if final_vals and i < len(final_vals):
                steps.append({
                    "description": "Answer:",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(final_vals[i])}"
                })
            else:
                 steps.append({
                    "description": "Answer:",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(solutions[i])}"
                })
        return steps

    elif level == "ELI10":
        # Explain like I'm 10: Simple terms
        steps.append({
            "description": "Here is the math puzzle we are starting with:",
            "latex": f"{sp.latex(original_eq.lhs)} = {sp.latex(original_eq.rhs)}"
        })
        for i, sol in enumerate(solutions):
            steps.append({
                "description": f"To solve for {sp.latex(solve_var)}, we move everything else to the other side:",
                "latex": f"{sp.latex(solve_var)} = {sp.latex(sol)}"
            })
            if substituted and i < len(substituted):
                steps.append({
                    "description": "Now we plug in the numbers we know into our new formula:",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(substituted[i])}"
                })
            if final_vals and i < len(final_vals):
                steps.append({
                    "description": "And we get our final answer!",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(final_vals[i])}"
                })
        return steps
        
    elif level == "Detailed" or level == "Proof":
        # Provide more verbose descriptions
        steps.append({
            "description": "Given the initial equation:",
            "latex": f"{sp.latex(original_eq.lhs)} = {sp.latex(original_eq.rhs)}"
        })
        for i, sol in enumerate(solutions):
            steps.append({
                "description": f"Applying algebraic operations to isolate the variable {sp.latex(solve_var)} yields Solution {i+1}:",
                "latex": f"{sp.latex(solve_var)} = {sp.latex(sol)}"
            })
            if substituted and i < len(substituted):
                steps.append({
                    "description": "Substituting the known variable quantities into the isolated expression:",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(substituted[i])}"
                })
            if final_vals and i < len(final_vals):
                steps.append({
                    "description": "Evaluating the numerical expression results in the final computed value:",
                    "latex": f"{sp.latex(solve_var)} = {sp.latex(final_vals[i])}"
                })
        return steps

    # Default 'Step by Step'
    steps.append({
        "description": "Original Equation:",
        "latex": f"{sp.latex(original_eq.lhs)} = {sp.latex(original_eq.rhs)}"
    })
    
    for i, sol in enumerate(solutions):
        steps.append({
            "description": f"Rearranged for {sp.latex(solve_var)} (Solution {i+1}):",
            "latex": f"{sp.latex(solve_var)} = {sp.latex(sol)}"
        })
        
        if substituted and i < len(substituted):
            steps.append({
                "description": "Substitute known values:",
                "latex": f"{sp.latex(solve_var)} = {sp.latex(substituted[i])}"
            })
            
        if final_vals and i < len(final_vals):
            steps.append({
                "description": "Final Value:",
                "latex": f"{sp.latex(solve_var)} = {sp.latex(final_vals[i])}"
            })
            
    return steps

def process_equation(equation_str: str, solve_for_str: Optional[str] = None, known_vars: Optional[Dict[str, str]] = None, explanation_level: str = "Step by Step") -> Dict[str, Any]:
    """
    Main entry point for solving an equation.
    Uses SymPy to parse, optionally rearrange, and optionally substitute known values.
    """
    # --- Natural language detection ---
    if _is_natural_language(equation_str):
        return {
            "success": False,
            "error": (
                "This looks like a word problem. The symbolic solver needs a math equation.\n\n"
                "Please rephrase as an equation, for example:\n"
                "  • m1*v1 = (m1 + m2)*v_f   (conservation of momentum)\n"
                "  • F = m*a\n"
                "  • v = u + a*t\n\n"
                "Tip: Use 'Mark as PYQ' to save this question for future reference, "
                "then enter the corresponding formula to solve numerically."
            )
        }

    try:
        lhs, rhs = parse_equation(equation_str)
        eq = sp.Eq(lhs, rhs)
        
        free_symbols = list(eq.free_symbols)
        
        if not solve_for_str:
            # If not specified, look for a variable that is isolated on LHS or RHS, or just pick the first one.
            if len(lhs.free_symbols) == 1 and not lhs.is_number:
                solve_var = list(lhs.free_symbols)[0]
            elif len(rhs.free_symbols) == 1 and not rhs.is_number:
                solve_var = list(rhs.free_symbols)[0]
            elif len(free_symbols) > 0:
                solve_var = free_symbols[0]
            else:
                return {"error": "No variables found in equation."}
        else:
            solve_var = sp.Symbol(solve_for_str)
            if solve_var not in free_symbols:
                return {"error": f"Variable '{solve_for_str}' not found in the parsed equation."}

        # Solve for the target variable symbolically
        try:
            solutions = sp.solve(eq, solve_var)
        except NotImplementedError:
             return {"error": "Equation is too complex to solve symbolically for this variable."}

        if not solutions:
            return {"error": f"Could not solve symbolically for {solve_for_str}."}

        # Handling known variables
        substituted_exprs = []
        final_values = []
        
        if known_vars:
            # Convert string known variables to sympy symbols/values
            # Note: At this stage we are ignoring units in standard substitute, 
            # unit translation happens around this engine.
            subs_dict = {}
            for k, v in known_vars.items():
                # Extract just the numeric part if it has units via simple stripping for pure sympy evaluation
                # In full integration, Pint handles parsing and gives us plain magnitudes here.
                sym = sp.Symbol(k)
                try: # try converting direct numeric
                    val = float(v)
                except ValueError:
                     # if it fails, maybe it's another expression
                     val = sp.sympify(v)
                subs_dict[sym] = val

            for sol in solutions:
                subbed = sol.subs(subs_dict)
                substituted_exprs.append(subbed)
                try:
                    # try evaluating to a float
                    final_values.append(subbed.evalf())
                except:
                     final_values.append(subbed)

        steps = generate_latex_steps(eq, solve_var, solutions, substituted_exprs if known_vars else None, final_values if known_vars else None, explanation_level)
        
        return {
            "success": True,
            "solve_for": str(solve_var),
            "solutions": [str(s) for s in solutions],
            "steps": steps,
            "final_values": [str(v) for v in (final_values if known_vars else solutions)]
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
