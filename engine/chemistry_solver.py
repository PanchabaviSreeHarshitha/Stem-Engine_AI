"""
Chemistry Word Problem Solver
Handles common chemistry calculations: molar mass, pH, molarity,
stoichiometry, thermochemistry, ideal gas, and equilibrium.
"""
import re
import sympy as sp
from typing import Dict, Any, Optional, List, Tuple

# ──────────────────────────────────────────────────────────────
# Periodic table (symbol → atomic mass)
# ──────────────────────────────────────────────────────────────
ATOMIC_MASS: Dict[str, float] = {
    'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012, 'B': 10.811,
    'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
    'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.086, 'P': 30.974,
    'S': 32.065, 'Cl': 35.453, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
    'Sc': 44.956, 'Ti': 47.867, 'V': 50.942, 'Cr': 51.996, 'Mn': 54.938,
    'Fe': 55.845, 'Co': 58.933, 'Ni': 58.693, 'Cu': 63.546, 'Zn': 65.38,
    'Ga': 69.723, 'Ge': 72.630, 'As': 74.922, 'Se': 78.96, 'Br': 79.904,
    'Kr': 83.798, 'Rb': 85.468, 'Sr': 87.62, 'Y': 88.906, 'Zr': 91.224,
    'Nb': 92.906, 'Mo': 95.96, 'Tc': 98.0, 'Ru': 101.07, 'Rh': 102.906,
    'Pd': 106.42, 'Ag': 107.868, 'Cd': 112.411, 'In': 114.818, 'Sn': 118.710,
    'Sb': 121.760, 'Te': 127.60, 'I': 126.904, 'Xe': 131.293, 'Cs': 132.905,
    'Ba': 137.327, 'La': 138.905, 'Ce': 140.116, 'Pr': 140.908, 'Nd': 144.242,
    'Pm': 145.0, 'Sm': 150.36, 'Eu': 151.964, 'Gd': 157.25, 'Tb': 158.925,
    'Dy': 162.500, 'Ho': 164.930, 'Er': 167.259, 'Tm': 168.934, 'Yb': 173.054,
    'Lu': 174.967, 'Hf': 178.49, 'Ta': 180.948, 'W': 183.84, 'Re': 186.207,
    'Os': 190.23, 'Ir': 192.217, 'Pt': 195.084, 'Au': 196.967, 'Hg': 200.59,
    'Tl': 204.383, 'Pb': 207.2, 'Bi': 208.980, 'Po': 209.0, 'At': 210.0,
    'Rn': 222.0, 'Fr': 223.0, 'Ra': 226.0, 'Ac': 227.0, 'Th': 232.038,
    'Pa': 231.036, 'U': 238.029, 'Np': 237.0, 'Pu': 244.0,
}

# Common compound names to formula
COMPOUND_NAME_MAP: Dict[str, str] = {
    'water': 'H2O', 'sodium chloride': 'NaCl', 'salt': 'NaCl',
    'hydrochloric acid': 'HCl', 'sulfuric acid': 'H2SO4', 'sulphuric acid': 'H2SO4',
    'nitric acid': 'HNO3', 'acetic acid': 'CH3COOH', 'ethanoic acid': 'CH3COOH',
    'sodium hydroxide': 'NaOH', 'caustic soda': 'NaOH',
    'potassium hydroxide': 'KOH', 'ammonia': 'NH3',
    'carbon dioxide': 'CO2', 'carbon monoxide': 'CO',
    'methane': 'CH4', 'ethane': 'C2H6', 'propane': 'C3H8', 'butane': 'C4H10',
    'ethylene': 'C2H4', 'ethanol': 'C2H5OH', 'methanol': 'CH3OH',
    'glucose': 'C6H12O6', 'sucrose': 'C12H22O11',
    'calcium carbonate': 'CaCO3', 'limestone': 'CaCO3',
    'iron oxide': 'Fe2O3', 'rust': 'Fe2O3',
    'hydrogen peroxide': 'H2O2', 'ozone': 'O3',
    'sodium bicarbonate': 'NaHCO3', 'baking soda': 'NaHCO3',
    'potassium permanganate': 'KMnO4',
    'calcium hydroxide': 'Ca(OH)2', 'slaked lime': 'Ca(OH)2',
    'magnesium oxide': 'MgO', 'aluminium oxide': 'Al2O3',
}


def _parse_formula(formula: str) -> Dict[str, int]:
    """
    Parse a chemical formula string into {Element: count} dict.
    Handles: H2O, Ca(OH)2, Fe2(SO4)3, etc.
    """
    def parse_segment(s: str) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        i = 0
        while i < len(s):
            if s[i] == '(':
                # find matching )
                depth, j = 1, i + 1
                while j < len(s) and depth:
                    if s[j] == '(': depth += 1
                    elif s[j] == ')': depth -= 1
                    j += 1
                inner = parse_segment(s[i+1:j-1])
                # read multiplier
                m_match = re.match(r'(\d+)', s[j:])
                mult = int(m_match.group(1)) if m_match else 1
                i = j + (len(m_match.group(0)) if m_match else 0)
                for el, cnt in inner.items():
                    counts[el] = counts.get(el, 0) + cnt * mult
            elif s[i].isupper():
                m = re.match(r'([A-Z][a-z]?)(\d*)', s[i:])
                if m:
                    el = m.group(1)
                    cnt = int(m.group(2)) if m.group(2) else 1
                    counts[el] = counts.get(el, 0) + cnt
                    i += len(m.group(0))
                else:
                    i += 1
            else:
                i += 1
        return counts

    return parse_segment(formula.replace(' ', ''))


def _molar_mass_of(formula: str) -> Tuple[float, Dict[str, int]]:
    """Returns (total molar mass, element counts)."""
    counts = _parse_formula(formula)
    total = sum(ATOMIC_MASS.get(el, 0) * cnt for el, cnt in counts.items())
    return round(total, 4), counts


def _extract_formula_from_text(text: str) -> Optional[str]:
    """Try to find a chemical formula or compound name in text."""
    t = text.lower()
    # Check compound name map first
    for name, formula in COMPOUND_NAME_MAP.items():
        if name in t:
            return formula
    # Look for formula-like patterns
    m = re.search(r'\b([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)*(?:\([\w]+\)\d*)*)\b', text)
    if m:
        candidate = m.group(1)
        # Verify it contains at least one known element
        if any(el in ATOMIC_MASS for el in re.findall(r'[A-Z][a-z]?', candidate)):
            return candidate
    return None


def _find_number(text: str, keywords: List[str]) -> Optional[float]:
    t = text.lower()
    for kw in keywords:
        rx = rf'(\d+\.?\d*)\s*{re.escape(kw)}|{re.escape(kw)}\s*(?:of\s+|is\s+|=\s*)?(\d+\.?\d*)'
        m = re.search(rx, t)
        if m:
            v = m.group(1) or m.group(2)
            if v:
                return float(v)
    return None


# ──────────────────────────────────────────────────────────────
# Individual chemistry solvers
# ──────────────────────────────────────────────────────────────

def solve_molar_mass(text: str, explanation_level: str) -> Dict[str, Any]:
    formula = _extract_formula_from_text(text)
    if not formula:
        return {'success': False, 'error': 'Could not identify a chemical formula. Try: "molar mass of H2SO4" or "molecular weight of glucose".'}

    try:
        mass, counts = _molar_mass_of(formula)
    except Exception as e:
        return {'success': False, 'error': f'Error parsing formula {formula}: {e}'}

    if mass == 0:
        return {'success': False, 'error': f'Could not compute molar mass for {formula}. Check the formula spelling.'}

    breakdown_lines = ' + '.join(
        f'{cnt} \\times {ATOMIC_MASS.get(el, 0):.3f}_{{{el}}}'
        for el, cnt in counts.items()
    )
    if explanation_level == "Quick":
        steps = [{'description': 'Molar Mass:', 'latex': fr'M({formula}) = {mass}\ \text{{g/mol}}'}]
    elif explanation_level == "ELI10":
        steps = [
            {'description': 'Molar mass is like finding the total weight of a recipe!', 'latex': r'M = \sum n_i \cdot A_i'},
            {'description': f'Our recipe is {formula}. We just add up the weight of each ingredient block:', 'latex': breakdown_lines},
            {'description': 'Total Weight (Molar Mass):', 'latex': fr'M({formula}) = {mass}\ \text{{g/mol}}'},
        ]
    elif explanation_level in ["Detailed", "Proof"]:
        steps = [
            {'description': 'Macroscopic Molar Mass Computation:', 'latex': r'M = \sum n_i \cdot A_i'},
            {'description': f'Molecular constituent summation for {formula}:', 'latex': r'\text{Atomic Weight × Quantity}'},
            {'description': 'Individual atomic mass contributions:', 'latex': breakdown_lines},
            {'description': 'Aggregate Molecular Weight:', 'latex': fr'M({formula}) = {mass}\ \text{{g/mol}}'},
        ]
    else:
        steps = [
            {'description': 'Problem Type: Molar Mass Calculation', 'latex': r'M = \sum n_i \cdot A_i'},
            {'description': f'Formula: {formula}', 'latex': r'\text{Sum of (count × atomic mass) for each element}'},
            {'description': 'Element breakdown:', 'latex': breakdown_lines},
            {'description': 'Molar Mass:', 'latex': fr'M({formula}) = {mass}\ \text{{g/mol}}'},
        ]
    return {
        'success': True, 'problem_type': 'Molar Mass', 'formula_used': f'M = Σ(n × A)',
        'given': {'formula': formula}, 'solve_for': 'Molar Mass',
        'steps': steps, 'final_values': [f'{mass} g/mol'], 'solutions': [str(mass)]
    }


def solve_ph(text: str, explanation_level: str) -> Dict[str, Any]:
    import math
    t = text.lower()

    # Extract concentration
    conc = _find_number(text, ['m', 'mol/l', 'molar', 'molarity'])
    if conc is None:
        conc_m = re.search(r'(\d+\.?\d*(?:[eE][+-]?\d+)?)\s*(?:m\b|mol/?l)', t)
        conc = float(conc_m.group(1)) if conc_m else None

    if conc is None:
        return {'success': False, 'error': 'Provide concentration (e.g. "0.01 M HCl" or "0.1 mol/L NaOH").'}

    formula = _extract_formula_from_text(text)

    # Determine if acid or base
    strong_acids = ['HCl', 'H2SO4', 'HNO3', 'HBr', 'HI', 'HClO4']
    strong_bases = ['NaOH', 'KOH', 'Ca(OH)2', 'Ba(OH)2', 'LiOH']

    is_strong_acid = formula in strong_acids or any(a.lower() in t for a in ['hydrochloric', 'sulfuric', 'nitric', 'hbr', 'hi'])
    is_strong_base = formula in strong_bases or any(b.lower() in t for b in ['sodium hydroxide', 'potassium hydroxide', 'naoh', 'koh'])

    if is_strong_acid:
        # H2SO4 donates 2 H+
        factor = 2 if formula == 'H2SO4' else 1
        h_plus = conc * factor
        ph = -math.log10(h_plus)
        if explanation_level == "Quick":
             steps = [{'description': 'Calculate pH:', 'latex': fr'\text{{pH}} = {round(ph, 4)}'}]
        elif explanation_level == "ELI10":
             steps = [
                {'description': 'pH measures how \"sour\" an acid is!', 'latex': r'\text{pH} = -\log_{10}[\text{H}^+]'},
                {'description': f'Here is how much acid we have: {h_plus} M', 'latex': fr'[\text{{H}}^+] = {h_plus}\ \text{{M}}'},
                {'description': 'The pH level is:', 'latex': fr'\text{{pH}} = {round(ph, 4)}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'Determination of pH for a strong monoprotic/diprotic acid:', 'latex': r'\text{pH} = -\log_{10}[\text{H}^+]'},
                {'description': f'Assuming 100% dissociation, [H⁺] = {h_plus} M', 'latex': fr'[\text{{H}}^+] = {h_plus}\ \text{{M}}'},
                {'description': 'Logarithmic scale evaluation:', 'latex': fr'\text{{pH}} = -\log_{{10}}({h_plus}) = {round(ph, 4)}'},
            ]
        else:
            steps = [
                {'description': 'Problem Type: pH of Strong Acid', 'latex': r'\text{pH} = -\log_{10}[\text{H}^+]'},
                {'description': f'[H⁺] = {h_plus} M (strong acid fully dissociates)', 'latex': fr'[\text{{H}}^+] = {h_plus}\ \text{{M}}'},
                {'description': 'Calculate pH:', 'latex': fr'\text{{pH}} = -\log_{{10}}({h_plus}) = {round(ph, 4)}'},
            ]
        return {
            'success': True, 'problem_type': 'pH of Strong Acid', 'formula_used': 'pH = -log[H⁺]',
            'given': {'concentration': conc}, 'solve_for': 'pH',
            'steps': steps, 'final_values': [f'pH = {round(ph, 4)}'], 'solutions': [str(round(ph, 4))]
        }

    elif is_strong_base:
        factor = 2 if formula in ['Ca(OH)2', 'Ba(OH)2'] else 1
        oh_minus = conc * factor
        poh = -math.log10(oh_minus)
        ph = 14 - poh
        if explanation_level == "Quick":
            steps = [{'description': 'pH:', 'latex': fr'\text{{pH}} = {round(ph, 4)}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'A base is the opposite of an acid!', 'latex': r'\text{pH} = 14 - \text{pOH}'},
                {'description': f'First we find its \"base power\" (pOH) using the amount: {oh_minus}', 'latex': fr'\text{{pOH}} = -\log_{{10}}({oh_minus}) = {round(poh, 4)}'},
                {'description': 'Then we subtract from 14 to get pH:', 'latex': fr'\text{{pH}} = 14 - {round(poh, 4)} = {round(ph, 4)}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'Determination of pH for a strong base using ionic product of water:', 'latex': r'\text{pH} = 14 - \text{pOH}'},
                {'description': f'Hydroxide ion concentration [OH⁻] = {oh_minus} M', 'latex': fr'[\text{{OH}}^-] = {oh_minus}\ \text{{M}}'},
                {'description': 'Calculating pOH scalar:', 'latex': fr'\text{{pOH}} = -\log_{{10}}({oh_minus}) = {round(poh, 4)}'},
                {'description': 'Converting pOH to pH (assuming 25°C where pKw = 14):', 'latex': fr'\text{{pH}} = 14 - {round(poh, 4)} = {round(ph, 4)}'},
            ]
        else:
            steps = [
                {'description': 'Problem Type: pH of Strong Base', 'latex': r'\text{pH} = 14 - \text{pOH}'},
                {'description': f'[OH⁻] = {oh_minus} M', 'latex': fr'[\text{{OH}}^-] = {oh_minus}\ \text{{M}}'},
                {'description': 'pOH:', 'latex': fr'\text{{pOH}} = -\log_{{10}}({oh_minus}) = {round(poh, 4)}'},
                {'description': 'pH:', 'latex': fr'\text{{pH}} = 14 - {round(poh, 4)} = {round(ph, 4)}'},
            ]
        return {
            'success': True, 'problem_type': 'pH of Strong Base', 'formula_used': 'pH = 14 − pOH',
            'given': {'concentration': conc}, 'solve_for': 'pH',
            'steps': steps, 'final_values': [f'pH = {round(ph, 4)}'], 'solutions': [str(round(ph, 4))]
        }

    else:
        # generic: assume strong acid for now
        ph = -math.log10(conc)
        return {
            'success': True, 'problem_type': 'pH Estimation', 'formula_used': 'pH = -log[H⁺]',
            'given': {'concentration': conc}, 'solve_for': 'pH',
            'steps': [
                {'description': 'Assuming strong acid / fully dissociating solution', 'latex': r'\text{pH} = -\log_{10}[\text{H}^+]'},
                {'description': 'Calculate pH:', 'latex': fr'\text{{pH}} = -\log_{{10}}({conc}) = {round(ph, 4)}'},
            ],
            'final_values': [f'pH = {round(ph, 4)}'], 'solutions': [str(round(ph, 4))]
        }


def solve_molarity(text: str, explanation_level: str) -> Dict[str, Any]:
    mass = _find_number(text, ['g', 'gram', 'grams'])
    vol_l = _find_number(text, ['l', 'litre', 'liter'])
    vol_ml = _find_number(text, ['ml', 'millilitre', 'milliliter'])
    formula = _extract_formula_from_text(text)

    if vol_ml and vol_l is None:
        vol_l = vol_ml / 1000

    if mass and vol_l and formula:
        try:
            molar_mass, _ = _molar_mass_of(formula)
            if molar_mass == 0:
                raise ValueError("Unknown formula")
            moles = mass / molar_mass
            molarity = moles / vol_l
            if explanation_level == "Quick":
                 steps = [{'description': 'Molarity:', 'latex': fr'M = {round(molarity, 6)}\ \text{{mol/L}}'}]
            elif explanation_level == "ELI10":
                steps = [
                    {'description': 'Molarity is how "crowded" our mixture is!', 'latex': r'M = \dfrac{n}{V}'},
                    {'description': 'First, we change grams into \"moles\" (chemical counting units):', 'latex': fr'n = \dfrac{{{mass}}}{{{molar_mass}}} = {round(moles, 6)}\ \text{{mol}}'},
                    {'description': 'Then we divide by the liquid volume to see how crowded it is:', 'latex': fr'M = \dfrac{{{round(moles,6)}}}{{{vol_l}}} = {round(molarity, 6)}\ \text{{mol/L}}'},
                ]
            elif explanation_level in ["Detailed", "Proof"]:
                steps = [
                    {'description': 'Determining Molar Concentration (Molarity)', 'latex': r'M = \dfrac{n}{V}'},
                    {'description': f'First, convert solute mass to moles using the molar mass of {formula}:', 'latex': fr'n = \dfrac{{{mass}\text{{ g}}}}{{{molar_mass}\text{{ g/mol}}}} = {round(moles, 6)}\ \text{{mol}}'},
                    {'description': 'Compute concentration by dividing moles by solution volume in liters:', 'latex': fr'M = \dfrac{{{round(moles,6)}\text{{ mol}}}}{{{vol_l}\text{{ L}}}} = {round(molarity, 6)}\ \text{{M}}'},
                ]
            else:
                steps = [
                    {'description': 'Problem Type: Molarity', 'latex': r'M = \dfrac{n}{V}'},
                    {'description': f'Molar mass of {formula}:', 'latex': fr'M({formula}) = {molar_mass}\ \text{{g/mol}}'},
                    {'description': 'Moles:', 'latex': fr'n = \dfrac{{{mass}}}{{{molar_mass}}} = {round(moles, 6)}\ \text{{mol}}'},
                    {'description': 'Molarity:', 'latex': fr'M = \dfrac{{{round(moles,6)}}}{{{vol_l}}} = {round(molarity, 6)}\ \text{{mol/L}}'},
                ]
            return {
                'success': True, 'problem_type': 'Molarity', 'formula_used': 'M = n/V',
                'given': {'mass_g': mass, 'molar_mass': molar_mass, 'volume_L': vol_l}, 'solve_for': 'Molarity',
                'steps': steps, 'final_values': [f'{round(molarity, 4)} mol/L'], 'solutions': [str(round(molarity, 4))]
            }
        except Exception as e:
            return {'success': False, 'error': f'Molarity error: {e}'}

    return {'success': False, 'error': 'Provide: mass (g), volume (L or mL), and compound name/formula.\nExample: "5g NaOH in 500 mL solution"'}


def solve_stoichiometry(text: str, explanation_level: str) -> Dict[str, Any]:
    """Simple mole ratio calculation from a reaction description."""
    # Try to extract a formula pattern like A + B → C
    t = text.lower()
    # Extract given moles
    mol = _find_number(text, ['mol', 'mole', 'moles'])
    formula = _extract_formula_from_text(text)

    if formula and mol:
        molar_mass, _ = _molar_mass_of(formula)
        if molar_mass > 0:
            mass = mol * molar_mass
            if explanation_level == "Quick":
                 steps = [{'description': 'Mass:', 'latex': fr'm = {round(mass, 4)}\ \text{{g}}'}]
            elif explanation_level == "ELI10":
                 steps = [
                    {'description': 'We want to turn chemical amounts (moles) into regular weight (grams)!', 'latex': r'm = n \times M'},
                    {'description': 'We just multiply the amount by how heavy one unit is:', 'latex': fr'm = {mol} \times {molar_mass} = {round(mass, 4)}\ \text{{g}}'},
                ]
            elif explanation_level in ["Detailed", "Proof"]:
                 steps = [
                    {'description': 'Stoichiometric Conversion: Moles to Mass', 'latex': r'm = n \times M'},
                    {'description': f'Utilizing the computed molar mass for {formula} ({molar_mass} g/mol):', 'latex': fr'm = {mol}\text{{ mol}} \times {molar_mass}\text{{ g/mol}}'},
                    {'description': 'Resulting mass in grams:', 'latex': fr'm = {round(mass, 4)}\ \text{{g}}'},
                ]
            else:
                steps = [
                    {'description': 'Problem Type: Stoichiometry (moles → mass)', 'latex': r'm = n \times M'},
                    {'description': f'Molar mass of {formula}:', 'latex': fr'M = {molar_mass}\ \text{{g/mol}}'},
                    {'description': 'Mass:', 'latex': fr'm = {mol} \times {molar_mass} = {round(mass, 4)}\ \text{{g}}'},
                ]
            return {
                'success': True, 'problem_type': 'Stoichiometry', 'formula_used': 'm = n × M',
                'given': {'n_mol': mol, 'formula': formula, 'molar_mass': molar_mass}, 'solve_for': 'mass',
                'steps': steps, 'final_values': [f'{round(mass, 4)} g'], 'solutions': [str(round(mass, 4))]
            }

    # mass → moles
    mass = _find_number(text, ['g', 'gram', 'grams'])
    if formula and mass:
        molar_mass, _ = _molar_mass_of(formula)
        if molar_mass > 0:
            moles = mass / molar_mass
            if explanation_level == "Quick":
                 steps = [{'description': 'Moles:', 'latex': fr'n = {round(moles, 6)}\ \text{{mol}}'}]
            elif explanation_level == "ELI10":
                 steps = [
                    {'description': 'We want to turn regular weight (grams) into chemical amounts (moles)!', 'latex': r'n = \dfrac{m}{M}'},
                    {'description': 'We just divide the weight by how heavy one regular unit is:', 'latex': fr'n = \dfrac{{{mass}}}{{{molar_mass}}} = {round(moles, 6)}\ \text{{mol}}'},
                ]
            elif explanation_level in ["Detailed", "Proof"]:
                 steps = [
                    {'description': 'Stoichiometric Conversion: Mass to Moles', 'latex': r'n = \dfrac{m}{M}'},
                    {'description': f'Utilizing the computed molar mass for {formula} ({molar_mass} g/mol):', 'latex': fr'n = \dfrac{{{mass}\text{{ g}}}}{{{molar_mass}\text{{ g/mol}}}}'},
                    {'description': 'Resulting molar amount:', 'latex': fr'n = {round(moles, 6)}\ \text{{mol}}'},
                ]
            else:
                steps = [
                    {'description': 'Problem Type: Stoichiometry (mass → moles)', 'latex': r'n = \dfrac{m}{M}'},
                    {'description': f'Molar mass of {formula}: {molar_mass} g/mol', 'latex': fr'M({formula}) = {molar_mass}\ \text{{g/mol}}'},
                    {'description': 'Moles:', 'latex': fr'n = \dfrac{{{mass}}}{{{molar_mass}}} = {round(moles, 6)}\ \text{{mol}}'},
                ]
            return {
                'success': True, 'problem_type': 'Stoichiometry', 'formula_used': 'n = m/M',
                'given': {'mass_g': mass, 'molar_mass': molar_mass}, 'solve_for': 'moles',
                'steps': steps, 'final_values': [f'{round(moles, 6)} mol'], 'solutions': [str(round(moles, 6))]
            }

    return {'success': False, 'error': 'Provide a compound name/formula and either mass (g) or moles.\nExample: "how many moles in 44g of CO2"'}


def solve_thermochem(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    mass = _find_number(text, ['g', 'gram', 'grams', 'kg'])
    # Handle kg
    if 'kg' in t:
        kg_val = _find_number(text, ['kg'])
        if kg_val:
            mass = kg_val * 1000

    delta_t_match = re.search(r'(\d+\.?\d*)\s*(?:°c|°k|c|k|degrees?)', t)
    delta_t = float(delta_t_match.group(1)) if delta_t_match else None

    # Specific heat capacity
    c_val = _find_number(text, ['j/g', 'j/kg', 'specific heat', 'c\s*='])

    # Defaults for water
    if c_val is None and any(w in t for w in ['water', 'h2o']):
        c_val = 4.184  # J/g·°C

    # Two temps given
    temps = [float(m) for m in re.findall(r'(\d+\.?\d*)\s*°?[ck]', t)]
    if len(temps) >= 2 and delta_t is None:
        delta_t = abs(temps[-1] - temps[0])

    if mass and c_val and delta_t:
        q = mass * c_val * delta_t
        if explanation_level == "Quick":
            steps = [{'description': 'Heat:', 'latex': fr'q = {round(q, 4)}\ \text{{J}} = {round(q/1000, 4)}\ \text{{kJ}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'Heat changing temperature is like filling a bucket (q = mcΔT)!', 'latex': r'q = mc\Delta T'},
                {'description': 'We multiply Amount x Material Type x Temp Change:', 'latex': fr'q = {mass} \times {c_val} \times {delta_t}'},
                {'description': 'Total Heat:', 'latex': fr'q = {round(q, 4)}\ \text{{J}} = {round(q/1000, 4)}\ \text{{kJ}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'Computation of Sensible Heat Transfer', 'latex': r'q = mc\Delta T'},
                {'description': 'Substituting mass, specific heat capacity, and temperature differential:', 'latex': fr'q = {mass}\text{{ g}} \times {c_val}\text{{ J/g°C}} \times {delta_t}\text{{ °C}}'},
                {'description': 'Resulting thermodynamic energy in Joules and kilojoules:', 'latex': fr'q = {round(q, 4)}\ \text{{J}} = {round(q/1000, 4)}\ \text{{kJ}}'},
            ]
        else:
            steps = [
                {'description': 'Problem Type: Thermochemistry', 'latex': r'q = mc\Delta T'},
                {'description': 'Substitute values:', 'latex': fr'q = {mass}\ \text{{g}} \times {c_val}\ \text{{J/g·°C}} \times {delta_t}\ \text{{°C}}'},
                {'description': 'Heat:', 'latex': fr'q = {round(q, 4)}\ \text{{J}} = {round(q/1000, 4)}\ \text{{kJ}}'},
            ]
        return {
            'success': True, 'problem_type': 'Thermochemistry', 'formula_used': 'q = mcΔT',
            'given': {'m': mass, 'c': c_val, 'ΔT': delta_t}, 'solve_for': 'q',
            'steps': steps,
            'final_values': [f'{round(q, 4)} J ({round(q/1000, 4)} kJ)'],
            'solutions': [str(round(q, 4))]
        }

    return {'success': False, 'error': 'Provide mass, specific heat capacity (c), and temperature change (ΔT).\nExample: "heat to raise 100g water from 20°C to 80°C"'}


def solve_dilution(text: str, explanation_level: str) -> Dict[str, Any]:
    t = text.lower()
    nums = [float(m) for m in re.findall(r'(\d+\.?\d*)', text)]
    # C1V1 = C2V2
    concentrations = [float(m) for m in re.findall(r'(\d+\.?\d*)\s*(?:M\b|mol/L)', text, re.IGNORECASE)]
    volumes = [float(m) for m in re.findall(r'(\d+\.?\d*)\s*(?:mL|L\b|litre|liter)', text, re.IGNORECASE)]

    if len(concentrations) >= 1 and len(volumes) >= 2 and len(concentrations) < 2:
        C1 = concentrations[0]
        V1 = volumes[0]
        V2 = volumes[1]
        C2 = (C1 * V1) / V2
        if explanation_level == "Quick":
            steps = [{'description': 'Final Concentration:', 'latex': fr'C_2 = {round(C2, 6)}\ \text{{M}}'}]
        elif explanation_level == "ELI10":
            steps = [
                {'description': 'Diluting means adding water! The amount of "stuff" stays the same (C1V1 = C2V2).', 'latex': r'C_1 V_1 = C_2 V_2'},
                {'description': 'We divide the (Old Crowdedness × Old Amount) by the New Amount:', 'latex': fr'C_2 = \dfrac{{{C1} \times {V1}}}{{{V2}}}'},
                {'description': 'The new crowdedness is:', 'latex': fr'C_2 = {round(C2, 6)}\ \text{{M}}'},
            ]
        elif explanation_level in ["Detailed", "Proof"]:
            steps = [
                {'description': 'Conservation of moles during dilution process', 'latex': r'C_1 V_1 = C_2 V_2\ (\text{moles}_{initial} = \text{moles}_{final})'},
                {'description': 'Isolating the final concentration C₂:', 'latex': fr'C_2 = \dfrac{{C_1 V_1}}{{V_2}} = \dfrac{{{C1} \times {V1}}}{{{V2}}}'},
                {'description': 'Computed final molar concentration:', 'latex': fr'C_2 = {round(C2, 6)}\ \text{{M}}'},
            ]
        else:
            steps = [
                {'description': 'Problem Type: Dilution', 'latex': r'C_1 V_1 = C_2 V_2'},
                {'description': 'Solve for C₂:', 'latex': fr'C_2 = \dfrac{{C_1 V_1}}{{V_2}} = \dfrac{{{C1} \times {V1}}}{{{V2}}}'},
                {'description': 'Final Concentration:', 'latex': fr'C_2 = {round(C2, 6)}\ \text{{M}}'},
            ]
        return {
            'success': True, 'problem_type': 'Dilution (C₁V₁ = C₂V₂)', 'formula_used': 'C1V1 = C2V2',
            'given': {'C1': C1, 'V1': V1, 'V2': V2}, 'solve_for': 'C2',
            'steps': steps, 'final_values': [f'{round(C2, 6)} M'], 'solutions': [str(round(C2, 6))]
        }

    return {'success': False, 'error': 'For dilution: provide initial concentration (M), initial volume, and final volume.\nExample: "dilute 50 mL of 2M HCl to 200 mL"'}


# ──────────────────────────────────────────────────────────────
# Type detection for chemistry
# ──────────────────────────────────────────────────────────────

def detect_chem_type(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ['molar mass', 'molecular weight', 'molecular mass', 'atomic mass', 'formula mass']):
        return 'molar_mass'
    if any(w in t for w in ['ph', 'poh', 'hydrogen ion', 'hydroxide ion', 'acidic', 'basic', '[h+]', '[oh-]']):
        return 'ph'
    if any(w in t for w in ['molarity', 'concentration', 'dissolv', 'solution', 'molar solution']):
        return 'molarity'
    if any(w in t for w in ['dilut', 'c1v1', 'c1 v1']):
        return 'dilution'
    if any(w in t for w in ['heat', 'temperature', 'cool', 'warm', 'specific heat', 'thermochem', 'q =', 'enthalpy']):
        return 'thermochem'
    if any(w in t for w in ['mole', 'stoichiom', 'how many gram', 'how many mol', 'mass of', 'grams of', 'produced', 'react']):
        return 'stoichiometry'
    if any(w in t for w in ['molar mass', 'weight of']):
        return 'molar_mass'
    return 'unknown'


CHEM_SOLVERS = {
    'molar_mass': solve_molar_mass,
    'ph': solve_ph,
    'molarity': solve_molarity,
    'dilution': solve_dilution,
    'thermochem': solve_thermochem,
    'stoichiometry': solve_stoichiometry,
}


def solve_chemistry_problem(text: str, explanation_level: str = "Step by Step") -> Dict[str, Any]:
    """Entry point for chemistry word problems."""
    chem_type = detect_chem_type(text)
    solver = CHEM_SOLVERS.get(chem_type)

    if solver:
        try:
            return solver(text, explanation_level)
        except Exception as e:
            return {'success': False, 'error': f'Chemistry solver error: {e}'}

    # Fallback: try molar mass if any formula-like pattern exists
    if _extract_formula_from_text(text):
        return solve_molar_mass(text, explanation_level)

    return {
        'success': False,
        'error': (
            'Could not identify the chemistry problem type.\n\n'
            'Supported chemistry problems:\n'
            '  • Molar mass: "molar mass of H2SO4" or "molecular weight of glucose"\n'
            '  • pH: "pH of 0.01M HCl" or "pH of 0.001M NaOH"\n'
            '  • Molarity: "5g NaOH in 500 mL — find molarity"\n'
            '  • Dilution: "dilute 50 mL of 2M HCl to 200 mL"\n'
            '  • Stoichiometry: "how many grams in 2 mol CO2"\n'
            '  • Heat: "heat to raise 100g water from 25°C to 75°C"\n\n'
            'For equations, type directly: e.g.  n = m/M'
        )
    }
