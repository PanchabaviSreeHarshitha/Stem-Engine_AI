import React, { useState, useEffect } from 'react';
import { Atom, Shell, Sigma, Microscope, Search, ChevronRight, BookOpen, ArrowRight, Video, Play, Plus, Trash2, X, Cpu, Sparkles } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import STEMSimulator from './STEMSimulator';
import { translations, Language } from '../translations';

const baseSubjectsData = {
    Physics: {
        icon: Atom,
        color: 'blue',
        topics: [
            { id: 'kinematics', title: 'Kinematics' },
            { id: 'dynamics', title: 'Dynamics (Newton\'s Laws)' },
            { id: 'work-energy', title: 'Work, Energy & Power' },
            { id: 'rotational', title: 'Rotational Motion' },
            { id: 'gravitation', title: 'Gravitation' },
            { id: 'thermodynamics', title: 'Thermodynamics' },
            { id: 'waves', title: 'Waves & Oscillations' },
            { id: 'electrostatics', title: 'Electrostatics' },
            { id: 'current-electricity', title: 'Current Electricity' },
            { id: 'magnetism', title: 'Magnetism' },
            { id: 'optics', title: 'Optics' },
            { id: 'modern-physics', title: 'Modern Physics' },
        ]
    },
    Chemistry: {
        icon: Shell,
        color: 'emerald',
        topics: [
            { id: 'atomic-structure', title: 'Atomic Structure' },
            { id: 'periodic-table', title: 'Periodic Table' },
            { id: 'bonding', title: 'Chemical Bonding' },
            { id: 'stoichiometry', title: 'Stoichiometry' },
            { id: 'states-of-matter', title: 'States of Matter' },
            { id: 'thermochemistry', title: 'Thermochemistry' },
            { id: 'equilibrium', title: 'Chemical Equilibrium' },
            { id: 'electrochemistry', title: 'Electrochemistry' },
            { id: 'kinetics', title: 'Chemical Kinetics' },
            { id: 'organic-basics', title: 'Organic Chemistry Basics' },
            { id: 'hydrocarbons', title: 'Hydrocarbons' },
            { id: 'acids-bases', title: 'Acids & Bases' },
        ]
    },
    Biology: {
        icon: Microscope,
        color: 'rose',
        topics: [
            { id: 'cell-biology', title: 'Cell Biology' },
            { id: 'genetics', title: 'Genetics' },
            { id: 'evolution', title: 'Evolution' },
            { id: 'human-phys', title: 'Human Physiology' },
            { id: 'plant-phys', title: 'Plant Physiology' },
            { id: 'ecology', title: 'Ecology' },
            { id: 'biomolecules', title: 'Biomolecules' },
        ]
    },
    Mathematics: {
        icon: Sigma,
        color: 'purple',
        topics: [
            { id: 'algebra', title: 'Algebra' },
            { id: 'trigonometry', title: 'Trigonometry' },
            { id: 'calculus-diff', title: 'Differential Calculus' },
            { id: 'calculus-int', title: 'Integral Calculus' },
            { id: 'coordinate-geometry', title: 'Coordinate Geometry' },
            { id: 'vectors', title: 'Vectors & 3D' },
            { id: 'matrices', title: 'Matrices & Determinants' },
            { id: 'probability', title: 'Probability' },
            { id: 'statistics', title: 'Statistics' },
            { id: 'differential-equations', title: 'Differential Equations' },
            { id: 'complex-numbers', title: 'Complex Numbers' },
            { id: 'sequences-series', title: 'Sequences & Series' },
        ]
    }
};

export const subjectsData = baseSubjectsData;

export type TopicContent = {
    title: string;
    description: string;
    tags: string[];
    formulas: { equation: string; name: string; desc: string }[];
    videoUrl?: string;
};

export const topicContentMap: Record<string, TopicContent> = {

    // ── BIOLOGY ──────────────────────────────────────────────────────────────

    'cell-biology': {
        title: 'Cell Biology',
        description: 'Study of cell structure, organelles, and processes like mitosis and meiosis.',
        tags: ['Organelles', 'ATP', 'Cell Membrane', 'Mitosis'],
        formulas: [
            { equation: 'SA:V = 3/r', name: 'Surface-Area-to-Volume Ratio', desc: 'Determines efficiency of nutrient exchange.' }
        ]
    },

    genetics: {
        title: 'Genetics',
        description: 'Inheritance patterns, DNA structure, and genetic variation.',
        tags: ['DNA', 'Punnett Square', 'Hardy-Weinberg', 'Genotype'],
        formulas: [
            { equation: 'p² + 2pq + q² = 1', name: 'Hardy-Weinberg Law', desc: 'Equilibrium equation for allele frequencies.' }
        ]
    },

    evolution: {
        title: 'Evolution',
        description: 'Survival of the fittest, natural selection, and the origin of species through genetic variation and environmental adaptation.',
        tags: ['Selection', 'Adaptation', 'Speciation', 'Phylogeny', 'Mutation'],
        formulas: [
            { equation: 'dN/dt = rN', name: 'Population Growth Rate', desc: 'Exponential growth of a biological population.' },
            { equation: 'ω = Σ WᵢPᵢ', name: 'Average Fitness', desc: 'Mean fitness of a population based on individual survival probabilities.' }
        ]
    },

    'human-phys': {
        title: 'Human Physiology',
        description: 'Functions of organ systems in the human body including circulatory, respiratory, and nervous systems.',
        tags: ['Circulation', 'Nervous System', 'Respiration', 'Endocrine', 'Homeostasis'],
        formulas: [
            { equation: 'CO = HR × SV', name: 'Cardiac Output', desc: 'Volume of blood pumped by the heart per minute.' },
            { equation: 'BP = CO × TPR', name: 'Blood Pressure', desc: 'Relationship between cardiac output and resistance.' }
        ]
    },

    'plant-phys': {
        title: 'Plant Physiology',
        description: 'Processes in plants including photosynthesis, transpiration, and nutrient transport via xylem and phloem.',
        tags: ['Photosynthesis', 'Xylem', 'Phloem', 'Stomata', 'Chloroplast'],
        formulas: [
            { equation: 'Ψ_w = Ψ_s + Ψ_p', name: 'Water Potential', desc: 'Sum of solute potential and pressure potential.' },
            { equation: 'CO₂ + H₂O → C₆H₁₂O₆ + O₂', name: 'Photosynthesis', desc: 'Conversion of light energy to chemical energy.' }
        ]
    },

    'ecology': {
        title: 'Ecology & Environment',
        description: 'Interactions between organisms and their environment, food webs, and ecosystem sustainability.',
        tags: ['Ecosystem', 'Food Chain', 'Trophic Levels', 'Sustainability', 'Biodiversity'],
        formulas: [
            { equation: 'E_n = E_{n-1} × 0.1', name: '10% Rule', desc: 'Energy transfer efficiency between trophic levels.' },
            { equation: 'H = -Σ pᵢ ln(pᵢ)', name: 'Shannon Index', desc: 'Mathematical measure of species diversity in a community.' }
        ]
    },

    'biomolecules': {
        title: 'Biomolecules',
        description: 'Chemical components of life: carbohydrates, proteins, lipids, and nucleic acids.',
        tags: ['Amino Acids', 'Enzymes', 'Polysaccharides', 'DNA/RNA', 'Lipids'],
        formulas: [
            { equation: 'v = V_{max}[S] / (K_m + [S])', name: 'Michaelis-Menten', desc: 'Describes the rate of enzymatic reactions.' },
            { equation: 'pH = pKa + log([A⁻]/[HA])', name: 'H-H Equation', desc: 'Relates pH to buffers in biological systems.' }
        ]
    },

    // ── PHYSICS ──────────────────────────────────────────────────────────────

    kinematics: {
        title: 'Kinematics',
        description: 'Kinematics is the branch of mechanics describing the motion of objects without considering the forces that cause the motion. It studies position, velocity, acceleration, and time for linear and projectile motion.',
        tags: ['Displacement', 'Velocity', 'Acceleration', 'Projectile Motion', 'Uniform Motion'],
        formulas: [
            { equation: 'v = u + at', name: 'First Equation of Motion', desc: 'Relates final velocity v to initial velocity u, acceleration a, and time t.' },
            { equation: 's = ut + ½at²', name: 'Second Equation of Motion', desc: 'Gives displacement s in terms of initial velocity, acceleration, and time.' },
            { equation: 'v² = u² + 2as', name: 'Third Equation of Motion', desc: 'Relates velocity to displacement without explicitly involving time.' },
            { equation: 'R = u²sin(2θ)/g', name: 'Projectile Range', desc: 'Horizontal range of a projectile launched at angle θ with speed u.' },
            { equation: 'H = u²sin²(θ)/(2g)', name: 'Maximum Height', desc: 'Maximum height reached in projectile motion.' },
        ],
    },

    dynamics: {
        title: "Dynamics (Newton's Laws)",
        description: "Newton's Laws of Motion form the foundation of classical mechanics. They describe the relationship between forces acting on a body and the body's motion in response to those forces.",
        tags: ["Newton's Laws", 'Inertia', 'Force', 'Momentum', 'Friction'],
        formulas: [
            { equation: 'F = ma', name: "Newton's Second Law", desc: 'Net force equals mass times acceleration.' },
            { equation: 'p = mv', name: 'Linear Momentum', desc: 'Momentum is the product of mass and velocity.' },
            { equation: 'F·Δt = Δp', name: 'Impulse-Momentum Theorem', desc: 'Impulse equals change in momentum.' },
            { equation: 'f = μN', name: 'Friction Force', desc: 'Friction force equals the coefficient μ times the normal force N.' },
            { equation: 'F₁₂ = −F₂₁', name: "Newton's Third Law", desc: 'Every action has an equal and opposite reaction.' },
        ],
    },

    'work-energy': {
        title: 'Work, Energy & Power',
        description: 'This topic covers the concepts of work done by forces, kinetic and potential energy, the work-energy theorem, and power as the rate of doing work.',
        tags: ['Work', 'Kinetic Energy', 'Potential Energy', 'Work-Energy Theorem', 'Power'],
        formulas: [
            { equation: 'W = F·d·cos(θ)', name: 'Work Done', desc: 'Work = force × displacement × cosine of angle between them.' },
            { equation: 'KE = ½mv²', name: 'Kinetic Energy', desc: 'Energy possessed by a body due to its motion.' },
            { equation: 'PE = mgh', name: 'Gravitational Potential Energy', desc: 'Energy stored due to position in a gravitational field.' },
            { equation: 'W_net = ΔKE', name: 'Work-Energy Theorem', desc: 'Net work done equals change in kinetic energy.' },
            { equation: 'P = W/t = F·v', name: 'Power', desc: 'Rate of doing work; also equals force × velocity.' },
        ]
    },

    rotational: {
        title: 'Rotational Motion',
        description: 'Rotational motion deals with objects rotating around a fixed axis. It introduces analogues of linear quantities — angular displacement, velocity, acceleration — and rotational dynamics including torque and moment of inertia.',
        tags: ['Torque', 'Moment of Inertia', 'Angular Momentum', 'Rolling Motion'],
        formulas: [
            { equation: 'τ = r × F = Iα', name: 'Torque', desc: 'Torque is the rotational equivalent of force; equals moment of inertia × angular acceleration.' },
            { equation: 'L = Iω', name: 'Angular Momentum', desc: 'Angular momentum = moment of inertia × angular velocity.' },
            { equation: 'I = Σmᵢrᵢ²', name: 'Moment of Inertia', desc: 'Sum of mass × radius² for all particles; depends on axis of rotation.' },
            { equation: 'KE_rot = ½Iω²', name: 'Rotational Kinetic Energy', desc: 'Kinetic energy due to rotation.' },
            { equation: 'v = rω', name: 'Linear-Angular Velocity Relation', desc: 'Linear velocity at radius r from axis.' },
        ]
    },

    gravitation: {
        title: 'Gravitation',
        description: "Newton's Law of Gravitation describes the attractive force between any two masses. This topic covers orbital mechanics, escape velocity, and satellite motion.",
        tags: ['Gravitational Force', 'Orbital Motion', 'Escape Velocity', 'Potential Energy'],
        formulas: [
            { equation: 'F = Gm₁m₂/r²', name: "Newton's Law of Gravitation", desc: 'Attractive force between two masses separated by distance r.' },
            { equation: 'g = GM/R²', name: 'Acceleration due to Gravity', desc: 'Surface gravity of a planet of mass M and radius R.' },
            { equation: 'v_e = √(2gR)', name: 'Escape Velocity', desc: 'Minimum speed required to escape a planet\'s gravity.' },
            { equation: 'v_o = √(gR)', name: 'Orbital Velocity', desc: 'Speed for circular orbit just above the surface.' },
            { equation: 'T² ∝ r³', name: "Kepler's Third Law", desc: 'Square of orbital period is proportional to cube of orbital radius.' },
        ]
    },

    thermodynamics: {
        title: 'Thermodynamics',
        description: 'Thermodynamics deals with heat, temperature, and the transfer of energy. The four laws govern everything from engines to refrigerators to the universe\'s entropy.',
        tags: ['Laws of Thermodynamics', 'Heat', 'Entropy', 'Carnot Cycle', 'Ideal Gases'],
        formulas: [
            { equation: 'ΔU = Q − W', name: 'First Law of Thermodynamics', desc: 'Change in internal energy equals heat absorbed minus work done by system.' },
            { equation: 'PV = nRT', name: 'Ideal Gas Law', desc: 'Relates pressure, volume, moles, and temperature of an ideal gas.' },
            { equation: 'η = 1 − T_cold/T_hot', name: 'Carnot Efficiency', desc: 'Maximum efficiency of a heat engine operating between two temperatures.' },
            { equation: 'ΔS = Q/T', name: 'Entropy Change', desc: 'Entropy change for a reversible process at temperature T.' },
            { equation: 'C_p − C_v = R', name: 'Mayer\'s Relation', desc: 'Difference between molar heat capacities at constant pressure and volume.' },
        ]
    },

    waves: {
        title: 'Waves & Oscillations',
        description: 'Waves transfer energy through a medium without transferring matter. This topic covers SHM, wave properties, sound, and the Doppler effect.',
        tags: ['SHM', 'Wave Speed', 'Frequency', 'Resonance', 'Doppler Effect'],
        formulas: [
            { equation: 'v = fλ', name: 'Wave Speed', desc: 'Speed = frequency × wavelength.' },
            { equation: 'f = 1/T', name: 'Frequency-Period Relation', desc: 'Frequency is the reciprocal of time period.' },
            { equation: 'T = 2π√(l/g)', name: 'Simple Pendulum Period', desc: 'Time period of a simple pendulum of length l.' },
            { equation: 'T = 2π√(m/k)', name: 'Spring-Mass Period', desc: 'Period of mass m on spring with constant k.' },
            { equation: "f' = f(v±v_o)/(v∓v_s)", name: 'Doppler Effect', desc: 'Observed frequency when source/observer are in relative motion.' },
        ]
    },

    electrostatics: {
        title: 'Electrostatics',
        description: "Electrostatics studies stationary electric charges. Coulomb's law, electric fields, potential, and capacitance form the foundation of this topic.",
        tags: ["Coulomb's Law", 'Electric Field', 'Potential', 'Capacitance', 'Gauss\'s Law'],
        formulas: [
            { equation: 'F = kq₁q₂/r²', name: "Coulomb's Law", desc: 'Force between two point charges q₁ and q₂ separated by distance r.' },
            { equation: 'E = F/q = kQ/r²', name: 'Electric Field', desc: 'Force per unit charge; field of a point charge Q at distance r.' },
            { equation: 'V = kQ/r', name: 'Electric Potential', desc: 'Work done per unit charge to bring a test charge from infinity to r.' },
            { equation: 'C = Q/V = ε₀A/d', name: 'Capacitance', desc: 'Charge stored per unit voltage; parallel-plate formula shown.' },
            { equation: 'U = ½CV² = Q²/2C', name: 'Energy Stored in Capacitor', desc: 'Electrostatic energy stored in a charged capacitor.' },
        ]
    },

    'current-electricity': {
        title: 'Current Electricity',
        description: 'Current electricity covers the flow of charge through conductors, Ohm\'s law, resistance, power dissipation, and circuit analysis with Kirchhoff\'s laws.',
        tags: ["Ohm's Law", 'Resistance', 'Kirchhoff\'s Laws', 'Power', 'EMF'],
        formulas: [
            { equation: 'V = IR', name: "Ohm's Law", desc: 'Voltage equals current times resistance.' },
            { equation: 'P = VI = I²R = V²/R', name: 'Power Dissipation', desc: 'Electrical power dissipated by a resistor.' },
            { equation: 'R = ρL/A', name: 'Resistance Formula', desc: 'Resistance in terms of resistivity, length, and cross-section area.' },
            { equation: 'ΣV = 0 (loop)', name: "Kirchhoff's Voltage Law", desc: 'Sum of all voltages around a closed loop is zero.' },
            { equation: 'ΣI = 0 (node)', name: "Kirchhoff's Current Law", desc: 'Sum of currents entering a node equals sum leaving.' },
        ]
    },

    magnetism: {
        title: 'Magnetism',
        description: 'Magnetism covers magnetic fields produced by currents and magnets, force on moving charges, electromagnetic induction, and AC circuits.',
        tags: ['Magnetic Force', 'Biot-Savart Law', 'Faraday\'s Law', 'Lenz\'s Law', 'Inductance'],
        formulas: [
            { equation: 'F = qv × B', name: 'Lorentz Force', desc: 'Force on a charge q moving with velocity v in magnetic field B.' },
            { equation: 'F = BIL', name: 'Force on Current Conductor', desc: 'Force on a current-carrying conductor of length L in field B.' },
            { equation: 'B = μ₀I/2πr', name: 'Field of Long Wire', desc: 'Magnetic field at distance r from a long straight current-carrying wire.' },
            { equation: 'ε = −dΦ/dt', name: "Faraday's Law", desc: 'Induced EMF equals rate of change of magnetic flux.' },
            { equation: 'ε = −L(dI/dt)', name: 'Self-Inductance', desc: 'EMF induced by changing current in an inductor of inductance L.' },
        ]
    },

    optics: {
        title: 'Optics',
        description: 'Optics studies the behaviour of light, including reflection, refraction, lens and mirror formulae, optical instruments, and wave optics phenomena.',
        tags: ['Reflection', 'Refraction', 'Lens Formula', 'Snell\'s Law', 'Diffraction'],
        formulas: [
            { equation: 'n = c/v', name: 'Refractive Index', desc: 'Ratio of speed of light in vacuum to speed in medium.' },
            { equation: 'n₁sinθ₁ = n₂sinθ₂', name: "Snell's Law", desc: 'Governs the bending of light at an interface between two media.' },
            { equation: '1/v − 1/u = 1/f', name: 'Mirror/Lens Formula', desc: 'Relates object distance u, image distance v, and focal length f.' },
            { equation: 'm = −v/u', name: 'Magnification', desc: 'Ratio of image size to object size.' },
            { equation: 'sinθ_c = 1/n', name: 'Critical Angle', desc: 'Angle beyond which total internal reflection occurs.' },
        ]
    },

    'modern-physics': {
        title: 'Modern Physics',
        description: 'Modern physics covers quantum mechanics, the photoelectric effect, atomic spectra, nuclear physics, and special relativity — all fundamental to 20th-century science.',
        tags: ['Photoelectric Effect', 'De Broglie', 'Bohr Model', 'Radioactivity', 'Fission/Fusion'],
        formulas: [
            { equation: 'E = hf', name: 'Photon Energy', desc: 'Energy of a photon is Planck\'s constant h times frequency f.' },
            { equation: 'λ = h/mv', name: 'De Broglie Wavelength', desc: 'Wave nature of matter: wavelength of a particle with momentum mv.' },
            { equation: '1/λ = R(1/n₁² − 1/n₂²)', name: 'Rydberg Formula', desc: 'Wavelengths of spectral lines in hydrogen atom.' },
            { equation: 'E = mc²', name: 'Mass-Energy Equivalence', desc: 'Energy equivalent of mass m; cornerstone of special relativity.' },
            { equation: 'N = N₀e^(−λt)', name: 'Radioactive Decay', desc: 'Number of undecayed nuclei at time t; λ is the decay constant.' },
        ]
    },

    // ── CHEMISTRY ────────────────────────────────────────────────────────────

    'atomic-structure': {
        title: 'Atomic Structure',
        description: 'Atomic structure explores the composition of atoms: protons, neutrons, and electrons, along with quantum mechanical models describing electron orbitals and energy levels.',
        tags: ['Bohr Model', 'Quantum Numbers', 'Orbitals', 'Electronic Configuration', 'Aufbau Principle'],
        formulas: [
            { equation: 'E_n = −13.6/n² eV', name: 'Bohr Energy Levels', desc: 'Energy of nth orbit in hydrogen atom.' },
            { equation: 'r_n = 0.529·n² Å', name: 'Bohr Radius', desc: 'Radius of nth Bohr orbit in hydrogen.' },
            { equation: 'ΔE = hf', name: 'Energy of Emitted Photon', desc: 'Energy released when electron transitions between levels.' },
            { equation: 'Max electrons = 2n²', name: 'Shell Capacity', desc: 'Maximum electrons in shell n.' },
            { equation: 'λ = h/mv', name: 'De Broglie Wavelength', desc: 'Wave nature of electrons used in quantum mechanical model.' },
        ],
    },

    'periodic-table': {
        title: 'Periodic Table',
        description: 'The periodic table organises elements by atomic number, revealing periodic trends in atomic radius, ionisation energy, electronegativity, and electron affinity.',
        tags: ['Atomic Radius', 'Ionisation Energy', 'Electronegativity', 'Periods', 'Groups'],
        formulas: [
            { equation: 'IE ∝ Z_eff / r', name: 'Ionisation Energy Trend', desc: 'IE increases across a period and decreases down a group.' },
            { equation: 'Z_eff = Z − σ', name: 'Effective Nuclear Charge', desc: 'Nuclear charge felt by outer electrons after shielding σ.' },
            { equation: 'r ↓ across period', name: 'Atomic Radius Trend', desc: 'Atomic radius decreases across a period due to increasing Z_eff.' },
            { equation: 'EN(Pauling): F=3.98', name: 'Electronegativity Scale', desc: 'Fluorine is the most electronegative element on the Pauling scale.' },
            { equation: 'EA = energy released', name: 'Electron Affinity', desc: 'Energy released when an electron is added to a neutral atom.' },
        ]
    },

    bonding: {
        title: 'Chemical Bonding',
        description: 'Chemical bonding explains how atoms combine to form molecules using ionic, covalent, and metallic bonds. VSEPR theory predicts molecular geometry.',
        tags: ['Ionic Bond', 'Covalent Bond', 'VSEPR', 'Hybridisation', 'Polarity'],
        formulas: [
            { equation: 'U = kq₁q₂/r', name: 'Lattice Energy', desc: 'Energy of an ionic crystal lattice; depends on charge and ionic radius.' },
            { equation: 'Bond Order = (BMO−BAMO)/2', name: 'Bond Order (MOT)', desc: 'MO theory: bonding minus anti-bonding electrons divided by 2.' },
            { equation: 'μ = q × d', name: 'Dipole Moment', desc: 'Measure of polarity: charge × bond length.' },
            { equation: "VSEPR: BP + LP determines shape", name: 'VSEPR Rule', desc: 'Shape determined by bonding pairs (BP) and lone pairs (LP).' },
            { equation: "sp³ → tetrahedral (109.5°)", name: 'Hybridisation Angles', desc: 'sp → 180°, sp² → 120°, sp³ → 109.5°.' },
        ]
    },

    stoichiometry: {
        title: 'Stoichiometry',
        description: 'Stoichiometry is the quantitative relationship between reactants and products in chemical reactions. It uses molar mass, mole ratios, limiting reagents, and percent yield.',
        tags: ['Mole Concept', 'Limiting Reagent', 'Percent Yield', 'Molar Mass', 'Molarity'],
        formulas: [
            { equation: 'n = m/M', name: 'Moles from Mass', desc: 'Moles = mass (g) / molar mass (g/mol).' },
            { equation: 'n = N/N_A', name: 'Moles from Number', desc: 'Moles = number of particles / Avogadro\'s number (6.022×10²³).' },
            { equation: 'M = n/V(L)', name: 'Molarity', desc: 'Concentration in moles per litre of solution.' },
            { equation: '% yield = (actual/theoretical)×100', name: 'Percent Yield', desc: 'Efficiency of a reaction.' },
            { equation: 'C₁V₁ = C₂V₂', name: 'Dilution Formula', desc: 'Concentration × volume is constant on dilution.' },
        ]
    },

    'states-of-matter': {
        title: 'States of Matter',
        description: 'States of matter examines solid, liquid, and gas phases. Kinetic molecular theory, ideal and real gas laws, and intermolecular forces are central themes.',
        tags: ['Ideal Gas Law', 'van der Waals', 'KMT', 'Phase Changes'],
        formulas: [
            { equation: 'PV = nRT', name: 'Ideal Gas Law', desc: 'P in Pa, V in m³, n moles, R = 8.314 J/mol·K.' },
            { equation: '(P + an²/V²)(V−nb) = nRT', name: 'van der Waals Equation', desc: 'Corrects ideal gas law for intermolecular attractions (a) and volume (b).' },
            { equation: 'P₁V₁/T₁ = P₂V₂/T₂', name: 'Combined Gas Law', desc: 'Combines Boyle\'s, Charles\'s, and Gay-Lussac\'s laws.' },
            { equation: 'KE_avg = (3/2)kT', name: 'Average KE per Molecule', desc: 'Average kinetic energy proportional to absolute temperature.' },
            { equation: 'v_rms = √(3RT/M)', name: 'RMS Speed', desc: 'Root mean square speed of gas molecules.' },
        ]
    },

    thermochemistry: {
        title: 'Thermochemistry',
        description: 'Thermochemistry studies energy changes in chemical reactions, including enthalpy, entropy, and Gibbs free energy to predict spontaneity.',
        tags: ['Enthalpy', 'Hess\'s Law', 'Entropy', 'Gibbs Free Energy', 'Bond Enthalpies'],
        formulas: [
            { equation: 'ΔH = H_products − H_reactants', name: 'Enthalpy Change', desc: 'Heat absorbed/released at constant pressure.' },
            { equation: "ΔH°_rxn = ΣΔH°_f(products) − ΣΔH°_f(reactants)", name: "Hess's Law", desc: 'Standard enthalpy from formation enthalpies.' },
            { equation: 'ΔG = ΔH − TΔS', name: 'Gibbs Free Energy', desc: 'ΔG < 0 means spontaneous; ΔG = 0 at equilibrium.' },
            { equation: 'ΔG° = −RT ln K', name: 'Gibbs and Equilibrium', desc: 'Relationship between standard free energy and equilibrium constant.' },
            { equation: 'q = mcΔT', name: 'Heat Formula', desc: 'Heat = mass × specific heat capacity × temperature change.' },
        ]
    },

    equilibrium: {
        title: 'Chemical Equilibrium',
        description: 'Equilibrium describes the state where forward and reverse reaction rates are equal. Le Chatelier\'s principle predicts how systems respond to stress.',
        tags: ['K_eq', 'K_p', 'K_c', 'Le Chatelier', 'Solubility Product'],
        formulas: [
            { equation: 'K_c = [products]^n/[reactants]^m', name: 'Equilibrium Constant', desc: 'Ratio of product to reactant concentrations at equilibrium.' },
            { equation: 'Kp = Kc(RT)^Δn', name: 'Kp and Kc Relation', desc: 'Δn = moles of gaseous products − reactants.' },
            { equation: 'pH = −log[H⁺]', name: 'pH Definition', desc: 'Measure of hydrogen ion concentration.' },
            { equation: 'Ka × Kb = Kw = 10⁻¹⁴', name: 'Water Dissociation', desc: 'Product of acid/base dissociation constants at 25°C.' },
            { equation: 'K_sp = [M⁺]^a[X⁻]^b', name: 'Solubility Product', desc: 'Equilibrium constant for dissolution of sparingly soluble salt.' },
        ]
    },

    electrochemistry: {
        title: 'Electrochemistry',
        description: 'Electrochemistry links chemical reactions to electrical energy. It covers galvanic cells, electrolysis, Faraday\'s laws, and the Nernst equation.',
        tags: ['Galvanic Cell', 'Electrolysis', 'Nernst Equation', 'Faraday\'s Laws', 'EMF'],
        formulas: [
            { equation: 'E°_cell = E°_cathode − E°_anode', name: 'Cell EMF', desc: 'Standard cell potential from standard reduction potentials.' },
            { equation: 'ΔG° = −nFE°', name: 'Gibbs-EMF Relation', desc: 'n = moles of electrons, F = 96485 C/mol.' },
            { equation: 'E = E° − (RT/nF)ln Q', name: 'Nernst Equation', desc: 'Cell potential at non-standard conditions.' },
            { equation: 'm = ZIt = (M/nF)It', name: "Faraday's First Law", desc: 'Mass deposited = electrochemical equivalent × current × time.' },
            { equation: 'K = e^(nFE°/RT)', name: 'EMF and Equilibrium', desc: 'Equilibrium constant from standard cell potential.' },
        ]
    },

    kinetics: {
        title: 'Chemical Kinetics',
        description: 'Chemical kinetics studies the rate of chemical reactions and factors that influence them, including concentration, temperature, and catalysts.',
        tags: ['Rate Law', 'Half-life', 'Arrhenius Equation', 'Order of Reaction', 'Activation Energy'],
        formulas: [
            { equation: 'rate = k[A]^m[B]^n', name: 'Rate Law', desc: 'Rate depends on rate constant k and concentrations raised to their orders.' },
            { equation: 't₁/₂ = 0.693/k', name: 'First-Order Half-life', desc: 'Time for half the reactant to be consumed; independent of concentration.' },
            { equation: 'k = Ae^(−Ea/RT)', name: 'Arrhenius Equation', desc: 'Rate constant depends on activation energy Ea and temperature T.' },
            { equation: 'ln(k₂/k₁) = (Ea/R)(1/T₁−1/T₂)', name: 'Arrhenius (Two Temperatures)', desc: 'Compares rate constants at two temperatures.' },
            { equation: '[A] = [A]₀e^(−kt)', name: 'First-Order Integration', desc: 'Concentration at time t for first-order reaction.' },
        ]
    },

    'organic-basics': {
        title: 'Organic Chemistry Basics',
        description: 'Organic chemistry centres on carbon compounds. This topic covers functional groups, IUPAC nomenclature, isomerism, and general reaction mechanisms.',
        tags: ['Functional Groups', 'IUPAC Naming', 'Isomerism', 'Inductive Effect', 'Resonance'],
        formulas: [
            { equation: 'CₙH₂ₙ₊₂ (alkane)', name: 'Alkane Formula', desc: 'General formula for saturated hydrocarbons.' },
            { equation: 'CₙH₂ₙ (alkene)', name: 'Alkene Formula', desc: 'General formula for hydrocarbons with one double bond.' },
            { equation: 'CₙH₂ₙ₋₂ (alkyne)', name: 'Alkyne Formula', desc: 'General formula for hydrocarbons with one triple bond.' },
            { equation: 'Degree of unsaturation = (2C+2+N−H−X)/2', name: 'DBE Formula', desc: 'Degrees of unsaturation (double bond equivalents) for C_mH_nN_oX_p.' },
            { equation: 'SN2: inversion of config', name: 'Walden Inversion', desc: 'SN2 reactions proceed with inversion at the carbon centre.' },
        ]
    },

    hydrocarbons: {
        title: 'Hydrocarbons',
        description: 'Hydrocarbons are organic compounds of carbon and hydrogen only. This topic covers alkanes, alkenes, alkynes, and aromatic compounds with their characteristic reactions.',
        tags: ['Alkanes', 'Alkenes', 'Alkynes', 'Benzene', 'Aromaticity'],
        formulas: [
            { equation: 'Hückel: (4n+2)π electrons', name: 'Aromaticity Rule', desc: 'A cyclic conjugated system with 4n+2 π electrons is aromatic.' },
            { equation: 'CH₄ + Cl₂ → CH₃Cl + HCl', name: 'Halogenation of Alkane', desc: 'Free radical substitution in the presence of UV light.' },
            { equation: 'CH₂=CH₂ + H₂ → CH₃CH₃', name: 'Hydrogenation of Alkene', desc: 'Addition of H₂ across a double bond (Ni catalyst).' },
            { equation: 'Benzene + Br₂/FeBr₃ → C₆H₅Br', name: 'Electrophilic Aromatic Substitution', desc: 'Substitution on benzene ring preserving aromaticity.' },
            { equation: 'RC≡CH + H₂O → RCOCH₃', name: 'Hydration of Alkyne', desc: 'Markovnikov addition of water to alkynes.' },
        ]
    },

    'acids-bases': {
        title: 'Acids & Bases',
        description: 'Acid-base chemistry covers Brønsted-Lowry, Lewis, and Arrhenius definitions, pH calculations, buffer solutions, and neutralisation reactions.',
        tags: ['pH', 'pOH', 'Buffer', 'Neutralisation', 'Ka & Kb'],
        formulas: [
            { equation: 'pH + pOH = 14 (at 25°C)', name: 'pH-pOH Relation', desc: 'Sum of pH and pOH equals 14 at standard temperature.' },
            { equation: 'pH = pKa + log([A⁻]/[HA])', name: 'Henderson-Hasselbalch', desc: 'pH of a buffer solution in terms of pKa and concentration ratio.' },
            { equation: '[H⁺] = √(Ka × C)', name: 'Weak Acid pH', desc: 'Hydrogen ion concentration for weak acid of molarity C.' },
            { equation: 'Ka × Kb = Kw', name: 'Conjugate Pair Relation', desc: 'Product of Ka for an acid and Kb for its conjugate base equals Kw.' },
            { equation: 'Neutralisation: acid + base → salt + H₂O', name: 'Neutralisation', desc: 'Fundamental acid-base reaction.' },
        ]
    },

    // ── MATHEMATICS ──────────────────────────────────────────────────────────

    algebra: {
        title: 'Algebra',
        description: 'Algebra covers equations, polynomials, inequalities, and progressions. It is the language of mathematics and forms the foundation for all higher topics.',
        tags: ['Quadratics', 'Polynomials', 'AP/GP', 'Binomial Theorem', 'Inequalities'],
        formulas: [
            { equation: 'x = (−b ± √(b²−4ac)) / 2a', name: 'Quadratic Formula', desc: 'Roots of ax² + bx + c = 0.' },
            { equation: 'S_n = n/2 [2a + (n−1)d]', name: 'Sum of AP', desc: 'Sum of first n terms of arithmetic progression.' },
            { equation: 'S_n = a(rⁿ−1)/(r−1)', name: 'Sum of GP', desc: 'Sum of first n terms of geometric progression.' },
            { equation: '(a+b)ⁿ = Σ C(n,r)aⁿ⁻ʳbʳ', name: 'Binomial Theorem', desc: 'Expansion of (a+b) raised to power n.' },
            { equation: 'AM ≥ GM ≥ HM', name: 'AM-GM-HM Inequality', desc: 'Arithmetic mean ≥ Geometric mean ≥ Harmonic mean for positive numbers.' },
        ],
    },

    trigonometry: {
        title: 'Trigonometry',
        description: 'Trigonometry studies relationships between angles and sides in triangles. It is fundamental for physics, engineering, and complex analysis.',
        tags: ['Ratios', 'Identities', 'Inverse Functions', 'Sine/Cosine Rules'],
        formulas: [
            { equation: 'sin²θ + cos²θ = 1', name: 'Pythagorean Identity', desc: 'Fundamental identity relating sine and cosine.' },
            { equation: 'sin(A±B) = sinAcosB ± cosAsinB', name: 'Sum/Difference Formula', desc: 'Expands sine of sum or difference of angles.' },
            { equation: 'sin(2θ) = 2sinθcosθ', name: 'Double Angle (Sine)', desc: 'Sine of double an angle.' },
            { equation: 'a/sinA = b/sinB = c/sinC', name: 'Sine Rule', desc: 'Relates sides of a triangle to sines of opposite angles.' },
            { equation: 'c² = a² + b² − 2ab·cosC', name: 'Cosine Rule', desc: 'Generalises the Pythagorean theorem to any triangle.' },
        ],
    },

    'calculus-diff': {
        title: 'Differential Calculus',
        description: 'Differential calculus deals with the concept of the derivative — the rate of change of a function. It enables optimisation, curve sketching, and finding gradients.',
        tags: ['Derivatives', 'Chain Rule', 'Product Rule', 'L\'Hôpital', 'Maxima/Minima'],
        formulas: [
            { equation: 'd/dx(xⁿ) = nxⁿ⁻¹', name: 'Power Rule', desc: 'Derivative of xⁿ.' },
            { equation: 'd/dx(uv) = u\'v + uv\'', name: 'Product Rule', desc: 'Derivative of a product of two functions.' },
            { equation: 'd/dx[f(g(x))] = f\'(g)·g\'', name: 'Chain Rule', desc: 'Derivative of composite function.' },
            { equation: 'd/dx(eˣ) = eˣ, d/dx(ln x) = 1/x', name: 'Exponential/Log Derivatives', desc: 'Standard derivatives of e^x and ln x.' },
            { equation: 'd/dx(sinx)=cosx, d/dx(cosx)=−sinx', name: 'Trig Derivatives', desc: 'Standard derivatives of sine and cosine.' },
        ],
    },

    'calculus-int': {
        title: 'Integral Calculus',
        description: 'Integral calculus deals with accumulation — finding areas under curves, solving differential equations, and computing volumes of revolution.',
        tags: ['Definite Integrals', 'Integration by Parts', 'Substitution', 'Area Under Curve', 'FTC'],
        formulas: [
            { equation: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', name: 'Power Rule (Integration)', desc: 'Integral of xⁿ for n ≠ −1.' },
            { equation: '∫u dv = uv − ∫v du', name: 'Integration by Parts', desc: 'Used for products of functions.' },
            { equation: '∫f(g(x))g\'(x)dx = F(g(x)) + C', name: 'Integration by Substitution', desc: 'Reverse of the chain rule.' },
            { equation: '∫ₐᵇ f(x)dx = F(b) − F(a)', name: 'Fundamental Theorem', desc: 'Definite integral as difference of antiderivative values.' },
            { equation: '∫sinx dx = −cosx + C', name: 'Trig Integral', desc: 'Standard integral of sine function.' },
        ]
    },

    'coordinate-geometry': {
        title: 'Coordinate Geometry',
        description: 'Coordinate geometry uses algebraic equations to describe geometric shapes. Lines, circles, parabolas, ellipses, and hyperbolas are central to this topic.',
        tags: ['Line Equations', 'Circle', 'Parabola', 'Ellipse', 'Distance Formula'],
        formulas: [
            { equation: 'd = √((x₂−x₁)²+(y₂−y₁)²)', name: 'Distance Formula', desc: 'Distance between two points in the plane.' },
            { equation: 'y = mx + c', name: 'Line Equation', desc: 'Slope-intercept form; m = slope, c = y-intercept.' },
            { equation: 'x² + y² = r²', name: 'Circle (Origin)', desc: 'Circle centred at origin with radius r.' },
            { equation: 'y² = 4ax', name: 'Standard Parabola', desc: 'Parabola with vertex at origin opening right; focus at (a,0).' },
            { equation: 'x²/a² + y²/b² = 1', name: 'Ellipse', desc: 'Standard form with semi-axes a and b.' },
        ]
    },

    vectors: {
        title: 'Vectors & 3D',
        description: 'Vectors describe quantities with both magnitude and direction. This topic covers dot and cross products, direction cosines, lines and planes in 3D space.',
        tags: ['Dot Product', 'Cross Product', 'Direction Cosines', '3D Lines', 'Planes'],
        formulas: [
            { equation: 'a·b = |a||b|cosθ', name: 'Dot Product', desc: 'Scalar product of two vectors; gives projection.' },
            { equation: '|a×b| = |a||b|sinθ', name: 'Cross Product Magnitude', desc: 'Magnitude of cross product equals area of parallelogram.' },
            { equation: 'cos²α + cos²β + cos²γ = 1', name: 'Direction Cosines', desc: 'Sum of squares of direction cosines equals 1.' },
            { equation: 'Line: r = a + λb', name: 'Vector Form of Line', desc: 'Point a plus parameter times direction vector b.' },
            { equation: 'Plane: r·n = d', name: 'Vector Form of Plane', desc: 'Position vector dotted with normal equals constant.' },
        ]
    },

    matrices: {
        title: 'Matrices & Determinants',
        description: 'Matrices are rectangular arrays of numbers used to represent linear transformations. Determinants, inverses, and eigenvalues are key concepts.',
        tags: ['Matrix Operations', 'Determinant', 'Inverse', 'Cramer\'s Rule', 'Rank'],
        formulas: [
            { equation: 'det(A) = ad − bc (2×2)', name: 'Determinant (2×2)', desc: 'Determinant of a 2×2 matrix [[a,b],[c,d]].' },
            { equation: 'A⁻¹ = adj(A)/det(A)', name: 'Matrix Inverse', desc: 'Inverse exists only when det(A) ≠ 0.' },
            { equation: '(AB)⁻¹ = B⁻¹A⁻¹', name: 'Inverse of Product', desc: 'Order reverses when taking inverse of a product.' },
            { equation: 'AX = B → X = A⁻¹B', name: "Cramer's Rule", desc: 'Solution of linear system using inverse matrix.' },
            { equation: 'det(AB) = det(A)·det(B)', name: 'Determinant Product Rule', desc: 'Determinant of product equals product of determinants.' },
        ]
    },

    probability: {
        title: 'Probability',
        description: 'Probability measures the likelihood of events. This topic covers conditional probability, Bayes\' theorem, random variables, and common distributions.',
        tags: ['Conditional Probability', 'Bayes\'s Theorem', 'Independent Events', 'Distributions'],
        formulas: [
            { equation: 'P(A) = n(A)/n(S)', name: 'Classical Probability', desc: 'Favourable outcomes divided by total outcomes.' },
            { equation: 'P(A|B) = P(A∩B)/P(B)', name: 'Conditional Probability', desc: 'Probability of A given B has occurred.' },
            { equation: 'P(A∩B) = P(A)·P(B) (if independent)', name: 'Independent Events', desc: 'Probability of both events when they are independent.' },
            { equation: 'P(A) = ΣP(A|Bᵢ)P(Bᵢ)', name: 'Total Probability', desc: 'Sum rule over a partition of the sample space.' },
            { equation: 'P(Bᵢ|A) = P(A|Bᵢ)P(Bᵢ) / P(A)', name: "Bayes' Theorem", desc: 'Updates probability in the light of new evidence.' },
        ]
    },

    statistics: {
        title: 'Statistics',
        description: 'Statistics involves collecting, analysing, and interpreting data. It covers measures of central tendency, dispersion, correlation, and regression.',
        tags: ['Mean', 'Variance', 'Standard Deviation', 'Correlation', 'Regression'],
        formulas: [
            { equation: 'x̄ = Σxᵢ/n', name: 'Arithmetic Mean', desc: 'Sum of all values divided by count.' },
            { equation: 'σ² = Σ(xᵢ−x̄)²/n', name: 'Variance', desc: 'Average of squared deviations from the mean.' },
            { equation: 'σ = √Variance', name: 'Standard Deviation', desc: 'Square root of variance; same units as data.' },
            { equation: 'r = Σ(x−x̄)(y−ȳ) / (nσ_xσ_y)', name: 'Pearson Correlation', desc: 'Measures linear relationship between two variables; r ∈ [−1,1].' },
            { equation: 'ŷ = a + bx', name: 'Regression Line', desc: 'Best-fit line for predicting y from x.' },
        ]
    },

    'differential-equations': {
        title: 'Differential Equations',
        description: 'Differential equations relate a function to its derivatives. They model physical systems like population growth, heat flow, and oscillations.',
        tags: ['ODEs', 'Separable', 'Linear ODE', 'Homogeneous', 'Laplace Transform'],
        formulas: [
            { equation: 'dy/dx = f(x)g(y) → ∫dy/g = ∫f dx', name: 'Separable ODE', desc: 'Variables can be separated and integrated independently.' },
            { equation: 'dy/dx + Py = Q → IF = e^∫P dx', name: 'Linear First-Order ODE', desc: 'Solved using the integrating factor method.' },
            { equation: 'y = Ce^(kx)', name: 'Exponential Growth/Decay', desc: 'Solution of dy/dx = ky; k>0 growth, k<0 decay.' },
            { equation: 'y = C₁e^(m₁x) + C₂e^(m₂x)', name: 'Second-Order (Distinct Roots)', desc: 'General solution when characteristic equation has two real roots.' },
            { equation: 'L{f\'} = sF(s) − f(0)', name: 'Laplace Derivative Rule', desc: 'Key property used to solve ODEs via Laplace transform.' },
        ]
    },

    'complex-numbers': {
        title: 'Complex Numbers',
        description: 'Complex numbers extend the real numbers with the imaginary unit i = √(−1). They are essential in electrical engineering, signal processing, and quantum mechanics.',
        tags: ['Argand Plane', 'Modulus', 'Argument', 'Polar Form', 'De Moivre\'s Theorem'],
        formulas: [
            { equation: 'z = a + bi', name: 'Standard Form', desc: 'Real part a and imaginary part b.' },
            { equation: '|z| = √(a²+b²)', name: 'Modulus', desc: 'Distance from origin in the Argand plane.' },
            { equation: 'z̄ = a − bi', name: 'Conjugate', desc: 'Reflect across the real axis.' },
            { equation: 'z = r(cosθ + i sinθ) = re^(iθ)', name: 'Polar / Euler Form', desc: 'Polar representation using modulus and argument.' },
            { equation: 'zⁿ = rⁿ(cos nθ + i sin nθ)', name: 'De Moivre\'s Theorem', desc: 'Raising a complex number to a power n.' },
        ]
    },

    'sequences-series': {
        title: 'Sequences & Series',
        description: 'Sequences are ordered lists of numbers following a pattern. Series are sums of sequences. This includes AP, GP, HP, and special series like ΣN, ΣN², etc.',
        tags: ['AP', 'GP', 'HP', 'Sigma Notation', 'Infinite Series'],
        formulas: [
            { equation: 'T_n = a + (n−1)d (AP)', name: 'nth Term of AP', desc: 'General term of arithmetic progression.' },
            { equation: 'T_n = arⁿ⁻¹ (GP)', name: 'nth Term of GP', desc: 'General term of geometric progression.' },
            { equation: 'S∞ = a/(1−r), |r| < 1', name: 'Infinite GP Sum', desc: 'Sum of infinite geometric series when |r| < 1.' },
            { equation: 'ΣN = n(n+1)/2', name: 'Sum of Natural Numbers', desc: 'Sum of first n natural numbers.' },
            { equation: 'ΣN² = n(n+1)(2n+1)/6', name: 'Sum of Squares', desc: 'Sum of squares of first n natural numbers.' },
        ]
    },
};

export interface ConceptsProps {
    onUseFormula: (equation: string) => void;
    language: Language;
    onTopicSelect?: (topicTitle: string) => void;
    role?: 'teacher' | 'student';
}

export const Concepts: React.FC<ConceptsProps> = ({ onUseFormula, language, onTopicSelect, role }) => {
    const isTeacher = role === 'teacher';
    const t = translations[language];
    const [activeSubject, setActiveSubject] = useState<keyof typeof subjectsData>('Physics');
    const [activeTopic, setActiveTopic] = useState<string>('kinematics');
    const [searchQuery, setSearchQuery] = useState('');
    const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [showSimulator, setShowSimulator] = useState(false);

    useEffect(() => {
        if (onTopicSelect) {
            const topic = baseSubjectsData[activeSubject].topics.find(t => t.id === activeTopic);
            if (topic) onTopicSelect(topic.title);
        }
    }, [activeTopic, activeSubject]);

    // Load custom videos from Firestore
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const docRef = doc(db, 'global_settings', 'concept_videos');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setVideoUrls(docSnap.data() as Record<string, string>);
                }
            } catch (e) {
                console.error('Failed to fetch global videos', e);
            }
        };
        fetchVideos();
    }, []);

    // Save videos to Firestore
    useEffect(() => {
        if (Object.keys(videoUrls).length > 0) {
            const saveVideos = async () => {
                try {
                    const docRef = doc(db, 'global_settings', 'concept_videos');
                    await setDoc(docRef, videoUrls, { merge: true });
                } catch (e) {
                    console.error('Failed to save global videos', e);
                }
            };
            saveVideos();
        }
    }, [videoUrls]);

    const getYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleAddVideo = () => {
        if (!newVideoUrl.trim()) return;
        setVideoUrls(prev => ({
            ...prev,
            [activeTopic]: newVideoUrl
        }));
        setNewVideoUrl('');
        setIsAddingVideo(false);
    };

    const handleRemoveVideo = () => {
        const updated = { ...videoUrls };
        delete updated[activeTopic];
        setVideoUrls(updated);
        localStorage.setItem('concept_videos', JSON.stringify(updated));
    };

    const currentSubject = subjectsData[activeSubject];
    const colorMap: Record<string, any> = {
        blue: { active: 'bg-blue-900/40 border-blue-500/30 text-white', icon: 'text-blue-400', topicActive: 'bg-blue-900/20 border-blue-500/20 text-white', topicIcon: 'text-blue-400' },
        emerald: { active: 'bg-emerald-900/40 border-emerald-500/30 text-white', icon: 'text-emerald-400', topicActive: 'bg-emerald-900/20 border-emerald-500/20 text-white', topicIcon: 'text-emerald-400' },
        purple: { active: 'bg-purple-900/40 border-purple-500/30 text-white', icon: 'text-purple-400', topicActive: 'bg-purple-900/20 border-purple-500/20 text-white', topicIcon: 'text-purple-400' },
        rose: { active: 'bg-rose-900/40 border-rose-500/30 text-white', icon: 'text-rose-400', topicActive: 'bg-rose-900/20 border-rose-500/20 text-white', topicIcon: 'text-rose-400' },
    };
    const colors = colorMap[currentSubject.color] as any;

    const content = topicContentMap[activeTopic] ?? {
        title: currentSubject.topics.find(t => t.id === activeTopic)?.title ?? 'Topic',
        description: 'Content coming soon.',
        tags: [],
        formulas: [],
    };

    return (
        <div className="flex h-full w-full gap-8 animate-in fade-in duration-500">

            {/* Sidebar */}
            <div className="w-72 flex flex-col space-y-4 shrink-0">

                {/* Subject Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    {(Object.entries(subjectsData) as [keyof typeof subjectsData, any][]).map(([name, data]) => {
                        const Icon = data.icon;
                        const isActive = name === activeSubject;
                        const c = colorMap[data.color] as any;
                        return (
                            <button
                                key={name}
                                onClick={() => {
                                    setActiveSubject(name);
                                    setActiveTopic(data.topics[0].id);
                                }}
                                className={`flex flex-col items-center justify-center space-y-1.5 p-3 rounded-xl text-xs transition-all duration-200 ${isActive
                                    ? c.active + ' shadow-md'
                                    : 'bg-brand-surface text-brand-muted hover:text-white shadow-sm'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? c.icon : 'text-brand-muted'}`} />
                                <span className="truncate w-full text-center font-medium">{name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                        type="text"
                        placeholder={t.concepts.search}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0b1121] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-accent placeholder-brand-muted/50 shadow-inner"
                    />
                </div>

                {/* Topics */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar max-h-[calc(100vh-280px)]">
                    {currentSubject.topics
                        .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(topic => {
                            const Icon = currentSubject.icon;
                            const isActive = topic.id === activeTopic;
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => setActiveTopic(topic.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${isActive
                                        ? colors.topicActive + ' shadow-md'
                                        : 'text-brand-muted hover:bg-brand-surface/50 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-4 h-4 ${isActive ? colors.topicIcon : 'text-brand-muted/50'}`} />
                                        <span className="text-sm font-medium">{topic.title}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'opacity-60' : 'opacity-20'}`} />
                                </button>
                            );
                        })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pl-2 custom-scrollbar max-h-[calc(100vh-140px)]">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-3">{content.title}</h2>
                    <p className="text-brand-muted leading-relaxed text-sm">{content.description}</p>
                </div>

                {/* Tags */}
                {content.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {content.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-[#1e293b] border border-brand-muted/15 text-brand-muted text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Interactive Simulation Section */}
                <div className="mt-8 bg-[#0b1121] border border-brand-muted/10 rounded-2xl p-6 overflow-hidden mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                        <Cpu className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white tracking-tight">{t.concepts.sim_title}</h3>
                    </div>

                    <STEMSimulator topicId={activeTopic} />
                </div>

                {/* Key Formulas */}
                {content.formulas.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center space-x-2 text-brand-muted text-xs font-bold uppercase tracking-widest mb-4">
                            <BookOpen className="w-4 h-4" />
                            <span>Key Formulas</span>
                        </div>
                        <div className="space-y-3">
                            {content.formulas.map((formula, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => onUseFormula(formula.equation)}
                                    className="w-full text-left bg-[#111827] border border-gray-800 rounded-xl overflow-hidden transition-all group hover:border-blue-500/40 hover:shadow-lg cursor-pointer"
                                    title="Use in Problem Solver"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="bg-[#1a2335] px-6 py-4 flex items-center justify-between border-b md:border-b-0 md:border-r border-gray-800 md:min-w-[260px] md:shrink-0">
                                            <code className="text-blue-300 font-mono text-sm tracking-wide break-all">{formula.equation}</code>
                                            <span className="ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5 text-blue-400 text-[10px] font-bold">
                                                <span>Try</span><ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                        <div className="px-6 py-4 flex flex-col justify-center">
                                            <h4 className="text-white font-semibold text-sm mb-1">{formula.name}</h4>
                                            <p className="text-brand-muted text-xs leading-relaxed">{formula.desc}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* === YouTube Video Section === */}
                <div className="mt-10 pt-8 border-t border-brand-muted/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Video className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.concepts.video_ref}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            {isTeacher && videoUrls[activeTopic] && (
                                <button
                                    onClick={handleRemoveVideo}
                                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    <span>{t.concepts.remove}</span>
                                </button>
                            )}
                            {isTeacher && !isAddingVideo && (
                                <button
                                    onClick={() => setIsAddingVideo(true)}
                                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{videoUrls[activeTopic] ? 'Change Video' : 'Add YouTube Video'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {isAddingVideo && (
                        <div className="bg-[#111827] border border-brand-muted/15 rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-brand-muted text-[10px] font-bold uppercase tracking-wider mb-2">Paste YouTube URL</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={newVideoUrl}
                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                    className="flex-1 bg-[#0b1121] border border-brand-muted/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder-brand-muted/30"
                                />
                                <button
                                    onClick={handleAddVideo}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    Embed
                                </button>
                                <button
                                    onClick={() => { setIsAddingVideo(false); setNewVideoUrl(''); }}
                                    className="p-2 text-brand-muted hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {videoUrls[activeTopic] ? (
                        getYouTubeID(videoUrls[activeTopic]) ? (
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-brand-muted/20 shadow-2xl bg-black">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYouTubeID(videoUrls[activeTopic])}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <p className="text-xs text-red-400">Invalid YouTube URL. Please try again.</p>
                        )
                    ) : !isAddingVideo && (
                        <p className="text-xs text-brand-muted/50 italic">No video added yet for this topic. Click "Add YouTube Video" to embed one.</p>
                    )}
                </div>

            </div>
        </div>
    );
};
