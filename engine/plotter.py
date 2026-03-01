import sympy as sp
import numpy as np
import pprint

def process_plot(equation_str: str) -> dict:
    """
    Parses an equation string, extracts variables, and evaluates points
    for Plotly.js to render.
    Supports y = f(x) (2D) and z = f(x, y) (3D).
    """
    try:
        from engine.solver import parse_equation
        
        lhs, rhs = parse_equation(equation_str)
        
        # Try to infer dependent and independent variables
        # Simple case: y = 2*x + 1. rhs is free of y, lhs is just y.
        free_symbols_lhs = list(lhs.free_symbols)
        free_symbols_rhs = list(rhs.free_symbols)
        
        all_symbols = list(sp.sympify(f"{lhs} - ({rhs})").free_symbols)
        
        if len(all_symbols) == 0:
            return {"error": "No variables found to plot."}
            
        if len(all_symbols) == 1:
            # 2D Plot: implicitly f(var) = 0, but usually we just evaluate the expression
            expr = lhs - rhs
            var = all_symbols[0]
            
            f = sp.lambdify(var, expr, 'numpy')
            x_vals = np.linspace(-10, 10, 400)
            y_vals = f(x_vals)
            
            return {
                "type": "2d",
                "x": x_vals.tolist(),
                "y": y_vals.tolist() if isinstance(y_vals, np.ndarray) else [y_vals]*len(x_vals),
                "xaxis_title": str(var),
                "yaxis_title": "f(" + str(var) + ")"
            }
            
        elif len(all_symbols) == 2:
            # 2D plot: e.g., y = x^2
            # Is LHS a single variable?
            if len(free_symbols_lhs) == 1 and lhs == free_symbols_lhs[0]:
                y_var = free_symbols_lhs[0]
                x_var = list(free_symbols_rhs)[0]
                expr = rhs
            elif len(free_symbols_rhs) == 1 and rhs == free_symbols_rhs[0]:
                y_var = free_symbols_rhs[0]
                x_var = list(free_symbols_lhs)[0]
                expr = lhs
            else:
                # Implicit plot, highly complex. Just evaluate z=f(x,y)
                expr = lhs - rhs
                x_var, y_var = all_symbols[0], all_symbols[1]
                
            f = sp.lambdify(x_var, expr, 'numpy')
            x_vals = np.linspace(-10, 10, 400)
            y_vals = f(x_vals)
            
            return {
                "type": "2d",
                "x": x_vals.tolist(),
                "y": y_vals.tolist() if isinstance(y_vals, np.ndarray) else [y_vals]*len(x_vals),
                "xaxis_title": str(x_var),
                "yaxis_title": str(y_var)
            }
            
        elif len(all_symbols) == 3:
            # 3D surface plot: e.g. z = sin(x) * cos(y)
             if len(free_symbols_lhs) == 1 and lhs == free_symbols_lhs[0]:
                z_var = free_symbols_lhs[0]
                x_var, y_var = free_symbols_rhs[0], free_symbols_rhs[1]
                expr = rhs
             else:
                expr = lhs - rhs
                x_var, y_var, z_var = all_symbols[0], all_symbols[1], all_symbols[2]

             f = sp.lambdify((x_var, y_var), expr, 'numpy')
             
             x_vals = np.linspace(-5, 5, 50)
             y_vals = np.linspace(-5, 5, 50)
             X, Y = np.meshgrid(x_vals, y_vals)
             Z = f(X, Y)
             
             return {
                 "type": "3d",
                 "x": x_vals.tolist(),
                 "y": y_vals.tolist(),
                 "z": Z.tolist(),
                 "xaxis_title": str(x_var),
                 "yaxis_title": str(y_var),
                 "zaxis_title": str(z_var)
             }
        else:
            return {"error": "Equations with more than 3 variables cannot be plotted easily."}
            
    except Exception as e:
        return {"error": str(e)}
