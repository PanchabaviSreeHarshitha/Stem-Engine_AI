"""
Word Problem Solver
Parses natural language physics/math problems, extracts quantities,
identifies problem type, and solves using SymPy.
"""
import re
import sympy as sp
from typing import Dict, Any, Optional, List, Tuple


# ──────────────────────────────────────────────────────────────
# Unit normalisation helpers
# ──────────────────────────────────────────────────────────────

def _extract_numbers(text: str) -> List[float]:
    """Return all numbers found in text (handles negatives, decimals)."""
    return [float(m) for m in re.findall(r'-?\d+\.?\d*', text)]


def _find_quantity(text: str, patterns: List[str]) -> Optional[float]:
    """
    Search text for the first pattern match and return the adjacent numeric value.
    patterns: list of keyword sequences to look for near a number.
    """
    text_lower = text.lower()
    for pat in patterns:
        # look for number immediately before or after each pattern keyword
        rx = rf'(\d+\.?\d*)\s*(?:{pat})|(?:{pat})\s*(?:of\s+|is\s+|=\s*)?(\d+\.?\d*)'
        m = re.search(rx, text_lower)
        if m:
            val = m.group(1) or m.group(2)
            if val:
                return float(val)
    return None


# ──────────────────────────────────────────────────────────────
# Problem type detectors
# ──────────────────────────────────────────────────────────────

def _detect_problem_type(text: str) -> str:
    t = text.lower()
    # Chemistry — check FIRST before physics (overlapping keywords like 'mole', 'gas')
    if any(w in t for w in ['molar mass', 'molecular weight', 'molecular mass', 'formula mass',
                             'ph ', '\bph\b', 'acidic', 'basic', '[h+]', 'hydroxide',
                             'molarity', 'concentration', 'dissolv', 'dilut',
                             'stoichiom', 'mole of', 'moles of', 'grams of', 'mol of',
                             'enthalpy', 'thermochem', 'specific heat',
                             'h2o', 'nacl', 'hcl', 'naoh', 'h2so4', 'co2', 'nh3', 'ch4',
                             'glucose', 'sodium', 'chloride', 'sulfuric', 'nitric', 'acetic',
                             'chemical', 'compound', 'element', 'periodic', 'atom', 'molecule',
                             'acid', 'base', 'salt', 'buffer', 'titrat', 'equilibrium constant']):
        return 'chemistry'
    # Collision / momentum
    if any(w in t for w in ['stick', 'collide', 'collision', 'momentum', 'inelastic', 'elastic', 'combine']):
        return 'momentum'
    # Kinematics
    if any(w in t for w in ['velocity', 'acceleration', 'distance', 'displacement', 'initial', 'final', 'rest', 'speed', 'decelerat', 'averag']):
        return 'kinematics'
    # Projectile
    if any(w in t for w in ['projectile', 'launch', 'angle', 'range', 'height', 'thrown', 'horizontal', 'vertical']):
        return 'projectile'
    # Newton / Force
    if any(w in t for w in ['force', 'newton', 'push', 'pull', 'friction', 'weight', 'tension']):
        return 'force'
    # Work / Energy
    if any(w in t for w in ['work', 'energy', 'joule', 'power', 'kinetic', 'potential']):
        return 'energy'
    # Circuit explicitly
    if any(w in t for w in ['series circuit', 'parallel circuit', 'circuit series', 'circuit parallel']):
        return 'circuit'
    # Ohm / electrical
    if any(w in t for w in ['voltage', 'current', 'resistance', 'ohm', 'circuit', 'ampere', 'volt']):
        return 'electricity'
    # Gas law
    if any(w in t for w in ['pressure', 'gas', 'volume', 'temperature', 'mole', 'boyle', 'charles']):
        return 'gas_law'
    # Gravity / weight
    if any(w in t for w in ['gravitational', 'gravity', 'weight', 'planet', 'orbital']):
        return 'gravity'
    # Organic explicitly
    if 'organic chemistry:' in t:
        return 'organic'
    return 'unknown'


# ──────────────────────────────────────────────────────────────
# Individual solvers
# ──────────────────────────────────────────────────────────────

def _solve_momentum(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    nums = _extract_numbers(text)

    m1 = _find_quantity(text, [r'kg', r'mass'])
    v1 = _find_quantity(text, [r'm/s', r'km/h', r'velocity', r'speed', r'moving at', r'moving with'])

    # Find second mass
    second_mass_match = re.search(r'(\d+\.?\d*)\s*kg\D+?(\d+\.?\d*)\s*kg', text, re.IGNORECASE)
    if second_mass_match:
        m1 = float(second_mass_match.group(1))
        m2 = float(second_mass_match.group(2))
    else:
        # try to get two distinct kg values from all numbers
        kg_vals = [float(m) for m in re.findall(r'(\d+\.?\d*)\s*kg', text, re.IGNORECASE)]
        m1 = kg_vals[0] if len(kg_vals) > 0 else None
        m2 = kg_vals[1] if len(kg_vals) > 1 else 0

    speed_vals = [float(m) for m in re.findall(r'(\d+\.?\d*)\s*m/s', text, re.IGNORECASE)]
    v1 = speed_vals[0] if len(speed_vals) > 0 else None
    v2 = speed_vals[1] if len(speed_vals) > 1 else 0

    is_rest = 'rest' in t or 'stationary' in t or 'at rest' in t
    if is_rest and v2 is None:
        v2 = 0

    is_inelastic = any(w in t for w in ['stick', 'combine', 'together', 'inelastic'])
    is_elastic = 'elastic' in t

    if m1 is None or v1 is None:
        return {'success': False, 'error': 'Could not extract mass or velocity from the problem.'}

    pM1, pV1, pM2, pV2, pVf = sp.symbols('m1 v1 m2 v2 v_f')

    if is_inelastic:
        # m1*v1 + m2*v2 = (m1+m2)*v_f
        eq = sp.Eq(m1 * v1 + m2 * (v2 or 0), (m1 + m2) * pVf)
        sol = sp.solve(eq, pVf)
        v_final = float(sol[0])
        if explanation_level == "Quick":
            steps = [{'description': 'Final Answer:', 'latex': fr'v_f = {round(v_final, 4)}\ \text{{m/s}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'We are looking at two things crashing and sticking together!', 'latex': r'\text{Conservation of Momentum}'},
                {'description': 'The total "oomph" before the crash equals the total "oomph" after:', 'latex': r'm_1 v_1 + m_2 v_2 = (m_1 + m_2)\, v_f'},
                {'description': 'Plugging in our numbers:', 'latex': fr'{m1} \times {v1} + {m2} \times {v2 or 0} = ({m1} + {m2})\, v_f'},
                {'description': 'Finding the final speed:', 'latex': fr'v_f = \dfrac{{{m1 * v1 + m2 * (v2 or 0)}}}{{{m1 + m2}}}'},
                {'description': 'Final Answer:', 'latex': fr'v_f = {round(v_final, 4)}\ \text{{m/s}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'Problem Type: Perfectly Inelastic Collision', 'latex': r'\text{Conservation of Momentum}'},
                {'description': 'According to the law of conservation of momentum, the total momentum before the collision equals the total momentum after:', 'latex': r'p_{initial} = p_{final}'},
                {'description': 'Expanding the terms for an inelastic collision where the masses combine:', 'latex': r'm_1 v_1 + m_2 v_2 = (m_1 + m_2)\, v_f'},
                {'description': 'Substitute the known physical quantities:', 'latex': fr'{m1} \times {v1} + {m2} \times {v2 or 0} = ({m1} + {m2})\, v_f'},
                {'description': 'Algebraically isolate the final velocity (v_f):', 'latex': fr'v_f = \dfrac{{{m1 * v1 + m2 * (v2 or 0)}}}{{{m1 + m2}}}'},
                {'description': 'Calculate the final numerical value:', 'latex': fr'v_f = {round(v_final, 4)}\ \text{{m/s}}'},
            ]
        else: # Step by Step
            steps = [
                {'description': 'Problem Type: Perfectly Inelastic Collision', 'latex': r'\text{Conservation of Momentum}'},
                {'description': 'Formula:', 'latex': r'm_1 v_1 + m_2 v_2 = (m_1 + m_2)\, v_f'},
                {'description': 'Substitute values:', 'latex': fr'{m1} \times {v1} + {m2} \times {v2 or 0} = ({m1} + {m2})\, v_f'},
                {'description': 'Solve for final velocity:', 'latex': fr'v_f = \dfrac{{{m1 * v1 + m2 * (v2 or 0)}}}{{{m1 + m2}}}'},
                {'description': 'Final Answer:', 'latex': fr'v_f = {round(v_final, 4)}\ \text{{m/s}}'},
            ]
        
        return {
            'success': True,
            'problem_type': 'Perfectly Inelastic Collision',
            'formula_used': f'm1*v1 + m2*v2 = (m1+m2)*v_f',
            'given': {'m1': m1, 'v1': v1, 'm2': m2, 'v2': v2 or 0},
            'solve_for': 'v_f',
            'steps': steps,
            'final_values': [f'{round(v_final, 4)} m/s'],
            'solutions': [str(round(v_final, 4))]
        }

    return {'success': False, 'error': 'Elastic collision solver not yet implemented. Try entering the formula directly: m1*v1 + m2*v2 = m1*v1f + m2*v2f'}


def _solve_kinematics(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()

    # Extract quantities
    u_val = _find_quantity(text, [r'initial velocity', r'initial speed', r'starts? at', r'starts? with', r'u\s*='])
    v_val = _find_quantity(text, [r'final velocity', r'final speed', r'reaches?', r'v\s*='])
    a_val = _find_quantity(text, [r'acceleration', r'deceleration', r'a\s*='])
    t_val = _find_quantity(text, [r'seconds?', r'time', r't\s*='])
    s_val = _find_quantity(text, [r'distance', r'displacement', r'travels?', r'covers?', r'metres?', r'meters?', r's\s*='])

    if 'rest' in t and u_val is None:
        u_val = 0
    if 'deceler' in t and a_val:
        a_val = -a_val

    u, v, a, t_sym, s = sp.symbols('u v a t s')
    knowns = {}
    if u_val is not None: knowns[u] = u_val
    if v_val is not None: knowns[v] = v_val
    if a_val is not None: knowns[a] = a_val
    if t_val is not None: knowns[t_sym] = t_val
    if s_val is not None: knowns[s] = s_val

    equations = [
        sp.Eq(v, u + a * t_sym),
        sp.Eq(s, u * t_sym + sp.Rational(1, 2) * a * t_sym**2),
        sp.Eq(v**2, u**2 + 2 * a * s),
    ]

    # Find which variable is unknown
    all_vars = {u, v, a, t_sym, s}
    unknowns = all_vars - set(knowns.keys())

    for target in unknowns:
        for eq in equations:
            free = eq.free_symbols
            if target in free and free - {target} <= set(knowns.keys()):
                subbed = eq.subs(knowns)
                sols = sp.solve(subbed, target)
                if sols:
                    # prefer positive real solution
                    sol = next((s for s in sols if s.is_real and s >= 0), sols[0])
                    val = float(sol.evalf())

                    var_name = str(target)
                    label_map = {'u': 'Initial Velocity', 'v': 'Final Velocity',
                                 'a': 'Acceleration', 't': 'Time', 's': 'Displacement'}
                    latex_map = {'u': 'u', 'v': 'v', 'a': 'a', 't': 't', 's': 's'}

                    if explanation_level == "Quick":
                        steps = [{'description': f'{label_map.get(var_name, var_name)}:', 'latex': fr'{latex_map.get(var_name, var_name)} = {round(val, 4)}'}]
                    elif explanation_level == "ELI10":
                        steps = [
                            {'description': 'We are looking at how things move (Kinematics)', 'latex': r'\text{Equations of Motion}'},
                            {'description': 'The formula that connects what we know to what we want is:', 'latex': sp.latex(eq)},
                            {'description': 'Putting our numbers in:', 'latex': sp.latex(subbed)},
                            {'description': f'Finding the answer for {label_map.get(var_name, var_name)}:', 'latex': fr'{latex_map.get(var_name, var_name)} = {round(val, 4)}'},
                        ]
                    elif explanation_level in ["Detailed", "Proof"]:
                        steps = [
                            {'description': 'Problem Domain: 1D Kinematics', 'latex': r'\text{Equations of Motion}'},
                            {'description': 'Selecting the appropriate kinematic equation based on known quantities:', 'latex': sp.latex(eq)},
                            {'description': 'Substituting the previously identified known variables into the equation:', 'latex': sp.latex(subbed)},
                            {'description': f'Algebraically evaluating for the unknown variable {label_map.get(var_name, var_name)}:', 'latex': fr'{latex_map.get(var_name, var_name)} = {round(val, 4)}'},
                        ]
                    else: # Step by Step
                        steps = [
                            {'description': 'Problem Type: Kinematics', 'latex': r'\text{Equations of Motion}'},
                            {'description': 'Using equation:', 'latex': sp.latex(eq)},
                            {'description': 'Substitute known values:', 'latex': sp.latex(subbed)},
                            {'description': f'Solving for {label_map.get(var_name, var_name)}:',
                             'latex': fr'{latex_map.get(var_name, var_name)} = {round(val, 4)}'},
                        ]
                    return {
                        'success': True,
                        'problem_type': 'Kinematics',
                        'formula_used': str(eq),
                        'given': {str(k): float(kv) for k, kv in knowns.items()},
                        'solve_for': var_name,
                        'steps': steps,
                        'final_values': [f'{round(val, 4)}'],
                        'solutions': [str(round(val, 4))]
                    }

    return {'success': False, 'error': 'Could not extract enough information to solve this kinematics problem.\n\nTry providing at least 3 of: initial velocity (u), final velocity (v), acceleration (a), time (t), distance (s).'}


def _solve_force(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    m_val = _find_quantity(text, [r'kg', r'mass of', r'mass is'])
    a_val = _find_quantity(text, [r'm/s[\^²2]', r'acceleration', r'a\s*='])
    f_val = _find_quantity(text, [r'newton', r'force of', r'force is', r'n\b'])

    F, m, a = sp.symbols('F m a')
    knowns = {}
    if m_val is not None: knowns[m] = m_val
    if a_val is not None: knowns[a] = a_val
    if f_val is not None: knowns[F] = f_val

    eq = sp.Eq(F, m * a)
    all_vars = {F, m, a}
    unknowns = all_vars - set(knowns.keys())

    if len(unknowns) == 1:
        target = list(unknowns)[0]
        subbed = eq.subs(knowns)
        sols = sp.solve(subbed, target)
        if sols:
            val = float(sols[0].evalf())
            label = {'F': 'Force (N)', 'm': 'Mass (kg)', 'a': 'Acceleration (m/s²)'}
            unit = {'F': 'N', 'm': 'kg', 'a': 'm/s²'}
            if explanation_level == "Quick":
                steps = [{'description': 'Answer:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'}]
            elif explanation_level == "ELI10":
                steps = [
                    {'description': "Newton's Second Law says a bigger push makes things move faster!", 'latex': r'\text{F = ma}'},
                    {'description': 'Push (Force) = Mass x Acceleration:', 'latex': r'F = m \cdot a'},
                    {'description': 'Putting our numbers in:', 'latex': sp.latex(subbed)},
                    {'description': f'Our answer for {label.get(str(target), str(target))}:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            elif explanation_level in ["Detailed", "Proof"]:
                steps = [
                    {'description': "Problem Domain: Newtonian Dynamics", 'latex': r'\text{Newton\'s Second Law}'},
                    {'description': 'The fundamental principle relating force, mass, and acceleration is:', 'latex': r'F = m \cdot a'},
                    {'description': 'Substituting the explicitly identified physical quantities:', 'latex': sp.latex(subbed)},
                    {'description': f'Isolating and computing {label.get(str(target), str(target))}:',
                     'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            else:
                steps = [
                    {'description': "Problem Type: Newton's Second Law", 'latex': r'\text{F = ma}'},
                    {'description': 'Formula:', 'latex': r'F = m \cdot a'},
                    {'description': 'Substitute values:', 'latex': sp.latex(subbed)},
                    {'description': f'Solving for {label.get(str(target), str(target))}:',
                     'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            return {
                'success': True, 'problem_type': "Newton's Second Law",
                'formula_used': 'F = m*a', 'given': {str(k): float(v) for k, v in knowns.items()},
                'solve_for': str(target), 'steps': steps,
                'final_values': [f'{round(val, 4)} {unit.get(str(target), "")}'],
                'solutions': [str(round(val, 4))]
            }

    return {'success': False, 'error': 'Could not extract enough values. Provide any 2 of: Force (N), mass (kg), acceleration (m/s²).'}


def _solve_energy(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    m_val = _find_quantity(text, [r'kg', r'mass'])
    v_val = _find_quantity(text, [r'm/s', r'velocity', r'speed'])
    h_val = _find_quantity(text, [r'height', r'metres?', r'meters?', r'high'])
    w_val = _find_quantity(text, [r'joule', r'work', r'energy'])
    d_val = _find_quantity(text, [r'distance', r'metres?', r'meters?'])
    f_val = _find_quantity(text, [r'newton', r'force'])

    if 'kinetic' in t and m_val and v_val:
        ke = 0.5 * m_val * v_val**2
        if explanation_level == "Quick":
            steps = [{'description': 'Kinetic Energy:', 'latex': fr'KE = {round(ke, 4)}\ \text{{J}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'Energy of movement (Kinetic Energy) depends on weight and speed!', 'latex': r'KE = \frac{1}{2}mv^2'},
                {'description': 'Plugging our numbers into the energy machine:', 'latex': fr'KE = \frac{{1}}{{2}} \times {m_val} \times {v_val}^2'},
                {'description': 'And the energy is:', 'latex': fr'KE = {round(ke, 4)}\ \text{{J}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'System entails translational kinetic energy.', 'latex': r'KE = \frac{1}{2}mv^2'},
                {'description': 'Evaluating the expression with known mass and velocity magnitudes:', 'latex': fr'KE = \frac{{1}}{{2}} \times {m_val} \times {v_val}^2'},
                {'description': 'Final scalar energy calculated in Joules:', 'latex': fr'KE = {round(ke, 4)}\ \text{{J}}'},
            ]
        else:
            steps = [
                {'description': 'Problem Type: Kinetic Energy', 'latex': r'KE = \frac{1}{2}mv^2'},
                {'description': 'Substitute values:', 'latex': fr'KE = \frac{{1}}{{2}} \times {m_val} \times {v_val}^2'},
                {'description': 'Final Answer:', 'latex': fr'KE = {round(ke, 4)}\ \text{{J}}'},
            ]
        return {'success': True, 'problem_type': 'Kinetic Energy', 'formula_used': 'KE = 0.5*m*v^2',
                'given': {'m': m_val, 'v': v_val}, 'solve_for': 'KE',
                'steps': steps, 'final_values': [f'{round(ke, 4)} J'], 'solutions': [str(round(ke, 4))]}

    if 'potential' in t and m_val and h_val:
        pe = m_val * 9.81 * h_val
        steps = [
            {'description': 'Problem Type: Gravitational Potential Energy', 'latex': r'PE = mgh'},
            {'description': 'Substitute values:', 'latex': fr'PE = {m_val} \times 9.81 \times {h_val}'},
            {'description': 'Final Answer:', 'latex': fr'PE = {round(pe, 4)}\ \text{{J}}'},
        ]
        return {'success': True, 'problem_type': 'Potential Energy', 'formula_used': 'PE = m*g*h',
                'given': {'m': m_val, 'g': 9.81, 'h': h_val}, 'solve_for': 'PE',
                'steps': steps, 'final_values': [f'{round(pe, 4)} J'], 'solutions': [str(round(pe, 4))]}

    if f_val and d_val:
        w = f_val * d_val
        steps = [
            {'description': 'Problem Type: Work Done', 'latex': r'W = F \cdot d'},
            {'description': 'Substitute values:', 'latex': fr'W = {f_val} \times {d_val}'},
            {'description': 'Final Answer:', 'latex': fr'W = {round(w, 4)}\ \text{{J}}'},
        ]
        return {'success': True, 'problem_type': 'Work Done', 'formula_used': 'W = F*d',
                'given': {'F': f_val, 'd': d_val}, 'solve_for': 'W',
                'steps': steps, 'final_values': [f'{round(w, 4)} J'], 'solutions': [str(round(w, 4))]}

    return {'success': False, 'error': 'Could not determine energy type. Specify "kinetic energy", "potential energy", or "work done".'}


def _solve_electricity(text: str, explanation_level: str) -> Dict[str, Any]:
    v_val = _find_quantity(text, [r'volt', r'voltage', r'v\s*='])
    i_val = _find_quantity(text, [r'ampere', r'current', r'amp', r'i\s*='])
    r_val = _find_quantity(text, [r'ohm', r'resistance', r'r\s*='])

    V, I, R = sp.symbols('V I R')
    knowns = {}
    if v_val is not None: knowns[V] = v_val
    if i_val is not None: knowns[I] = i_val
    if r_val is not None: knowns[R] = r_val

    eq = sp.Eq(V, I * R)
    unknowns = {V, I, R} - set(knowns.keys())
    if len(unknowns) == 1:
        target = list(unknowns)[0]
        subbed = eq.subs(knowns)
        sols = sp.solve(subbed, target)
        if sols:
            val = float(sols[0].evalf())
            unit = {'V': 'V', 'I': 'A', 'R': 'Ω'}
            if explanation_level == "Quick":
                steps = [{'description': 'Answer:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'}]
            elif explanation_level == "ELI10":
                steps = [
                    {'description': "Ohm's Law connects the electrical 'push' (V) to the flow (I) and the squeeze (R)!", 'latex': r'V = I \cdot R'},
                    {'description': 'Putting our numbers in:', 'latex': sp.latex(subbed)},
                    {'description': 'And our answer is:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            elif explanation_level in ["Detailed", "Proof"]:
                steps = [
                    {'description': r"Applying Ohm's law for macroscopic conductors in linear regimes:", 'latex': r'V = I \cdot R'},
                    {'description': 'Substituting the measured electrical parameters:', 'latex': sp.latex(subbed)},
                    {'description': f'Equating to find the unknown {str(target)}:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            else:
                steps = [
                    {'description': "Ohm's Law", 'latex': r'V = I \cdot R'},
                    {'description': 'Substitute:', 'latex': sp.latex(subbed)},
                    {'description': 'Answer:', 'latex': fr'{str(target)} = {round(val, 4)}\ \text{{{unit.get(str(target), "")}}}'},
                ]
            return {'success': True, 'problem_type': "Ohm's Law", 'formula_used': 'V = I*R',
                    'given': {str(k): float(v) for k, v in knowns.items()}, 'solve_for': str(target),
                    'steps': steps, 'final_values': [f'{round(val, 4)} {unit.get(str(target), "")}'],
                    'solutions': [str(round(val, 4))]}

    return {'success': False, 'error': 'Provide any 2 of: Voltage (V), Current (A), Resistance (Ω).'}


def _solve_gas_law(text: str, explanation_level: str) -> Dict[str, Any]:
    nums = _extract_numbers(text)
    p_val = _find_quantity(text, [r'pa', r'kpa', r'atm', r'pressure'])
    v_vol = _find_quantity(text, [r'litre', r'liter', r'm3', r'volume'])
    n_val = _find_quantity(text, [r'mol', r'mole'])
    temp_val = _find_quantity(text, [r'kelvin', r'temperature', r'k\b'])

    R_const = 8.314
    if p_val and v_vol and n_val and temp_val is None:
        return {'success': False, 'error': 'Provide temperature (in Kelvin) to use PV = nRT.'}

    if p_val and v_vol and n_val and temp_val:
        # solve for one of them
        calc = (n_val * R_const * temp_val) / v_vol
        if explanation_level == "Quick":
            steps = [{'description': 'Answer:', 'latex': fr'P = {round(calc, 4)}\ \text{{Pa}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'The Ideal Gas Law tells us how pressure, volume, and temperature dance together!', 'latex': r'PV = nRT'},
                {'description': 'Finding the Pressure:', 'latex': fr'P = \frac{{nRT}}{{V}} = \frac{{{n_val} \times 8.314 \times {temp_val}}}{{{v_vol}}}'},
                {'description': 'The pressure is:', 'latex': fr'P = {round(calc, 4)}\ \text{{Pa}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
             steps = [
                {'description': 'Modeling the behavior of a hypothetical ideal gas equation of state:', 'latex': r'PV = nRT'},
                {'description': 'Isolating Pressure as a function of volume, moles, and thermodynamic temperature:', 'latex': fr'P = \frac{{nRT}}{{V}} = \frac{{{n_val} \times 8.314 \times {temp_val}}}{{{v_vol}}}'},
                {'description': 'Evaluated macroscopic pressure component:', 'latex': fr'P = {round(calc, 4)}\ \text{{Pa}}'},
            ]
        else:
            steps = [
                {'description': 'Ideal Gas Law', 'latex': r'PV = nRT'},
                {'description': 'Solve for P:', 'latex': fr'P = \frac{{nRT}}{{V}} = \frac{{{n_val} \times 8.314 \times {temp_val}}}{{{v_vol}}}'},
                {'description': 'Answer:', 'latex': fr'P = {round(calc, 4)}\ \text{{Pa}}'},
            ]
        return {'success': True, 'problem_type': 'Ideal Gas Law', 'formula_used': 'PV = nRT',
                'given': {'P': p_val, 'V': v_vol, 'n': n_val, 'T': temp_val}, 'solve_for': 'P',
                'steps': steps, 'final_values': [f'{round(calc, 4)} Pa'], 'solutions': [str(round(calc, 4))]}

    return {'success': False, 'error': 'Could not resolve gas law problem. Provide P, V, n, and T values.'}


def _solve_gravity(text: str, explanation_level: str) -> Dict[str, Any]:
    m_val = _find_quantity(text, [r'kg', r'mass'])
    g_val = 9.81
    weight = (m_val * g_val) if m_val else None
    if weight:
        if explanation_level == "Quick":
            steps = [{'description': 'Answer:', 'latex': fr'W = {round(weight, 4)}\ \text{{N}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'Weight is just gravity pulling on mass!', 'latex': r'W = mg'},
                {'description': 'Multiplying the mass by Earth\'s gravity (9.81):', 'latex': fr'W = {m_val} \times 9.81'},
                {'description': 'The weight is:', 'latex': fr'W = {round(weight, 4)}\ \text{{N}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'The scalar magnitude of the gravitational force (Weight) exerted on an object:', 'latex': r'W = mg'},
                {'description': 'Substituting local acceleration due to gravity (g ≈ 9.81 m/s²):', 'latex': fr'W = {m_val} \times 9.81'},
                {'description': 'Calculated downward force magnitude:', 'latex': fr'W = {round(weight, 4)}\ \text{{N}}'},
            ]
        else:
            steps = [
                {'description': 'Weight / Gravitational Force', 'latex': r'W = mg'},
                {'description': 'Substitute:', 'latex': fr'W = {m_val} \times 9.81'},
                {'description': 'Answer:', 'latex': fr'W = {round(weight, 4)}\ \text{{N}}'},
            ]
        return {'success': True, 'problem_type': 'Gravity / Weight', 'formula_used': 'W = m*g',
                'given': {'m': m_val, 'g': 9.81}, 'solve_for': 'W',
                'steps': steps, 'final_values': [f'{round(weight, 4)} N'], 'solutions': [str(round(weight, 4))]}
    return {'success': False, 'error': 'Could not extract mass to compute weight.'}

def _solve_circuit(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    is_series = 'series' in t
    
    v_val = _find_quantity(text, [r'v\s*='])
    r1_val = _find_quantity(text, [r'r1\s*='])
    r2_val = _find_quantity(text, [r'r2\s*='])

    if v_val is not None and r1_val is not None and r2_val is not None:
        if is_series:
            r_total = r1_val + r2_val
            i_total = v_val / r_total
            circuit_type = 'Series Circuit'
            formula1 = r'R_{total} = R_1 + R_2'
            formula2 = r'I = \frac{V}{R_{total}}'
            calc_r = fr'R_{{total}} = {r1_val} + {r2_val} = {round(r_total, 4)}\ \Omega'
        else:
            r_total = 1 / ((1 / r1_val) + (1 / r2_val))
            i_total = v_val / r_total
            circuit_type = 'Parallel Circuit'
            formula1 = r'\frac{1}{R_{total}} = \frac{1}{R_1} + \frac{1}{R_2}'
            formula2 = r'I = \frac{V}{R_{total}}'
            calc_r = fr'\frac{{1}}{{R_{{total}}}} = \frac{{1}}{{{r1_val}}} + \frac{{1}}{{{r2_val}}} \implies R_{{total}} = {round(r_total, 4)}\ \Omega'
            
        calc_i = fr'I = \frac{{{v_val}}}{{{round(r_total, 4)}}} = {round(i_total, 4)}\ \text{{A}}'

        if explanation_level == "Quick":
            steps = [
                {'description': 'Total Resistance:', 'latex': fr'R_{{total}} = {round(r_total, 4)}\ \Omega'},
                {'description': 'Total Current:', 'latex': fr'I = {round(i_total, 4)}\ \text{{A}}'}
            ]
        elif explanation_level == "ELI10":
            steps = [
                {'description': f'In a {circuit_type}, we first figure out the total resistance (how much it blocks).', 'latex': formula1},
                {'description': 'Resistance calculation:', 'latex': calc_r},
                {'description': 'Then we use Ohm\'s law to find the current (flow)!', 'latex': formula2},
                {'description': 'Current calculation:', 'latex': calc_i},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': f'Analyzing the equivalent resistance of a {circuit_type} topology:', 'latex': formula1},
                {'description': 'Evaluating the equivalent resistance:', 'latex': calc_r},
                {'description': 'Applying Ohm\'s law to the macroscopic circuit to derive total current outflow:', 'latex': formula2},
                {'description': 'Evaluating total current:', 'latex': calc_i},
            ]
        else:
            steps = [
                {'description': f'Problem Type: {circuit_type}', 'latex': r'\text{Equivalent Resistance & Ohm\'s Law}'},
                {'description': 'Find Total Resistance:', 'latex': calc_r},
                {'description': 'Find Total Current (I = V / R_total):', 'latex': calc_i},
            ]

        return {
            'success': True,
            'problem_type': circuit_type,
            'formula_used': 'Equivalent R & Ohm\'s Law',
            'given': {'V': v_val, 'R1': r1_val, 'R2': r2_val},
            'solve_for': 'Total Resistance & Current',
            'steps': steps,
            'final_values': [f'R = {round(r_total, 4)} Ω', f'I = {round(i_total, 4)} A'],
            'solutions': [str(round(r_total, 4)), str(round(i_total, 4))]
        }

    return {'success': False, 'error': 'Could not extract V, R1, and R2 for the circuit.'}

def _solve_organic(text: str, explanation_level: str) -> Dict[str, Any]:
    # A simple mock organic chemistry solver for demonstration purposes since NLP for Organic Chem is complex
    query = text.lower().replace("organic chemistry:", "").strip()
    
    steps = [
         {'description': 'Organic Chemistry Query Detected:', 'latex': r'\text{Processing requested organic reaction or nomenclature.}'},
         {'description': 'Query:', 'latex': fr'\text{{{query}}}'}
    ]
    
    if 'ch3' in query and 'oh' in query and 'name' in query:
        ans = "Ethanol (if CH3CH2OH) or Methanol (if CH3OH)"
        steps.append({'description': 'Nomenclature Match:', 'latex': fr'\text{{{ans}}}'})
    elif 'benzene' in query and 'br2' in query:
        ans = "Bromobenzene (via Electrophilic Aromatic Substitution with FeBr3 catalyst)"
        steps.append({'description': 'Reaction Match:', 'latex': fr'\text{{{ans}}}'})
    else:
        ans = "Common organic chemistry structural pattern not found in basic local library. Try standard nomenclature."
        steps.append({'description': 'Result:', 'latex': fr'\text{{{ans}}}'})
        
    return {
        'success': True,
        'problem_type': 'Organic Chemistry',
        'formula_used': 'Nomenclature & Reactions DB',
        'given': {'query': query},
        'solve_for': 'Structure / Reaction',
        'steps': steps,
        'final_values': [ans],
        'solutions': [ans]
    }


# ──────────────────────────────────────────────────────────────
# Public entry point
# ──────────────────────────────────────────────────────────────

SOLVER_MAP = {
    'momentum': _solve_momentum,
    'kinematics': _solve_kinematics,
    'force': _solve_force,
    'energy': _solve_energy,
    'electricity': _solve_electricity,
    'gas_law': _solve_gas_law,
    'gravity': _solve_gravity,
    'circuit': _solve_circuit,
    'organic': _solve_organic,
}


# ──────────────────────────────────────────────────────────────
# Enrichment: next steps + real-world applications
# ──────────────────────────────────────────────────────────────

_ENRICHMENT: Dict[str, Dict[str, Any]] = {
    'kinematics': {
        'next_steps': [
            'Try solving for a different unknown variable (e.g. time, acceleration)',
            'Extend to 2D projectile motion problems — add a horizontal component',
            'Combine with Newton\'s 2nd Law to find the forces acting on the object',
            'Plot velocity vs. time to find area (displacement) under the graph',
        ],
        'real_world': [
            ('🚗 Automotive', 'Braking distance calculations for road safety engineering'),
            ('🏎️ Sports Science', 'Analysing sprint acceleration and top speed in athletes'),
            ('🚀 Space', 'Rocket trajectory planning during launch and re-entry phases'),
            ('🎮 Game Dev', 'Physics engines use kinematics for realistic character movement'),
        ]
    },
    'projectile': {
        'next_steps': [
            'Vary the launch angle and observe how the range changes — maximum range is at 45°',
            'Include air resistance (drag) for a more realistic model',
            'Find the time of flight: T = 2u·sin(θ)/g',
            'Calculate maximum height: H = u²sin²(θ)/(2g)',
        ],
        'real_world': [
            ('⚽ Sports', 'Optimal angle for a football kick to maximise goal-scoring range'),
            ('🏹 Military', 'Artillery shell trajectory calculations in ballistics'),
            ('🎆 Fireworks', 'Pyrotechnicians use projectile physics to time burst heights'),
            ('🌊 Irrigation', 'Designing irrigation sprinkler spray patterns and coverage'),
        ]
    },
    'momentum': {
        'next_steps': [
            'Calculate kinetic energy before and after to verify energy conservation (or loss)',
            'Try an elastic collision — both momentum AND kinetic energy are conserved',
            'Find the impulse (J = F·t = Δp) applied during the collision',
            'Explore the centre-of-mass frame for simplifying collision problems',
        ],
        'real_world': [
            ('🚗 Car Safety', 'Crumple zones extend collision time to reduce force on passengers'),
            ('🎱 Billiards', 'Collisions between balls governed by elastic momentum principles'),
            ('🚀 Rocketry', 'Rocket propulsion uses momentum conservation — exhaust backwards, rocket forwards'),
            ('🏈 NFL', 'Helmet impact testing uses momentum and impulse analysis'),
        ]
    },
    'force': {
        'next_steps': [
            'Draw a free-body diagram to identify all forces acting on the object',
            'If the object is on an incline, resolve forces along and perpendicular to the slope',
            'Include friction: f = μN, then recalculate net force and acceleration',
            'Use F = ma to find how the velocity changes with time',
        ],
        'real_world': [
            ('🏗️ Civil Engineering', 'Bridge and building design requires precise load and force analysis'),
            ('✈️ Aerospace', 'Aircraft design balances thrust, drag, lift, and weight forces'),
            ('⛵ Sailing', 'Sail orientation optimises net force from wind for forward propulsion'),
            ('🦾 Robotics', 'Motor torque and joint force calculations for robot arm movements'),
        ]
    },
    'energy': {
        'next_steps': [
            'Apply the Work-Energy Theorem: net work equals change in kinetic energy',
            'Check energy conservation: total mechanical energy = KE + PE = constant (if no friction)',
            'Calculate power (P = W/t or P = F·v) — rate of energy transfer',
            'If frictional forces are present, calculate heat energy lost: Q = f·d',
        ],
        'real_world': [
            ('⚡ Power Plants', 'Turbines convert mechanical potential energy to electrical energy'),
            ('🏋️ Fitness', 'Calorie calculations for exercises use the concept of work done'),
            ('🎢 Roller Coasters', 'PE at the top converts to KE at the bottom — rides are designed using this'),
            ('🔋 Batteries', 'Stored chemical energy is converted to electrical energy — efficiency matters'),
        ]
    },
    'electricity': {
        'next_steps': [
            'Calculate power dissipated: P = I²R = V²/R = V·I (in watts)',
            'Build a series circuit and verify total resistance adds: R_total = R1 + R2 + ...',
            'Try a parallel circuit: 1/R_total = 1/R1 + 1/R2 + ...',
            'Apply Kirchhoff\'s Voltage Law (loop rule) to complex circuit networks',
        ],
        'real_world': [
            ('💡 Electrical Wiring', 'Home circuits use Ohm\'s Law to safely size cables and fuses'),
            ('📱 Electronics', 'Resistor values in phone circuits control current to protect components'),
            ('🏭 Industry', 'Motor control systems calculate V, I, R for efficient operation'),
            ('🔬 Medical Devices', 'ECG machines rely on precise electrical resistance measurements'),
        ]
    },
    'circuit': {
        'next_steps': [
            'Add a third resistor and calculate the new equivalent resistance',
            'Calculate power dissipated in each resistor: P = I²R',
            'Try converting the circuit type (series ↔ parallel) and compare results',
            'Measure voltage across each component using Kirchhoff\'s Voltage Law',
        ],
        'real_world': [
            ('🔌 Home Wiring', 'Household appliances are connected in parallel so each gets full voltage'),
            ('🔦 Torch/Flashlight', 'Series circuits in flashlights — one dead battery stops all current'),
            ('📟 Electronics PCBs', 'IC design uses series/parallel resistor networks to control signals'),
            ('🚗 Car Electrical', 'Vehicle lighting systems carefully balance parallel circuit loads'),
        ]
    },
    'gas_law': {
        'next_steps': [
            'Apply the combined gas law: P₁V₁/T₁ = P₂V₂/T₂ for two states',
            'Use the Ideal Gas Law PV = nRT to find amount of substance (moles)',
            'Identify whether this is Boyle\'s, Charles\'s, or Gay-Lussac\'s law',
            'Explore real gas behaviour using the van der Waals equation',
        ],
        'real_world': [
            ('🌡️ Weather Forecasting', 'Atmospheric pressure and temperature changes follow gas laws'),
            ('🏊 Scuba Diving', 'Boyle\'s law governs how compressed air tanks behave at depth'),
            ('🎈 Hot Air Balloons', 'Charles\'s law — heating gas increases volume, providing lift'),
            ('🏭 Industrial Gases', 'Gas cylinder storage and safe pressure limits use gas law calculations'),
        ]
    },
    'gravity': {
        'next_steps': [
            'Try different planets — the surface gravity (g) changes, affecting weight W = mg',
            'Apply Newton\'s Law of Gravitation: F = Gm₁m₂/r² for two masses at distance r',
            'Calculate orbital velocity: v = √(GM/r) for a satellite orbit at height r',
            'Explore escape velocity: v_esc = √(2GM/R)',
        ],
        'real_world': [
            ('🛰️ Satellites', 'GPS satellites are placed at precise orbital radii using gravitational calculations'),
            ('🌍 Geophysics', 'Gravity surveys detect underground ore deposits by local g variations'),
            ('🚀 Mission Planning', 'Gravitational slingshot manoeuvres save rocket fuel on deep-space missions'),
            ('⚖️ Weighing Systems', 'Industrial scales must be calibrated for local gravitational variations'),
        ]
    },
    'chemistry': {
        'next_steps': [
            'Balance the chemical equation and identify limiting reagent for yield calculations',
            'Calculate the molar concentration: C = n/V (mol/L)',
            'Explore reaction thermodynamics: calculate ΔH using bond enthalpies',
            'Apply Le Chatelier\'s Principle to predict equilibrium shifts',
        ],
        'real_world': [
            ('💊 Pharmaceuticals', 'Drug dosage calculations rely on molarity and molar mass'),
            ('🌱 Agriculture', 'Fertiliser NPK ratios calculated using stoichiometric principles'),
            ('🧪 Lab Analysis', 'Titration procedures use molarity to determine unknown concentrations'),
            ('🏭 Chemical Industry', 'Yield optimisation in industrial reactions saves millions in costs'),
        ]
    },
    'organic': {
        'next_steps': [
            'Draw the structural formula and identify all functional groups present',
            'Determine the IUPAC name by applying the nomenclature rules for that functional group',
            'Predict the type of reaction: addition, substitution, elimination, or oxidation',
            'Study the reaction mechanism: identify nucleophiles, electrophiles, and leaving groups',
        ],
        'real_world': [
            ('💊 Drug Design', 'Pharmaceutical chemists modify organic structures to create effective medicines'),
            ('🧴 Cosmetics', 'Organic chemistry governs formulation of skincare and beauty products'),
            ('⛽ Petrochemicals', 'Crude oil fractionation and refining depend on organic molecule properties'),
            ('🌿 Agrochemistry', 'Pesticides and herbicides are designed using organic reaction principles'),
        ]
    },
    'unknown': {
        'next_steps': [
            'Try rephrasing the problem with explicit units (m/s, kg, N, etc.)',
            'Use a direct equation format: e.g. "F = m*a" or "v² = u² + 2as"',
            'Identify and state the known and unknown variables clearly',
            'Check the Concepts section for related formulas and topics',
        ],
        'real_world': [
            ('📚 General', 'STEM concepts underpin all modern engineering, medicine, and technology'),
            ('🔬 Research', 'Scientific reasoning and problem-solving are universal transferable skills'),
        ]
    }
}


def _get_enrichment(problem_type: str) -> Dict[str, Any]:
    key = problem_type.lower() if problem_type else 'unknown'
    data = _ENRICHMENT.get(key, _ENRICHMENT['unknown'])
    return {
        'next_steps': data['next_steps'],
        'real_world_applications': [
            {'label': label, 'description': desc}
            for label, desc in data['real_world']
        ]
    }


def solve_word_problem(text: str, explanation_level: str = "Step by Step") -> Dict[str, Any]:
    """
    Main entry point for NL word problem solving.
    Detects type, extracts values, and solves.
    """
    problem_type = _detect_problem_type(text)

    # Route chemistry to dedicated solver
    if problem_type == 'chemistry':
        try:
            from engine.chemistry_solver import solve_chemistry_problem
            result = solve_chemistry_problem(text, explanation_level)
            if result.get('success'):
                result.update(_get_enrichment('chemistry'))
            return result
        except Exception as e:
            return {'success': False, 'error': f'Chemistry solver error: {e}'}

    solver = SOLVER_MAP.get(problem_type)

    if solver is None:
        return {
            'success': False,
            'error': (
                'Could not identify the problem type from the description.\n\n'
                'Supported word problem types:\n'
                '  • Chemistry: molar mass, pH, molarity, stoichiometry, heat\n'
                '  • Collisions / Momentum conservation\n'
                '  • Kinematics (velocity, acceleration, distance, time)\n'
                '  • Newton\'s Second Law (F = ma)\n'
                '  • Kinetic / Potential Energy / Work Done\n'
                '  • Ohm\'s Law (V, I, R)\n'
                '  • Ideal Gas Law (P, V, n, T)\n'
                '  • Weight / Gravity (W = mg)\n\n'
                'Or type a direct equation like: F = m*a'
            )
        }

    try:
        result = solver(text, explanation_level)
        if result.get('success'):
            result.update(_get_enrichment(problem_type))
        return result
    except Exception as e:
        return {
            'success': False,
            'error': f'Error while solving word problem: {str(e)}'
        }
