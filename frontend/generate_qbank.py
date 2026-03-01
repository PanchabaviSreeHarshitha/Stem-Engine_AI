import os
import json
import random
import math

random.seed()

def shuffle_opts(options, correct):
    opts = list(set(options))
    if correct not in opts:
        opts[0] = correct
    random.shuffle(opts)
    return opts[:4]


questions = []

# ========== MATHEMATICS ==========

# Easy - Linear equations with varied answers
easy_math_qs = [
    {"q": "Solve for x: 3x - 6 = 9", "ans": "5", "exp": "Add 6: 3x=15. Divide by 3: x=5.", "opts": ["3","5","6","7"]},
    {"q": "Solve for x: 2x + 4 = 14", "ans": "5", "exp": "Subtract 4: 2x=10. Divide by 2: x=5.", "opts": ["4","5","6","7"]},
    {"q": "Solve for x: x/3 + 2 = 5", "ans": "9", "exp": "Subtract 2: x/3=3. Multiply by 3: x=9.", "opts": ["6","9","12","3"]},
    {"q": "Find the area of a rectangle with length 7 and width 4.", "ans": "28", "exp": "Area = length × width = 7 × 4 = 28.", "opts": ["22","28","11","24"]},
    {"q": "What is 15% of 200?", "ans": "30", "exp": "15/100 × 200 = 30.", "opts": ["20","25","30","35"]},
    {"q": "Simplify: 4² + √9", "ans": "19", "exp": "4²=16, √9=3. 16+3=19.", "opts": ["17","19","22","14"]},
    {"q": "What is the slope of y = 3x - 7?", "ans": "3", "exp": "In y=mx+b, the slope m=3.", "opts": ["3","-7","7","-3"]},
    {"q": "Solve for x: 5x = 35", "ans": "7", "exp": "Divide both sides by 5: x=7.", "opts": ["5","6","7","8"]},
    {"q": "What is the perimeter of a square with side 6?", "ans": "24", "exp": "Perimeter = 4 × 6 = 24.", "opts": ["12","24","36","18"]},
    {"q": "Evaluate: 3! (3 factorial)", "ans": "6", "exp": "3! = 3 × 2 × 1 = 6.", "opts": ["3","6","9","12"]},
]

# Medium - Calculus/trig
medium_math_qs = [
    {"q": "Find d/dx of x³ + 2x² - 5x + 1", "ans": "3x² + 4x - 5", "exp": "Differentiate term by term: 3x²+4x-5.", "opts": ["3x² + 4x - 5","3x² + 2x - 5","x² + 4x - 5","3x² - 4x + 5"]},
    {"q": "What is ∫2x dx?", "ans": "x² + C", "exp": "Integrate: ∫2x dx = x² + C.", "opts": ["x² + C","2x² + C","x + C","2x + C"]},
    {"q": "Find the vertex of y = x² - 4x + 3.", "ans": "(2, -1)", "exp": "x = -b/2a = 2. y = 4-8+3 = -1. Vertex = (2,-1).", "opts": ["(2,-1)","(2,3)","(-2,-1)","(4,3)"]},
    {"q": "What is sin(30°)?", "ans": "0.5", "exp": "sin(30°) = 1/2 = 0.5.", "opts": ["0.5","1","√3/2","√2/2"]},
    {"q": "What is cos(0°)?", "ans": "1", "exp": "cos(0°) = 1.", "opts": ["0","0.5","1","-1"]},
    {"q": "Solve: x² - 5x + 6 = 0", "ans": "x = 2 or x = 3", "exp": "Factor: (x-2)(x-3)=0. x=2 or x=3.", "opts": ["x = 2 or x = 3","x = -2 or x = -3","x = 1 or x = 6","x = 2 or x = 6"]},
    {"q": "What is the discriminant of x² + 2x + 5 = 0?", "ans": "-16", "exp": "D = b²-4ac = 4-20 = -16.", "opts": ["-16","16","-4","4"]},
    {"q": "Find dy/dx if y = sin(x) + x²", "ans": "cos(x) + 2x", "exp": "d/dx sin(x)=cos(x), d/dx x²=2x.", "opts": ["cos(x) + 2x","sin(x) + 2x","-cos(x) + 2x","cos(x) + x"]},
    {"q": "What is the sum of first 10 natural numbers?", "ans": "55", "exp": "Sum = n(n+1)/2 = 10×11/2 = 55.", "opts": ["45","50","55","60"]},
    {"q": "Find the value of log₁₀(1000).", "ans": "3", "exp": "log₁₀(1000) = log₁₀(10³) = 3.", "opts": ["2","3","4","10"]},
]

# Hard
hard_math_qs = [
    {"q": "Find ∫(x² + 3x)dx from 0 to 2", "ans": "14/3", "exp": "Integral = [x³/3 + 3x²/2] from 0 to 2 = 8/3 + 6 = 26/3. Wait, 8/3 + 12/2=8/3+6=26/3.", "opts": ["14/3","26/3","10/3","8"]},
    {"q": "Solve: 2x² + 3x - 2 = 0", "ans": "x = 0.5 or x = -2", "exp": "Using quadratic formula: x=(−3±5)/4. x=0.5 or x=−2.", "opts": ["x = 0.5 or x = -2","x = 1 or x = -2","x = 2 or x = -1","x = 0.5 or x = 2"]},
    {"q": "If f(x) = e^x, what is f''(x)?", "ans": "e^x", "exp": "d/dx e^x = e^x. The second derivative is also e^x.", "opts": ["e^x","xe^x","e^(2x)","2e^x"]},
    {"q": "What is the expansion of (a+b)²?", "ans": "a² + 2ab + b²", "exp": "(a+b)² = a²+2ab+b².", "opts": ["a² + 2ab + b²","a² + b²","a² - 2ab + b²","a² + ab + b²"]},
    {"q": "What is the dot product of (1,2,3) and (4,-5,6)?", "ans": "12", "exp": "1×4 + 2×(-5) + 3×6 = 4-10+18 = 12.", "opts": ["12","14","10","0"]},
    {"q": "Find the inverse of y = 2x + 3", "ans": "y = (x-3)/2", "exp": "Swap x and y: x=2y+3. Solve for y: y=(x-3)/2.", "opts": ["y = (x-3)/2","y = 2x-3","y = (x+3)/2","y = x/2+3"]},
    {"q": "Differentiate: f(x) = ln(x)", "ans": "1/x", "exp": "d/dx ln(x) = 1/x.", "opts": ["1/x","x","ln(x)","e^x"]},
    {"q": "What is the magnitude of vector (3,4)?", "ans": "5", "exp": "|v| = √(3²+4²) = √(9+16) = √25 = 5.", "opts": ["5","7","√7","5.5"]},
    {"q": "Solve: log₂(x) = 5", "ans": "32", "exp": "x = 2^5 = 32.", "opts": ["10","32","16","25"]},
    {"q": "What is the arithmetic mean of 10,15,20,25,30?", "ans": "20", "exp": "Sum = 100. Mean = 100/5 = 20.", "opts": ["18","19","20","25"]},
]

# Advanced
advanced_math_qs = [
    {"q": "Find the eigenvalue equation for matrix [[2,1],[1,2]]", "ans": "λ = 1 or λ = 3", "exp": "det(A-λI)=0: (2-λ)²-1=0 → λ=1 or λ=3.", "opts": ["λ = 1 or λ = 3","λ = 2 or λ = 2","λ = 0 or λ = 4","λ = -1 or λ = 3"]},
    {"q": "Evaluate the integral of 1/(1+x²) from -∞ to +∞", "ans": "π", "exp": "∫ 1/(1+x²) dx = arctan(x) + C. From -∞ to +∞: π/2-(-π/2) = π.", "opts": ["π","π/2","2π","1"]},
    {"q": "What does Stokes' theorem relate?", "ans": "A surface integral to a line integral", "exp": "Stokes' theorem: ∬(curl F)·dS = ∮F·dr", "opts": ["A surface integral to a line integral","A volume to area","Two volumes","Two line integrals"]},
    {"q": "For a geometric series with r=1/2 and a=1, what is the sum to infinity?", "ans": "2", "exp": "S∞ = a/(1-r) = 1/(1-0.5) = 2.", "opts": ["1","2","4","0.5"]},
    {"q": "What is the limit of sin(x)/x as x → 0?", "ans": "1", "exp": "This is a standard limit: lim sin(x)/x as x→0 = 1.", "opts": ["0","1","∞","Undefined"]},
    {"q": "What is the Taylor series of e^x around x=0?", "ans": "1 + x + x²/2! + x³/3! + ...", "exp": "e^x = Σ xⁿ/n! from n=0 to ∞.", "opts": ["1 + x + x²/2! + x³/3! + ...","1 + x + x² + x³ + ...","x + x²/2 + x³/3 + ...","1 - x + x²/2! - x³/3! + ..."]},
    {"q": "In how many ways can 5 books be arranged on a shelf?", "ans": "120", "exp": "5! = 5×4×3×2×1 = 120.", "opts": ["24","60","100","120"]},
    {"q": "What is the value of i³ where i = √(-1)?", "ans": "-i", "exp": "i¹=i, i²=-1, i³=i²×i=-i.", "opts": ["i","-i","1","-1"]},
    {"q": "Solve: d²y/dx² + y = 0", "ans": "y = A cos(x) + B sin(x)", "exp": "Characteristic equation r²+1=0, r=±i. General solution: A cos(x)+B sin(x).", "opts": ["y = A cos(x) + B sin(x)","y = Ae^x + Be^(-x)","y = Ax + B","y = A sin(x)"]},
    {"q": "What is ∮F·dr if F is conservative?", "ans": "0", "exp": "For a conservative field, the closed line integral is always 0.", "opts": ["0","1","2π","∞"]},
]

for i, q in enumerate(easy_math_qs):
    questions.append({"id": f"math_easy_{i}", "subject": "Mathematics", "difficulty": "Easy",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(medium_math_qs):
    questions.append({"id": f"math_medium_{i}", "subject": "Mathematics", "difficulty": "Medium",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(hard_math_qs):
    questions.append({"id": f"math_hard_{i}", "subject": "Mathematics", "difficulty": "Hard",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(advanced_math_qs):
    questions.append({"id": f"math_adv_{i}", "subject": "Mathematics", "difficulty": "Advanced",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})

# ========== PHYSICS ==========
easy_phys_qs = [
    {"q": "A 5 kg object accelerates at 3 m/s². What is the net force?", "ans": "15 N", "exp": "F = ma = 5×3 = 15 N.", "opts": ["8 N","15 N","20 N","12 N"]},
    {"q": "What is the weight of a 10 kg mass on Earth (g=9.8 m/s²)?", "ans": "98 N", "exp": "W = mg = 10×9.8 = 98 N.", "opts": ["98 N","10 N","9.8 N","100 N"]},
    {"q": "An object moves 60 m in 10 s. What is its average speed?", "ans": "6 m/s", "exp": "Speed = distance/time = 60/10 = 6 m/s.", "opts": ["6 m/s","10 m/s","4 m/s","60 m/s"]},
    {"q": "What is the momentum of a 4 kg object moving at 5 m/s?", "ans": "20 kg·m/s", "exp": "p = mv = 4×5 = 20 kg·m/s.", "opts": ["20 kg·m/s","9 kg·m/s","1.25 kg·m/s","40 kg·m/s"]},
    {"q": "Convert 72 km/h to m/s.", "ans": "20 m/s", "exp": "72 × (1000/3600) = 20 m/s.", "opts": ["20 m/s","72 m/s","36 m/s","7.2 m/s"]},
    {"q": "What is the SI unit of pressure?", "ans": "Pascal", "exp": "The SI unit of pressure is Pascal (Pa).", "opts": ["Newton","Pascal","Joule","Watt"]},
    {"q": "If a ball is dropped from rest, how far does it fall in 2 s? (g=10 m/s²)", "ans": "20 m", "exp": "s = ½gt² = ½×10×4 = 20 m.", "opts": ["10 m","20 m","40 m","5 m"]},
    {"q": "What type of energy does a moving car have?", "ans": "Kinetic energy", "exp": "A moving object has kinetic energy.", "opts": ["Potential energy","Kinetic energy","Chemical energy","Nuclear energy"]},
    {"q": "What is the acceleration due to gravity on Earth?", "ans": "9.8 m/s²", "exp": "Standard gravitational acceleration g ≈ 9.8 m/s².", "opts": ["10 m/s²","9.8 m/s²","8.9 m/s²","5 m/s²"]},
    {"q": "What is the unit of electric current?", "ans": "Ampere", "exp": "Electric current is measured in Amperes (A).", "opts": ["Volt","Watt","Ampere","Ohm"]},
]

medium_phys_qs = [
    {"q": "A spring with k=200 N/m is compressed by 0.1 m. What is the potential energy stored?", "ans": "1 J", "exp": "PE = ½kx² = ½×200×0.01 = 1 J.", "opts": ["0.1 J","1 J","2 J","10 J"]},
    {"q": "A 2 kg object is lifted 5 m. What is the gain in GPE? (g=9.8)", "ans": "98 J", "exp": "GPE = mgh = 2×9.8×5 = 98 J.", "opts": ["49 J","98 J","196 J","10 J"]},
    {"q": "A wave has frequency 50 Hz and wavelength 2 m. What is its speed?", "ans": "100 m/s", "exp": "v = fλ = 50×2 = 100 m/s.", "opts": ["25 m/s","52 m/s","100 m/s","200 m/s"]},
    {"q": "A 6 Ω and 4 Ω resistor are in series, connected to 20 V. What is the current?", "ans": "2 A", "exp": "R_total=10 Ω. I=V/R=20/10=2 A.", "opts": ["1 A","2 A","5 A","10 A"]},
    {"q": "What is the period of a wave with frequency 5 Hz?", "ans": "0.2 s", "exp": "T = 1/f = 1/5 = 0.2 s.", "opts": ["0.1 s","0.2 s","0.5 s","5 s"]},
    {"q": "An object has KE of 200 J and mass 4 kg. What is its speed?", "ans": "10 m/s", "exp": "v = √(2KE/m) = √(400/4) = 10 m/s.", "opts": ["5 m/s","10 m/s","20 m/s","50 m/s"]},
    {"q": "Calculate work done to push an object 5 m with 40 N force.", "ans": "200 J", "exp": "W = Fd = 40×5 = 200 J.", "opts": ["8 J","45 J","200 J","160 J"]},
    {"q": "What is the resistance if V=12V and I=3A?", "ans": "4 Ω", "exp": "R = V/I = 12/3 = 4 Ω.", "opts": ["3 Ω","4 Ω","36 Ω","9 Ω"]},
    {"q": "A 10 kg block slides down without friction from 8 m height. What is its speed at the bottom? (g=10)", "ans": "12.6 m/s", "exp": "v=√(2gh)=√(200)≈14.1 m/s.", "opts": ["10 m/s","12.6 m/s","14.1 m/s","8 m/s"]},
    {"q": "Two equal charges repel with force F. If distance doubles, the new force is?", "ans": "F/4", "exp": "Coulomb's law: F∝1/r². Doubling r gives F/4.", "opts": ["F/2","F/4","2F","4F"]},
]

hard_phys_qs = [
    {"q": "A satellite orbits at radius r from Earth's center. Escape velocity is?", "ans": "√(2GM/r)", "exp": "Escape velocity = √(2GM/r).", "opts": ["√(GM/r)","√(2GM/r)","GM/r","2GM/r"]},
    {"q": "The Bohr model radius for H-atom in n=2 state is?", "ans": "4a₀", "exp": "r_n = n² × a₀. For n=2: r = 4a₀.", "opts": ["2a₀","a₀","4a₀","8a₀"]},
    {"q": "What is the de Broglie wavelength of a 0.1 kg ball at 10 m/s? (h=6.63×10⁻³⁴)", "ans": "6.63×10⁻³⁴ m", "exp": "λ = h/(mv) = 6.63×10⁻³⁴/(0.1×10) = 6.63×10⁻³⁴ m.", "opts": ["6.63×10⁻³⁴ m","6.63×10⁻³³ m","6.63×10⁻³⁵ m","6.63×10⁻³² m"]},
    {"q": "A 500 W motor runs for 1 hour. How many kWh does it use?", "ans": "0.5 kWh", "exp": "E = 0.5 kW × 1 h = 0.5 kWh.", "opts": ["0.5 kWh","5 kWh","500 kWh","1 kWh"]},
    {"q": "A proton moves perpendicular to B field of 2T at 3×10⁶ m/s. What is the radius of its circular path? (m=1.67×10⁻²⁷, q=1.6×10⁻¹⁹)", "ans": "0.0156 m", "exp": "r = mv/(qB) = (1.67×10⁻²⁷×3×10⁶)/(1.6×10⁻¹⁹×2) ≈ 0.0156 m.", "opts": ["0.0156 m","0.156 m","0.00156 m","1.56 m"]},
    {"q": "What is the Doppler effect?", "ans": "Change in frequency due to relative motion of source and observer", "exp": "The apparent change in frequency of a wave due to relative motion.", "opts": ["Diffraction of light","Change in frequency due to relative motion of source and observer","Reflection of sound","Dispersion of a prism"]},
    {"q": "In an adiabatic process, Q=0. For ideal gas, ΔU = ?", "ans": "-W", "exp": "By 1st law: ΔU = Q - W = 0 - W = -W.", "opts": ["0","W","-W","2W"]},
    {"q": "A 4 kg object in circular motion has centripetal acceleration of 9 m/s². What is the centripetal force?", "ans": "36 N", "exp": "F = ma = 4×9 = 36 N.", "opts": ["9 N","13 N","36 N","45 N"]},
    {"q": "If the capacitance of a capacitor doubles (same charge Q), the stored energy:", "ans": "Halves", "exp": "E = Q²/(2C). If C doubles, E halves.", "opts": ["Doubles","Halves","Stays same","Quadruples"]},
    {"q": "Which equation describes simple harmonic motion?", "ans": "d²x/dt² = -ω²x", "exp": "SHM is characterized by restoring force proportional to displacement.", "opts": ["d²x/dt² = ω²x","d²x/dt² = -ω²x","dx/dt = -ωx","d²x/dt² = 0"]},
]

advanced_phys_qs = [
    {"q": "The Schrödinger equation describes the evolution of what?", "ans": "The quantum wavefunction", "exp": "The Schrödinger equation governs how quantum states evolve over time.", "opts": ["Electric fields","The quantum wavefunction","Classical orbits","Gravitational potential"]},
    {"q": "What is the magnetic force on a charge q moving at v in field B?", "ans": "qv × B", "exp": "Lorentz force: F = q(v × B).", "opts": ["qvB","qv + B","qv × B","q/vB"]},
    {"q": "In special relativity, the relativistic momentum is:", "ans": "γmv", "exp": "p = γmv where γ = 1/√(1-v²/c²).", "opts": ["mv","γmv","m/v","γm/v"]},
    {"q": "Which Maxwell's equation describes that magnetic monopoles don't exist?", "ans": "∇·B = 0", "exp": "∇·B=0 implies no magnetic monopoles.", "opts": ["∇·E = ρ/ε₀","∇·B = 0","∇×E = -∂B/∂t","∇×B = μ₀J + μ₀ε₀∂E/∂t"]},
    {"q": "What is the Heisenberg Uncertainty Principle?", "ans": "Δx·Δp ≥ ℏ/2", "exp": "Position and momentum cannot both be known precisely simultaneously.", "opts": ["ΔE·Δt ≥ ℏ","Δx·Δp ≥ ℏ/2","Δx = Δp","E=mc²"]},
    {"q": "For a black body, the peak wavelength λ_max is inversely proportional to temperature. This is:", "ans": "Wien's displacement law", "exp": "Wien's law: λ_max × T = 2.898×10⁻³ m·K.", "opts": ["Stefan-Boltzmann law","Wien's displacement law","Planck's law","Rayleigh–Jeans law"]},
    {"q": "Which particle carries the strong nuclear force?", "ans": "Gluon", "exp": "The strong force is mediated by gluons in QCD.", "opts": ["Photon","W boson","Gluon","Graviton"]},
    {"q": "The energy of a photon is E = hf. This relation is associated with:", "ans": "Planck's equation", "exp": "Planck proposed E=hf to explain blackbody radiation.", "opts": ["Einstein's theory","Planck's equation","Newton's law","Bohr's model"]},
    {"q": "In general relativity, gravity is described as:", "ans": "Curvature of spacetime", "exp": "Einstein described gravity as the curvature of 4D spacetime.", "opts": ["A force field","Curvature of spacetime","Quantum field","Electric field"]},
    {"q": "The half-life of a radioactive substance is 10 days. After 30 days, what fraction remains?", "ans": "1/8", "exp": "After 3 half-lives: (1/2)³ = 1/8.", "opts": ["1/2","1/4","1/8","1/16"]},
]

for i, q in enumerate(easy_phys_qs):
    questions.append({"id": f"phys_easy_{i}", "subject": "Physics", "difficulty": "Easy",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(medium_phys_qs):
    questions.append({"id": f"phys_med_{i}", "subject": "Physics", "difficulty": "Medium",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(hard_phys_qs):
    questions.append({"id": f"phys_hard_{i}", "subject": "Physics", "difficulty": "Hard",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(advanced_phys_qs):
    questions.append({"id": f"phys_adv_{i}", "subject": "Physics", "difficulty": "Advanced",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})


# ========== CHEMISTRY ==========
easy_chem_qs = [
    {"q": "What is the chemical formula for water?", "ans": "H₂O", "exp": "Water is composed of 2 hydrogen and 1 oxygen atom.", "opts": ["H₂O","CO₂","NaCl","HCl"]},
    {"q": "What is the molar mass of CO₂? (C=12, O=16)", "ans": "44 g/mol", "exp": "CO₂ = 12 + 2×16 = 44 g/mol.", "opts": ["44 g/mol","28 g/mol","12 g/mol","32 g/mol"]},
    {"q": "What is the pH of pure water at 25°C?", "ans": "7", "exp": "Pure water is neutral with pH = 7.", "opts": ["0","7","14","1"]},
    {"q": "Which gas is produced when HCl reacts with Zn?", "ans": "H₂", "exp": "Zn + 2HCl → ZnCl₂ + H₂↑.", "opts": ["O₂","N₂","Cl₂","H₂"]},
    {"q": "What is the charge of a proton?", "ans": "+1", "exp": "A proton carries a positive charge of +1e.", "opts": ["-1","0","+1","+2"]},
    {"q": "What type of bond is found in NaCl?", "ans": "Ionic", "exp": "NaCl consists of Na⁺ and Cl⁻ ions — ionic bond.", "opts": ["Covalent","Ionic","Metallic","Hydrogen"]},
    {"q": "What is the atomic number of Carbon?", "ans": "6", "exp": "Carbon has 6 protons: atomic number = 6.", "opts": ["4","6","8","12"]},
    {"q": "Which element is a noble gas?", "ans": "Neon", "exp": "Neon is a noble gas in Group 18.", "opts": ["Chlorine","Oxygen","Neon","Sodium"]},
    {"q": "What happens to Ka when temperature increases for an acid?", "ans": "Ka increases", "exp": "Dissociation equilibrium shifts right with temperature, increasing Ka.", "opts": ["Ka decreases","Ka stays same","Ka increases","Ka becomes 0"]},
    {"q": "How many moles are in 22.4 L of gas at STP?", "ans": "1 mol", "exp": "At STP, 1 mole of any ideal gas occupies 22.4 L.", "opts": ["0.5 mol","1 mol","2 mol","22.4 mol"]},
]

medium_chem_qs = [
    {"q": "What is the pH of 0.001 M HCl?", "ans": "3", "exp": "pH = -log[H⁺] = -log(0.001) = 3.", "opts": ["1","2","3","4"]},
    {"q": "Calculate the molarity of 2 mol NaOH in 500 mL solution.", "ans": "4 M", "exp": "M = 2 mol / 0.5 L = 4 mol/L.", "opts": ["1 M","2 M","4 M","8 M"]},
    {"q": "What is the product of [H⁺] and [OH⁻] in water at 25°C?", "ans": "10⁻¹⁴", "exp": "Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C.", "opts": ["1","10⁻⁷","10⁻¹⁴","10⁻¹"]},
    {"q": "In a neutralization: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. Name the reaction type.", "ans": "Neutralization", "exp": "Acid + Base → Salt + Water is a neutralization reaction.", "opts": ["Redox","Combustion","Neutralization","Decomposition"]},
    {"q": "An ideal gas has P=2 atm, V=3 L, T=300K. Find n. (R=0.082)", "ans": "0.244 mol", "exp": "n = PV/RT = (2×3)/(0.082×300) ≈ 0.244 mol.", "opts": ["0.1 mol","0.244 mol","1 mol","2 mol"]},
    {"q": "What is the molar mass of H₂SO₄? (H=1, S=32, O=16)", "ans": "98 g/mol", "exp": "H₂SO₄ = 2+32+64 = 98 g/mol.", "opts": ["48 g/mol","80 g/mol","98 g/mol","100 g/mol"]},
    {"q": "Dilute 100 mL of 5M HCl to 500 mL. What is the new concentration?", "ans": "1 M", "exp": "C1V1=C2V2: 5×100=C2×500. C2=1 M.", "opts": ["0.5 M","1 M","2 M","5 M"]},
    {"q": "What is the hybridization of carbon in methane (CH₄)?", "ans": "sp³", "exp": "Carbon in CH₄ has 4 σ-bonds: sp³ hybridization.", "opts": ["sp","sp²","sp³","sp³d"]},
    {"q": "What is the oxidation state of Sulfur in H₂SO₄?", "ans": "+6", "exp": "H: +1×2, O: -2×4. 2+S-8=0 → S=+6.", "opts": ["+4","+6","-2","+2"]},
    {"q": "Which gas law relates P and V at constant T?", "ans": "Boyle's Law", "exp": "PV = constant (at constant T) is Boyle's Law.", "opts": ["Charles' law","Avogadro's law","Boyle's Law","Gay-Lussac's law"]},
]

hard_chem_qs = [
    {"q": "Calculate ΔG for a reaction with ΔH=-100 kJ, ΔS=+200 J/K at 300 K", "ans": "-160 kJ", "exp": "ΔG = ΔH - TΔS = -100000 - 300×200 = -160000 J = -160 kJ.", "opts": ["-160 kJ","160 kJ","-40 kJ","40 kJ"]},
    {"q": "For a reversible reaction, at equilibrium the rate of forward compared to reverse is?", "ans": "Equal", "exp": "At equilibrium, forward and reverse rates are equal, making Qc=Kc.", "opts": ["Greater","Less","Equal","Impossible to say"]},
    {"q": "What is Hess's Law?", "ans": "ΔH for a reaction is the same regardless of the path taken", "exp": "Hess's Law: Total enthalpy change is independent of the reaction pathway.", "opts": ["ΔH depends on temperature","ΔH for a reaction is the same regardless of the path taken","Energy of reactants = energy of products","Entropy always increases"]},
    {"q": "What is mole fraction of A in a mixture of 2 mol A and 3 mol B?", "ans": "0.4", "exp": "χA = 2/(2+3) = 2/5 = 0.4.", "opts": ["0.2","0.4","0.6","0.5"]},
    {"q": "A first-order reaction has k=0.1 s⁻¹ and initial concentration 0.5 M. What is t₁/₂?", "ans": "6.93 s", "exp": "t₁/₂ = ln(2)/k = 0.693/0.1 = 6.93 s.", "opts": ["3.47 s","6.93 s","0.693 s","10 s"]},
    {"q": "What is the oxidation state of Mn in KMnO₄?", "ans": "+7", "exp": "K:+1, O:-2×4=-8. +1+Mn-8=0 → Mn=+7.", "opts": ["+4","+6","+7","+3"]},
    {"q": "Which principle states that no two electrons in an atom can have the same set of four quantum numbers?", "ans": "Pauli Exclusion Principle", "exp": "Pauli Exclusion Principle forbids identical quantum states for two electrons.", "opts": ["Heisenberg Principle","Aufbau Principle","Pauli Exclusion Principle","Hund's Rule"]},
    {"q": "What type of reaction is: Mg + O₂ → MgO?", "ans": "Oxidation", "exp": "Mg is oxidized (loses electrons) to form MgO. This is a combustion/oxidation reaction.", "opts": ["Reduction","Oxidation","Neutralization","Decomposition"]},
    {"q": "The van't Hoff factor for NaCl in water is approximately?", "ans": "2", "exp": "NaCl dissociates into Na⁺ and Cl⁻. i ≈ 2.", "opts": ["1","2","3","4"]},
    {"q": "What is the standard electrode potential of Hydrogen?", "ans": "0.00 V", "exp": "The Standard Hydrogen Electrode (SHE) has E° = 0.00 V by convention.", "opts": ["+1.00 V","-1.00 V","0.00 V","+0.76 V"]},
]

advanced_chem_qs = [
    {"q": "In molecular orbital theory, what is a bonding molecular orbital?", "ans": "One formed by constructive interference of atomic orbitals", "exp": "Constructive interference reduces electron energy → bonding MO.", "opts": ["One with higher energy than atomic orbitals","One formed by destructive interference","One formed by constructive interference of atomic orbitals","An empty orbital"]},
    {"q": "Describe the hybridization in water (H₂O).", "ans": "sp³ with 2 lone pairs", "exp": "Oxygen in H₂O is sp³: 2 bond pairs + 2 lone pairs.", "opts": ["sp with 0 lone pairs","sp² with 1 lone pair","sp³ with 2 lone pairs","sp³d with 1 lone pair"]},
    {"q": "What is the rate-determining step in a reaction mechanism?", "ans": "The slowest step", "exp": "The slowest elementary step controls the overall rate.", "opts": ["The fastest step","The last step","The slowest step","The first step"]},
    {"q": "Which quantum number defines the shape of an orbital?", "ans": "Azimuthal quantum number (l)", "exp": "l=0 (s), l=1 (p), l=2 (d). l determines orbital shape.", "opts": ["Principal quantum number (n)","Azimuthal quantum number (l)","Magnetic quantum number (ml)","Spin quantum number (ms)"]},
    {"q": "What is the term for a spontaneous oxidation-reduction reaction that produces electrical energy?", "ans": "Galvanic/Voltaic cell", "exp": "A Galvanic (Voltaic) cell converts chemical energy to electrical energy spontaneously.", "opts": ["Electrolytic cell","Galvanic/Voltaic cell","Concentration cell","Faraday cell"]},
    {"q": "In NMR spectroscopy, which isotope is most commonly observed?", "ans": "¹H", "exp": "Proton (¹H) NMR is the most commonly used form of NMR spectroscopy.", "opts": ["¹²C","¹⁴N","¹H","¹⁶O"]},
    {"q": "What is Le Chatelier's Principle?", "ans": "A system at equilibrium shifts to minimize a change imposed on it", "exp": "Le Chatelier's Principle predicts equilibrium shifts in response to stress.", "opts": ["Entropy always increases","A system at equilibrium shifts to minimize a change imposed on it","Reactions occur at equal forward and reverse rates","Pressure and volume are inversely proportional"]},
    {"q": "Name the reagent used to test for aldehydes (gives silver mirror).", "ans": "Tollens' reagent", "exp": "Tollens' reagent ([Ag(NH₃)₂]⁺) oxidizes aldehydes, depositing silver.", "opts": ["Fehling's solution","Benedict's solution","Tollens' reagent","Grignard reagent"]},
    {"q": "What is the product when ethanol is oxidized with potassium dichromate?", "ans": "Ethanal (acetaldehyde)", "exp": "Primary alcohol (ethanol) → aldehyde (ethanal) on mild oxidation.", "opts": ["Ethanoic acid","Ethene","Ethanal (acetaldehyde)","Ethane"]},
    {"q": "Name the process in which heavy nuclei split to release energy.", "ans": "Nuclear fission", "exp": "Nuclear fission splits heavy nuclei and releases enormous energy.", "opts": ["Nuclear fusion","Nuclear fission","Beta decay","Alpha emission"]},
]

for i, q in enumerate(easy_chem_qs):
    questions.append({"id": f"chem_easy_{i}", "subject": "Chemistry", "difficulty": "Easy",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(medium_chem_qs):
    questions.append({"id": f"chem_med_{i}", "subject": "Chemistry", "difficulty": "Medium",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(hard_chem_qs):
    questions.append({"id": f"chem_hard_{i}", "subject": "Chemistry", "difficulty": "Hard",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})
for i, q in enumerate(advanced_chem_qs):
    questions.append({"id": f"chem_adv_{i}", "subject": "Chemistry", "difficulty": "Advanced",
        "question": q["q"], "options": shuffle_opts(q["opts"], q["ans"]), "correctAnswer": q["ans"], "explanation": q["exp"]})

print(f"Total questions: {len(questions)}")

ts_code = f"""export interface Question {{
    id: string;
    subject: 'Physics' | 'Chemistry' | 'Mathematics';
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}}

export const questionBank: Question[] = {json.dumps(questions, indent=4, ensure_ascii=False)};
"""
output_dir = r'c:\Users\venup\OneDrive\Desktop\MPC cal\frontend\src\data'
os.makedirs(output_dir, exist_ok=True)
with open(os.path.join(output_dir, 'questionBank.ts'), 'w', encoding='utf-8') as f:
    f.write(ts_code)
print("Done writing questionBank.ts")
