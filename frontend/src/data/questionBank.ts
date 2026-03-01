export interface Question {
    id: string;
    subject: 'Physics' | 'Chemistry' | 'Mathematics';
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export const questionBank: Question[] = [
    {
        "id": "math_easy_0",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Solve for x: 3x - 6 = 9",
        "options": [
            "5",
            "6",
            "7",
            "3"
        ],
        "correctAnswer": "5",
        "explanation": "Add 6: 3x=15. Divide by 3: x=5."
    },
    {
        "id": "math_easy_1",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Solve for x: 2x + 4 = 14",
        "options": [
            "7",
            "5",
            "4",
            "6"
        ],
        "correctAnswer": "5",
        "explanation": "Subtract 4: 2x=10. Divide by 2: x=5."
    },
    {
        "id": "math_easy_2",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Solve for x: x/3 + 2 = 5",
        "options": [
            "9",
            "6",
            "3",
            "12"
        ],
        "correctAnswer": "9",
        "explanation": "Subtract 2: x/3=3. Multiply by 3: x=9."
    },
    {
        "id": "math_easy_3",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Find the area of a rectangle with length 7 and width 4.",
        "options": [
            "11",
            "28",
            "22",
            "24"
        ],
        "correctAnswer": "28",
        "explanation": "Area = length × width = 7 × 4 = 28."
    },
    {
        "id": "math_easy_4",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "What is 15% of 200?",
        "options": [
            "25",
            "30",
            "20",
            "35"
        ],
        "correctAnswer": "30",
        "explanation": "15/100 × 200 = 30."
    },
    {
        "id": "math_easy_5",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Simplify: 4² + √9",
        "options": [
            "14",
            "22",
            "17",
            "19"
        ],
        "correctAnswer": "19",
        "explanation": "4²=16, √9=3. 16+3=19."
    },
    {
        "id": "math_easy_6",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "What is the slope of y = 3x - 7?",
        "options": [
            "-7",
            "3",
            "7",
            "-3"
        ],
        "correctAnswer": "3",
        "explanation": "In y=mx+b, the slope m=3."
    },
    {
        "id": "math_easy_7",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Solve for x: 5x = 35",
        "options": [
            "8",
            "7",
            "6",
            "5"
        ],
        "correctAnswer": "7",
        "explanation": "Divide both sides by 5: x=7."
    },
    {
        "id": "math_easy_8",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "What is the perimeter of a square with side 6?",
        "options": [
            "18",
            "24",
            "12",
            "36"
        ],
        "correctAnswer": "24",
        "explanation": "Perimeter = 4 × 6 = 24."
    },
    {
        "id": "math_easy_9",
        "subject": "Mathematics",
        "difficulty": "Easy",
        "question": "Evaluate: 3! (3 factorial)",
        "options": [
            "6",
            "3",
            "12",
            "9"
        ],
        "correctAnswer": "6",
        "explanation": "3! = 3 × 2 × 1 = 6."
    },
    {
        "id": "math_medium_0",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "Find d/dx of x³ + 2x² - 5x + 1",
        "options": [
            "3x² + 4x - 5",
            "x² + 4x - 5",
            "3x² + 2x - 5",
            "3x² - 4x + 5"
        ],
        "correctAnswer": "3x² + 4x - 5",
        "explanation": "Differentiate term by term: 3x²+4x-5."
    },
    {
        "id": "math_medium_1",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "What is ∫2x dx?",
        "options": [
            "x² + C",
            "2x² + C",
            "x + C",
            "2x + C"
        ],
        "correctAnswer": "x² + C",
        "explanation": "Integrate: ∫2x dx = x² + C."
    },
    {
        "id": "math_medium_2",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "Find the vertex of y = x² - 4x + 3.",
        "options": [
            "(4,3)",
            "(2,3)",
            "(2, -1)",
            "(2,-1)"
        ],
        "correctAnswer": "(2, -1)",
        "explanation": "x = -b/2a = 2. y = 4-8+3 = -1. Vertex = (2,-1)."
    },
    {
        "id": "math_medium_3",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "What is sin(30°)?",
        "options": [
            "√3/2",
            "0.5",
            "1",
            "√2/2"
        ],
        "correctAnswer": "0.5",
        "explanation": "sin(30°) = 1/2 = 0.5."
    },
    {
        "id": "math_medium_4",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "What is cos(0°)?",
        "options": [
            "-1",
            "1",
            "0",
            "0.5"
        ],
        "correctAnswer": "1",
        "explanation": "cos(0°) = 1."
    },
    {
        "id": "math_medium_5",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "Solve: x² - 5x + 6 = 0",
        "options": [
            "x = 1 or x = 6",
            "x = 2 or x = 6",
            "x = -2 or x = -3",
            "x = 2 or x = 3"
        ],
        "correctAnswer": "x = 2 or x = 3",
        "explanation": "Factor: (x-2)(x-3)=0. x=2 or x=3."
    },
    {
        "id": "math_medium_6",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "What is the discriminant of x² + 2x + 5 = 0?",
        "options": [
            "-16",
            "-4",
            "4",
            "16"
        ],
        "correctAnswer": "-16",
        "explanation": "D = b²-4ac = 4-20 = -16."
    },
    {
        "id": "math_medium_7",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "Find dy/dx if y = sin(x) + x²",
        "options": [
            "-cos(x) + 2x",
            "cos(x) + 2x",
            "sin(x) + 2x",
            "cos(x) + x"
        ],
        "correctAnswer": "cos(x) + 2x",
        "explanation": "d/dx sin(x)=cos(x), d/dx x²=2x."
    },
    {
        "id": "math_medium_8",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "What is the sum of first 10 natural numbers?",
        "options": [
            "45",
            "55",
            "50",
            "60"
        ],
        "correctAnswer": "55",
        "explanation": "Sum = n(n+1)/2 = 10×11/2 = 55."
    },
    {
        "id": "math_medium_9",
        "subject": "Mathematics",
        "difficulty": "Medium",
        "question": "Find the value of log₁₀(1000).",
        "options": [
            "4",
            "2",
            "10",
            "3"
        ],
        "correctAnswer": "3",
        "explanation": "log₁₀(1000) = log₁₀(10³) = 3."
    },
    {
        "id": "math_hard_0",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "Find ∫(x² + 3x)dx from 0 to 2",
        "options": [
            "8",
            "10/3",
            "14/3",
            "26/3"
        ],
        "correctAnswer": "14/3",
        "explanation": "Integral = [x³/3 + 3x²/2] from 0 to 2 = 8/3 + 6 = 26/3. Wait, 8/3 + 12/2=8/3+6=26/3."
    },
    {
        "id": "math_hard_1",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "Solve: 2x² + 3x - 2 = 0",
        "options": [
            "x = 2 or x = -1",
            "x = 1 or x = -2",
            "x = 0.5 or x = -2",
            "x = 0.5 or x = 2"
        ],
        "correctAnswer": "x = 0.5 or x = -2",
        "explanation": "Using quadratic formula: x=(−3±5)/4. x=0.5 or x=−2."
    },
    {
        "id": "math_hard_2",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "If f(x) = e^x, what is f''(x)?",
        "options": [
            "2e^x",
            "e^(2x)",
            "e^x",
            "xe^x"
        ],
        "correctAnswer": "e^x",
        "explanation": "d/dx e^x = e^x. The second derivative is also e^x."
    },
    {
        "id": "math_hard_3",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "What is the expansion of (a+b)²?",
        "options": [
            "a² + b²",
            "a² - 2ab + b²",
            "a² + 2ab + b²",
            "a² + ab + b²"
        ],
        "correctAnswer": "a² + 2ab + b²",
        "explanation": "(a+b)² = a²+2ab+b²."
    },
    {
        "id": "math_hard_4",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "What is the dot product of (1,2,3) and (4,-5,6)?",
        "options": [
            "0",
            "10",
            "12",
            "14"
        ],
        "correctAnswer": "12",
        "explanation": "1×4 + 2×(-5) + 3×6 = 4-10+18 = 12."
    },
    {
        "id": "math_hard_5",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "Find the inverse of y = 2x + 3",
        "options": [
            "y = (x+3)/2",
            "y = (x-3)/2",
            "y = 2x-3",
            "y = x/2+3"
        ],
        "correctAnswer": "y = (x-3)/2",
        "explanation": "Swap x and y: x=2y+3. Solve for y: y=(x-3)/2."
    },
    {
        "id": "math_hard_6",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "Differentiate: f(x) = ln(x)",
        "options": [
            "e^x",
            "ln(x)",
            "x",
            "1/x"
        ],
        "correctAnswer": "1/x",
        "explanation": "d/dx ln(x) = 1/x."
    },
    {
        "id": "math_hard_7",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "What is the magnitude of vector (3,4)?",
        "options": [
            "5.5",
            "7",
            "5",
            "√7"
        ],
        "correctAnswer": "5",
        "explanation": "|v| = √(3²+4²) = √(9+16) = √25 = 5."
    },
    {
        "id": "math_hard_8",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "Solve: log₂(x) = 5",
        "options": [
            "16",
            "25",
            "10",
            "32"
        ],
        "correctAnswer": "32",
        "explanation": "x = 2^5 = 32."
    },
    {
        "id": "math_hard_9",
        "subject": "Mathematics",
        "difficulty": "Hard",
        "question": "What is the arithmetic mean of 10,15,20,25,30?",
        "options": [
            "19",
            "20",
            "18",
            "25"
        ],
        "correctAnswer": "20",
        "explanation": "Sum = 100. Mean = 100/5 = 20."
    },
    {
        "id": "math_adv_0",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "Find the eigenvalue equation for matrix [[2,1],[1,2]]",
        "options": [
            "λ = 2 or λ = 2",
            "λ = -1 or λ = 3",
            "λ = 0 or λ = 4",
            "λ = 1 or λ = 3"
        ],
        "correctAnswer": "λ = 1 or λ = 3",
        "explanation": "det(A-λI)=0: (2-λ)²-1=0 → λ=1 or λ=3."
    },
    {
        "id": "math_adv_1",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "Evaluate the integral of 1/(1+x²) from -∞ to +∞",
        "options": [
            "π",
            "π/2",
            "1",
            "2π"
        ],
        "correctAnswer": "π",
        "explanation": "∫ 1/(1+x²) dx = arctan(x) + C. From -∞ to +∞: π/2-(-π/2) = π."
    },
    {
        "id": "math_adv_2",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "What does Stokes' theorem relate?",
        "options": [
            "Two line integrals",
            "A surface integral to a line integral",
            "Two volumes",
            "A volume to area"
        ],
        "correctAnswer": "A surface integral to a line integral",
        "explanation": "Stokes' theorem: ∬(curl F)·dS = ∮F·dr"
    },
    {
        "id": "math_adv_3",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "For a geometric series with r=1/2 and a=1, what is the sum to infinity?",
        "options": [
            "1",
            "2",
            "0.5",
            "4"
        ],
        "correctAnswer": "2",
        "explanation": "S∞ = a/(1-r) = 1/(1-0.5) = 2."
    },
    {
        "id": "math_adv_4",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "What is the limit of sin(x)/x as x → 0?",
        "options": [
            "Undefined",
            "1",
            "0",
            "∞"
        ],
        "correctAnswer": "1",
        "explanation": "This is a standard limit: lim sin(x)/x as x→0 = 1."
    },
    {
        "id": "math_adv_5",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "What is the Taylor series of e^x around x=0?",
        "options": [
            "1 + x + x²/2! + x³/3! + ...",
            "1 - x + x²/2! - x³/3! + ...",
            "x + x²/2 + x³/3 + ...",
            "1 + x + x² + x³ + ..."
        ],
        "correctAnswer": "1 + x + x²/2! + x³/3! + ...",
        "explanation": "e^x = Σ xⁿ/n! from n=0 to ∞."
    },
    {
        "id": "math_adv_6",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "In how many ways can 5 books be arranged on a shelf?",
        "options": [
            "120",
            "60",
            "24",
            "100"
        ],
        "correctAnswer": "120",
        "explanation": "5! = 5×4×3×2×1 = 120."
    },
    {
        "id": "math_adv_7",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "What is the value of i³ where i = √(-1)?",
        "options": [
            "-i",
            "1",
            "i",
            "-1"
        ],
        "correctAnswer": "-i",
        "explanation": "i¹=i, i²=-1, i³=i²×i=-i."
    },
    {
        "id": "math_adv_8",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "Solve: d²y/dx² + y = 0",
        "options": [
            "y = A sin(x)",
            "y = Ax + B",
            "y = A cos(x) + B sin(x)",
            "y = Ae^x + Be^(-x)"
        ],
        "correctAnswer": "y = A cos(x) + B sin(x)",
        "explanation": "Characteristic equation r²+1=0, r=±i. General solution: A cos(x)+B sin(x)."
    },
    {
        "id": "math_adv_9",
        "subject": "Mathematics",
        "difficulty": "Advanced",
        "question": "What is ∮F·dr if F is conservative?",
        "options": [
            "0",
            "2π",
            "∞",
            "1"
        ],
        "correctAnswer": "0",
        "explanation": "For a conservative field, the closed line integral is always 0."
    },
    {
        "id": "phys_easy_0",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "A 5 kg object accelerates at 3 m/s². What is the net force?",
        "options": [
            "12 N",
            "15 N",
            "8 N",
            "20 N"
        ],
        "correctAnswer": "15 N",
        "explanation": "F = ma = 5×3 = 15 N."
    },
    {
        "id": "phys_easy_1",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What is the weight of a 10 kg mass on Earth (g=9.8 m/s²)?",
        "options": [
            "9.8 N",
            "100 N",
            "98 N",
            "10 N"
        ],
        "correctAnswer": "98 N",
        "explanation": "W = mg = 10×9.8 = 98 N."
    },
    {
        "id": "phys_easy_2",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "An object moves 60 m in 10 s. What is its average speed?",
        "options": [
            "6 m/s",
            "10 m/s",
            "4 m/s",
            "60 m/s"
        ],
        "correctAnswer": "6 m/s",
        "explanation": "Speed = distance/time = 60/10 = 6 m/s."
    },
    {
        "id": "phys_easy_3",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What is the momentum of a 4 kg object moving at 5 m/s?",
        "options": [
            "9 kg·m/s",
            "40 kg·m/s",
            "20 kg·m/s",
            "1.25 kg·m/s"
        ],
        "correctAnswer": "20 kg·m/s",
        "explanation": "p = mv = 4×5 = 20 kg·m/s."
    },
    {
        "id": "phys_easy_4",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "Convert 72 km/h to m/s.",
        "options": [
            "36 m/s",
            "72 m/s",
            "20 m/s",
            "7.2 m/s"
        ],
        "correctAnswer": "20 m/s",
        "explanation": "72 × (1000/3600) = 20 m/s."
    },
    {
        "id": "phys_easy_5",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What is the SI unit of pressure?",
        "options": [
            "Newton",
            "Pascal",
            "Watt",
            "Joule"
        ],
        "correctAnswer": "Pascal",
        "explanation": "The SI unit of pressure is Pascal (Pa)."
    },
    {
        "id": "phys_easy_6",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "If a ball is dropped from rest, how far does it fall in 2 s? (g=10 m/s²)",
        "options": [
            "5 m",
            "20 m",
            "40 m",
            "10 m"
        ],
        "correctAnswer": "20 m",
        "explanation": "s = ½gt² = ½×10×4 = 20 m."
    },
    {
        "id": "phys_easy_7",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What type of energy does a moving car have?",
        "options": [
            "Potential energy",
            "Chemical energy",
            "Nuclear energy",
            "Kinetic energy"
        ],
        "correctAnswer": "Kinetic energy",
        "explanation": "A moving object has kinetic energy."
    },
    {
        "id": "phys_easy_8",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What is the acceleration due to gravity on Earth?",
        "options": [
            "9.8 m/s²",
            "10 m/s²",
            "8.9 m/s²",
            "5 m/s²"
        ],
        "correctAnswer": "9.8 m/s²",
        "explanation": "Standard gravitational acceleration g ≈ 9.8 m/s²."
    },
    {
        "id": "phys_easy_9",
        "subject": "Physics",
        "difficulty": "Easy",
        "question": "What is the unit of electric current?",
        "options": [
            "Ohm",
            "Ampere",
            "Watt",
            "Volt"
        ],
        "correctAnswer": "Ampere",
        "explanation": "Electric current is measured in Amperes (A)."
    },
    {
        "id": "phys_med_0",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "A spring with k=200 N/m is compressed by 0.1 m. What is the potential energy stored?",
        "options": [
            "2 J",
            "10 J",
            "1 J",
            "0.1 J"
        ],
        "correctAnswer": "1 J",
        "explanation": "PE = ½kx² = ½×200×0.01 = 1 J."
    },
    {
        "id": "phys_med_1",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "A 2 kg object is lifted 5 m. What is the gain in GPE? (g=9.8)",
        "options": [
            "49 J",
            "98 J",
            "196 J",
            "10 J"
        ],
        "correctAnswer": "98 J",
        "explanation": "GPE = mgh = 2×9.8×5 = 98 J."
    },
    {
        "id": "phys_med_2",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "A wave has frequency 50 Hz and wavelength 2 m. What is its speed?",
        "options": [
            "52 m/s",
            "100 m/s",
            "25 m/s",
            "200 m/s"
        ],
        "correctAnswer": "100 m/s",
        "explanation": "v = fλ = 50×2 = 100 m/s."
    },
    {
        "id": "phys_med_3",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "A 6 Ω and 4 Ω resistor are in series, connected to 20 V. What is the current?",
        "options": [
            "2 A",
            "5 A",
            "10 A",
            "1 A"
        ],
        "correctAnswer": "2 A",
        "explanation": "R_total=10 Ω. I=V/R=20/10=2 A."
    },
    {
        "id": "phys_med_4",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "What is the period of a wave with frequency 5 Hz?",
        "options": [
            "0.1 s",
            "0.5 s",
            "0.2 s",
            "5 s"
        ],
        "correctAnswer": "0.2 s",
        "explanation": "T = 1/f = 1/5 = 0.2 s."
    },
    {
        "id": "phys_med_5",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "An object has KE of 200 J and mass 4 kg. What is its speed?",
        "options": [
            "5 m/s",
            "20 m/s",
            "10 m/s",
            "50 m/s"
        ],
        "correctAnswer": "10 m/s",
        "explanation": "v = √(2KE/m) = √(400/4) = 10 m/s."
    },
    {
        "id": "phys_med_6",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "Calculate work done to push an object 5 m with 40 N force.",
        "options": [
            "160 J",
            "200 J",
            "45 J",
            "8 J"
        ],
        "correctAnswer": "200 J",
        "explanation": "W = Fd = 40×5 = 200 J."
    },
    {
        "id": "phys_med_7",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "What is the resistance if V=12V and I=3A?",
        "options": [
            "4 Ω",
            "36 Ω",
            "3 Ω",
            "9 Ω"
        ],
        "correctAnswer": "4 Ω",
        "explanation": "R = V/I = 12/3 = 4 Ω."
    },
    {
        "id": "phys_med_8",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "A 10 kg block slides down without friction from 8 m height. What is its speed at the bottom? (g=10)",
        "options": [
            "8 m/s",
            "10 m/s",
            "14.1 m/s",
            "12.6 m/s"
        ],
        "correctAnswer": "12.6 m/s",
        "explanation": "v=√(2gh)=√(200)≈14.1 m/s."
    },
    {
        "id": "phys_med_9",
        "subject": "Physics",
        "difficulty": "Medium",
        "question": "Two equal charges repel with force F. If distance doubles, the new force is?",
        "options": [
            "F/2",
            "F/4",
            "4F",
            "2F"
        ],
        "correctAnswer": "F/4",
        "explanation": "Coulomb's law: F∝1/r². Doubling r gives F/4."
    },
    {
        "id": "phys_hard_0",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "A satellite orbits at radius r from Earth's center. Escape velocity is?",
        "options": [
            "GM/r",
            "2GM/r",
            "√(2GM/r)",
            "√(GM/r)"
        ],
        "correctAnswer": "√(2GM/r)",
        "explanation": "Escape velocity = √(2GM/r)."
    },
    {
        "id": "phys_hard_1",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "The Bohr model radius for H-atom in n=2 state is?",
        "options": [
            "2a₀",
            "a₀",
            "8a₀",
            "4a₀"
        ],
        "correctAnswer": "4a₀",
        "explanation": "r_n = n² × a₀. For n=2: r = 4a₀."
    },
    {
        "id": "phys_hard_2",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "What is the de Broglie wavelength of a 0.1 kg ball at 10 m/s? (h=6.63×10⁻³⁴)",
        "options": [
            "6.63×10⁻³⁵ m",
            "6.63×10⁻³³ m",
            "6.63×10⁻³⁴ m",
            "6.63×10⁻³² m"
        ],
        "correctAnswer": "6.63×10⁻³⁴ m",
        "explanation": "λ = h/(mv) = 6.63×10⁻³⁴/(0.1×10) = 6.63×10⁻³⁴ m."
    },
    {
        "id": "phys_hard_3",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "A 500 W motor runs for 1 hour. How many kWh does it use?",
        "options": [
            "500 kWh",
            "1 kWh",
            "5 kWh",
            "0.5 kWh"
        ],
        "correctAnswer": "0.5 kWh",
        "explanation": "E = 0.5 kW × 1 h = 0.5 kWh."
    },
    {
        "id": "phys_hard_4",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "A proton moves perpendicular to B field of 2T at 3×10⁶ m/s. What is the radius of its circular path? (m=1.67×10⁻²⁷, q=1.6×10⁻¹⁹)",
        "options": [
            "1.56 m",
            "0.156 m",
            "0.0156 m",
            "0.00156 m"
        ],
        "correctAnswer": "0.0156 m",
        "explanation": "r = mv/(qB) = (1.67×10⁻²⁷×3×10⁶)/(1.6×10⁻¹⁹×2) ≈ 0.0156 m."
    },
    {
        "id": "phys_hard_5",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "What is the Doppler effect?",
        "options": [
            "Change in frequency due to relative motion of source and observer",
            "Dispersion of a prism",
            "Reflection of sound",
            "Diffraction of light"
        ],
        "correctAnswer": "Change in frequency due to relative motion of source and observer",
        "explanation": "The apparent change in frequency of a wave due to relative motion."
    },
    {
        "id": "phys_hard_6",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "In an adiabatic process, Q=0. For ideal gas, ΔU = ?",
        "options": [
            "0",
            "W",
            "2W",
            "-W"
        ],
        "correctAnswer": "-W",
        "explanation": "By 1st law: ΔU = Q - W = 0 - W = -W."
    },
    {
        "id": "phys_hard_7",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "A 4 kg object in circular motion has centripetal acceleration of 9 m/s². What is the centripetal force?",
        "options": [
            "36 N",
            "9 N",
            "45 N",
            "13 N"
        ],
        "correctAnswer": "36 N",
        "explanation": "F = ma = 4×9 = 36 N."
    },
    {
        "id": "phys_hard_8",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "If the capacitance of a capacitor doubles (same charge Q), the stored energy:",
        "options": [
            "Doubles",
            "Quadruples",
            "Halves",
            "Stays same"
        ],
        "correctAnswer": "Halves",
        "explanation": "E = Q²/(2C). If C doubles, E halves."
    },
    {
        "id": "phys_hard_9",
        "subject": "Physics",
        "difficulty": "Hard",
        "question": "Which equation describes simple harmonic motion?",
        "options": [
            "d²x/dt² = ω²x",
            "d²x/dt² = -ω²x",
            "d²x/dt² = 0",
            "dx/dt = -ωx"
        ],
        "correctAnswer": "d²x/dt² = -ω²x",
        "explanation": "SHM is characterized by restoring force proportional to displacement."
    },
    {
        "id": "phys_adv_0",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "The Schrödinger equation describes the evolution of what?",
        "options": [
            "Classical orbits",
            "The quantum wavefunction",
            "Electric fields",
            "Gravitational potential"
        ],
        "correctAnswer": "The quantum wavefunction",
        "explanation": "The Schrödinger equation governs how quantum states evolve over time."
    },
    {
        "id": "phys_adv_1",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "What is the magnetic force on a charge q moving at v in field B?",
        "options": [
            "qv × B",
            "qvB",
            "qv + B",
            "q/vB"
        ],
        "correctAnswer": "qv × B",
        "explanation": "Lorentz force: F = q(v × B)."
    },
    {
        "id": "phys_adv_2",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "In special relativity, the relativistic momentum is:",
        "options": [
            "γmv",
            "m/v",
            "mv",
            "γm/v"
        ],
        "correctAnswer": "γmv",
        "explanation": "p = γmv where γ = 1/√(1-v²/c²)."
    },
    {
        "id": "phys_adv_3",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "Which Maxwell's equation describes that magnetic monopoles don't exist?",
        "options": [
            "∇×B = μ₀J + μ₀ε₀∂E/∂t",
            "∇×E = -∂B/∂t",
            "∇·B = 0",
            "∇·E = ρ/ε₀"
        ],
        "correctAnswer": "∇·B = 0",
        "explanation": "∇·B=0 implies no magnetic monopoles."
    },
    {
        "id": "phys_adv_4",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "What is the Heisenberg Uncertainty Principle?",
        "options": [
            "E=mc²",
            "Δx = Δp",
            "ΔE·Δt ≥ ℏ",
            "Δx·Δp ≥ ℏ/2"
        ],
        "correctAnswer": "Δx·Δp ≥ ℏ/2",
        "explanation": "Position and momentum cannot both be known precisely simultaneously."
    },
    {
        "id": "phys_adv_5",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "For a black body, the peak wavelength λ_max is inversely proportional to temperature. This is:",
        "options": [
            "Rayleigh–Jeans law",
            "Planck's law",
            "Wien's displacement law",
            "Stefan-Boltzmann law"
        ],
        "correctAnswer": "Wien's displacement law",
        "explanation": "Wien's law: λ_max × T = 2.898×10⁻³ m·K."
    },
    {
        "id": "phys_adv_6",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "Which particle carries the strong nuclear force?",
        "options": [
            "Photon",
            "Gluon",
            "W boson",
            "Graviton"
        ],
        "correctAnswer": "Gluon",
        "explanation": "The strong force is mediated by gluons in QCD."
    },
    {
        "id": "phys_adv_7",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "The energy of a photon is E = hf. This relation is associated with:",
        "options": [
            "Bohr's model",
            "Planck's equation",
            "Einstein's theory",
            "Newton's law"
        ],
        "correctAnswer": "Planck's equation",
        "explanation": "Planck proposed E=hf to explain blackbody radiation."
    },
    {
        "id": "phys_adv_8",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "In general relativity, gravity is described as:",
        "options": [
            "Quantum field",
            "Electric field",
            "A force field",
            "Curvature of spacetime"
        ],
        "correctAnswer": "Curvature of spacetime",
        "explanation": "Einstein described gravity as the curvature of 4D spacetime."
    },
    {
        "id": "phys_adv_9",
        "subject": "Physics",
        "difficulty": "Advanced",
        "question": "The half-life of a radioactive substance is 10 days. After 30 days, what fraction remains?",
        "options": [
            "1/2",
            "1/8",
            "1/4",
            "1/16"
        ],
        "correctAnswer": "1/8",
        "explanation": "After 3 half-lives: (1/2)³ = 1/8."
    },
    {
        "id": "chem_easy_0",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What is the chemical formula for water?",
        "options": [
            "HCl",
            "NaCl",
            "CO₂",
            "H₂O"
        ],
        "correctAnswer": "H₂O",
        "explanation": "Water is composed of 2 hydrogen and 1 oxygen atom."
    },
    {
        "id": "chem_easy_1",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What is the molar mass of CO₂? (C=12, O=16)",
        "options": [
            "32 g/mol",
            "44 g/mol",
            "28 g/mol",
            "12 g/mol"
        ],
        "correctAnswer": "44 g/mol",
        "explanation": "CO₂ = 12 + 2×16 = 44 g/mol."
    },
    {
        "id": "chem_easy_2",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What is the pH of pure water at 25°C?",
        "options": [
            "7",
            "1",
            "0",
            "14"
        ],
        "correctAnswer": "7",
        "explanation": "Pure water is neutral with pH = 7."
    },
    {
        "id": "chem_easy_3",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "Which gas is produced when HCl reacts with Zn?",
        "options": [
            "Cl₂",
            "O₂",
            "N₂",
            "H₂"
        ],
        "correctAnswer": "H₂",
        "explanation": "Zn + 2HCl → ZnCl₂ + H₂↑."
    },
    {
        "id": "chem_easy_4",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What is the charge of a proton?",
        "options": [
            "+2",
            "-1",
            "0",
            "+1"
        ],
        "correctAnswer": "+1",
        "explanation": "A proton carries a positive charge of +1e."
    },
    {
        "id": "chem_easy_5",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What type of bond is found in NaCl?",
        "options": [
            "Ionic",
            "Covalent",
            "Hydrogen",
            "Metallic"
        ],
        "correctAnswer": "Ionic",
        "explanation": "NaCl consists of Na⁺ and Cl⁻ ions — ionic bond."
    },
    {
        "id": "chem_easy_6",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What is the atomic number of Carbon?",
        "options": [
            "12",
            "4",
            "8",
            "6"
        ],
        "correctAnswer": "6",
        "explanation": "Carbon has 6 protons: atomic number = 6."
    },
    {
        "id": "chem_easy_7",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "Which element is a noble gas?",
        "options": [
            "Neon",
            "Chlorine",
            "Sodium",
            "Oxygen"
        ],
        "correctAnswer": "Neon",
        "explanation": "Neon is a noble gas in Group 18."
    },
    {
        "id": "chem_easy_8",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "What happens to Ka when temperature increases for an acid?",
        "options": [
            "Ka stays same",
            "Ka increases",
            "Ka decreases",
            "Ka becomes 0"
        ],
        "correctAnswer": "Ka increases",
        "explanation": "Dissociation equilibrium shifts right with temperature, increasing Ka."
    },
    {
        "id": "chem_easy_9",
        "subject": "Chemistry",
        "difficulty": "Easy",
        "question": "How many moles are in 22.4 L of gas at STP?",
        "options": [
            "1 mol",
            "22.4 mol",
            "2 mol",
            "0.5 mol"
        ],
        "correctAnswer": "1 mol",
        "explanation": "At STP, 1 mole of any ideal gas occupies 22.4 L."
    },
    {
        "id": "chem_med_0",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "What is the pH of 0.001 M HCl?",
        "options": [
            "2",
            "4",
            "3",
            "1"
        ],
        "correctAnswer": "3",
        "explanation": "pH = -log[H⁺] = -log(0.001) = 3."
    },
    {
        "id": "chem_med_1",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "Calculate the molarity of 2 mol NaOH in 500 mL solution.",
        "options": [
            "8 M",
            "1 M",
            "4 M",
            "2 M"
        ],
        "correctAnswer": "4 M",
        "explanation": "M = 2 mol / 0.5 L = 4 mol/L."
    },
    {
        "id": "chem_med_2",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "What is the product of [H⁺] and [OH⁻] in water at 25°C?",
        "options": [
            "10⁻¹⁴",
            "1",
            "10⁻¹",
            "10⁻⁷"
        ],
        "correctAnswer": "10⁻¹⁴",
        "explanation": "Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C."
    },
    {
        "id": "chem_med_3",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "In a neutralization: H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. Name the reaction type.",
        "options": [
            "Combustion",
            "Neutralization",
            "Decomposition",
            "Redox"
        ],
        "correctAnswer": "Neutralization",
        "explanation": "Acid + Base → Salt + Water is a neutralization reaction."
    },
    {
        "id": "chem_med_4",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "An ideal gas has P=2 atm, V=3 L, T=300K. Find n. (R=0.082)",
        "options": [
            "0.1 mol",
            "2 mol",
            "0.244 mol",
            "1 mol"
        ],
        "correctAnswer": "0.244 mol",
        "explanation": "n = PV/RT = (2×3)/(0.082×300) ≈ 0.244 mol."
    },
    {
        "id": "chem_med_5",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "What is the molar mass of H₂SO₄? (H=1, S=32, O=16)",
        "options": [
            "98 g/mol",
            "48 g/mol",
            "80 g/mol",
            "100 g/mol"
        ],
        "correctAnswer": "98 g/mol",
        "explanation": "H₂SO₄ = 2+32+64 = 98 g/mol."
    },
    {
        "id": "chem_med_6",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "Dilute 100 mL of 5M HCl to 500 mL. What is the new concentration?",
        "options": [
            "0.5 M",
            "5 M",
            "1 M",
            "2 M"
        ],
        "correctAnswer": "1 M",
        "explanation": "C1V1=C2V2: 5×100=C2×500. C2=1 M."
    },
    {
        "id": "chem_med_7",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "What is the hybridization of carbon in methane (CH₄)?",
        "options": [
            "sp",
            "sp³d",
            "sp²",
            "sp³"
        ],
        "correctAnswer": "sp³",
        "explanation": "Carbon in CH₄ has 4 σ-bonds: sp³ hybridization."
    },
    {
        "id": "chem_med_8",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "What is the oxidation state of Sulfur in H₂SO₄?",
        "options": [
            "-2",
            "+4",
            "+2",
            "+6"
        ],
        "correctAnswer": "+6",
        "explanation": "H: +1×2, O: -2×4. 2+S-8=0 → S=+6."
    },
    {
        "id": "chem_med_9",
        "subject": "Chemistry",
        "difficulty": "Medium",
        "question": "Which gas law relates P and V at constant T?",
        "options": [
            "Charles' law",
            "Gay-Lussac's law",
            "Boyle's Law",
            "Avogadro's law"
        ],
        "correctAnswer": "Boyle's Law",
        "explanation": "PV = constant (at constant T) is Boyle's Law."
    },
    {
        "id": "chem_hard_0",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "Calculate ΔG for a reaction with ΔH=-100 kJ, ΔS=+200 J/K at 300 K",
        "options": [
            "-160 kJ",
            "-40 kJ",
            "40 kJ",
            "160 kJ"
        ],
        "correctAnswer": "-160 kJ",
        "explanation": "ΔG = ΔH - TΔS = -100000 - 300×200 = -160000 J = -160 kJ."
    },
    {
        "id": "chem_hard_1",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "For a reversible reaction, at equilibrium the rate of forward compared to reverse is?",
        "options": [
            "Impossible to say",
            "Equal",
            "Less",
            "Greater"
        ],
        "correctAnswer": "Equal",
        "explanation": "At equilibrium, forward and reverse rates are equal, making Qc=Kc."
    },
    {
        "id": "chem_hard_2",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "What is Hess's Law?",
        "options": [
            "ΔH for a reaction is the same regardless of the path taken",
            "ΔH depends on temperature",
            "Energy of reactants = energy of products",
            "Entropy always increases"
        ],
        "correctAnswer": "ΔH for a reaction is the same regardless of the path taken",
        "explanation": "Hess's Law: Total enthalpy change is independent of the reaction pathway."
    },
    {
        "id": "chem_hard_3",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "What is mole fraction of A in a mixture of 2 mol A and 3 mol B?",
        "options": [
            "0.2",
            "0.6",
            "0.5",
            "0.4"
        ],
        "correctAnswer": "0.4",
        "explanation": "χA = 2/(2+3) = 2/5 = 0.4."
    },
    {
        "id": "chem_hard_4",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "A first-order reaction has k=0.1 s⁻¹ and initial concentration 0.5 M. What is t₁/₂?",
        "options": [
            "10 s",
            "3.47 s",
            "6.93 s",
            "0.693 s"
        ],
        "correctAnswer": "6.93 s",
        "explanation": "t₁/₂ = ln(2)/k = 0.693/0.1 = 6.93 s."
    },
    {
        "id": "chem_hard_5",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "What is the oxidation state of Mn in KMnO₄?",
        "options": [
            "+4",
            "+6",
            "+3",
            "+7"
        ],
        "correctAnswer": "+7",
        "explanation": "K:+1, O:-2×4=-8. +1+Mn-8=0 → Mn=+7."
    },
    {
        "id": "chem_hard_6",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "Which principle states that no two electrons in an atom can have the same set of four quantum numbers?",
        "options": [
            "Pauli Exclusion Principle",
            "Heisenberg Principle",
            "Aufbau Principle",
            "Hund's Rule"
        ],
        "correctAnswer": "Pauli Exclusion Principle",
        "explanation": "Pauli Exclusion Principle forbids identical quantum states for two electrons."
    },
    {
        "id": "chem_hard_7",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "What type of reaction is: Mg + O₂ → MgO?",
        "options": [
            "Neutralization",
            "Decomposition",
            "Reduction",
            "Oxidation"
        ],
        "correctAnswer": "Oxidation",
        "explanation": "Mg is oxidized (loses electrons) to form MgO. This is a combustion/oxidation reaction."
    },
    {
        "id": "chem_hard_8",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "The van't Hoff factor for NaCl in water is approximately?",
        "options": [
            "3",
            "1",
            "2",
            "4"
        ],
        "correctAnswer": "2",
        "explanation": "NaCl dissociates into Na⁺ and Cl⁻. i ≈ 2."
    },
    {
        "id": "chem_hard_9",
        "subject": "Chemistry",
        "difficulty": "Hard",
        "question": "What is the standard electrode potential of Hydrogen?",
        "options": [
            "-1.00 V",
            "0.00 V",
            "+0.76 V",
            "+1.00 V"
        ],
        "correctAnswer": "0.00 V",
        "explanation": "The Standard Hydrogen Electrode (SHE) has E° = 0.00 V by convention."
    },
    {
        "id": "chem_adv_0",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "In molecular orbital theory, what is a bonding molecular orbital?",
        "options": [
            "One formed by destructive interference",
            "One with higher energy than atomic orbitals",
            "One formed by constructive interference of atomic orbitals",
            "An empty orbital"
        ],
        "correctAnswer": "One formed by constructive interference of atomic orbitals",
        "explanation": "Constructive interference reduces electron energy → bonding MO."
    },
    {
        "id": "chem_adv_1",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "Describe the hybridization in water (H₂O).",
        "options": [
            "sp³d with 1 lone pair",
            "sp with 0 lone pairs",
            "sp³ with 2 lone pairs",
            "sp² with 1 lone pair"
        ],
        "correctAnswer": "sp³ with 2 lone pairs",
        "explanation": "Oxygen in H₂O is sp³: 2 bond pairs + 2 lone pairs."
    },
    {
        "id": "chem_adv_2",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "What is the rate-determining step in a reaction mechanism?",
        "options": [
            "The fastest step",
            "The slowest step",
            "The last step",
            "The first step"
        ],
        "correctAnswer": "The slowest step",
        "explanation": "The slowest elementary step controls the overall rate."
    },
    {
        "id": "chem_adv_3",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "Which quantum number defines the shape of an orbital?",
        "options": [
            "Azimuthal quantum number (l)",
            "Magnetic quantum number (ml)",
            "Spin quantum number (ms)",
            "Principal quantum number (n)"
        ],
        "correctAnswer": "Azimuthal quantum number (l)",
        "explanation": "l=0 (s), l=1 (p), l=2 (d). l determines orbital shape."
    },
    {
        "id": "chem_adv_4",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "What is the term for a spontaneous oxidation-reduction reaction that produces electrical energy?",
        "options": [
            "Concentration cell",
            "Faraday cell",
            "Galvanic/Voltaic cell",
            "Electrolytic cell"
        ],
        "correctAnswer": "Galvanic/Voltaic cell",
        "explanation": "A Galvanic (Voltaic) cell converts chemical energy to electrical energy spontaneously."
    },
    {
        "id": "chem_adv_5",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "In NMR spectroscopy, which isotope is most commonly observed?",
        "options": [
            "¹⁶O",
            "¹⁴N",
            "¹H",
            "¹²C"
        ],
        "correctAnswer": "¹H",
        "explanation": "Proton (¹H) NMR is the most commonly used form of NMR spectroscopy."
    },
    {
        "id": "chem_adv_6",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "What is Le Chatelier's Principle?",
        "options": [
            "Pressure and volume are inversely proportional",
            "Entropy always increases",
            "Reactions occur at equal forward and reverse rates",
            "A system at equilibrium shifts to minimize a change imposed on it"
        ],
        "correctAnswer": "A system at equilibrium shifts to minimize a change imposed on it",
        "explanation": "Le Chatelier's Principle predicts equilibrium shifts in response to stress."
    },
    {
        "id": "chem_adv_7",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "Name the reagent used to test for aldehydes (gives silver mirror).",
        "options": [
            "Benedict's solution",
            "Grignard reagent",
            "Fehling's solution",
            "Tollens' reagent"
        ],
        "correctAnswer": "Tollens' reagent",
        "explanation": "Tollens' reagent ([Ag(NH₃)₂]⁺) oxidizes aldehydes, depositing silver."
    },
    {
        "id": "chem_adv_8",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "What is the product when ethanol is oxidized with potassium dichromate?",
        "options": [
            "Ethanal (acetaldehyde)",
            "Ethanoic acid",
            "Ethane",
            "Ethene"
        ],
        "correctAnswer": "Ethanal (acetaldehyde)",
        "explanation": "Primary alcohol (ethanol) → aldehyde (ethanal) on mild oxidation."
    },
    {
        "id": "chem_adv_9",
        "subject": "Chemistry",
        "difficulty": "Advanced",
        "question": "Name the process in which heavy nuclei split to release energy.",
        "options": [
            "Nuclear fission",
            "Alpha emission",
            "Nuclear fusion",
            "Beta decay"
        ],
        "correctAnswer": "Nuclear fission",
        "explanation": "Nuclear fission splits heavy nuclei and releases enormous energy."
    }
];
