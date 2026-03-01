import React, { useState, useEffect, useRef } from 'react';
import { Settings2, Play, Pause, RotateCcw, ArrowRight, BookOpen, RefreshCw, BarChart2, Dna, Heart, Activity } from 'lucide-react';

interface SimulatorProps {
    topicId: string;
}

const SolvingMethod = ({ title, steps }: { title: string; steps: string[] }) => (
    <div className="bg-blue-500/5 rounded-xl p-4 mt-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}: Solving Method</h4>
        </div>
        <div className="space-y-2">
            {steps.map((step, i) => (
                <div key={i} className="flex items-start space-x-3 group">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-400">
                        {i + 1}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">{step}</p>
                </div>
            ))}
        </div>
    </div>
);

const AssetDisplay = ({ src, caption }: { src: string, caption: string }) => (
    <div className="space-y-4">
        <div className="relative group bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
            <img src={src} alt={caption} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <p className="text-blue-300 text-xs font-mono uppercase tracking-widest">{caption}</p>
            </div>
        </div>
    </div>
);

const KinematicsSimulator = () => {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const requestRef = useRef<number>();
    const g = 9.81;
    const v0x = velocity * Math.cos((angle * Math.PI) / 180);
    const v0y = velocity * Math.sin((angle * Math.PI) / 180);

    const animate = () => {
        if (isPlaying) {
            setTime(prev => {
                const newTime = prev + 0.1;
                const currentY = v0y * newTime - 0.5 * g * newTime * newTime;
                if (currentY < -1) { setIsPlaying(false); return prev; }
                return newTime;
            });
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isPlaying, velocity, angle]);

    const x = v0x * time;
    const y = v0y * time - 0.5 * g * time * time;
    const scale = 5;
    const svgX = x * scale;
    const svgY = 350 - y * scale;
    const points = [];
    for (let t = 0; t <= time; t += 0.1) {
        const px = v0x * t * scale;
        const py = 350 - (v0y * t - 0.5 * g * t * t) * scale;
        points.push(`${px},${py}`);
    }

    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                    <line x1="0" y1="350" x2="800" y2="350" stroke="#334155" strokeWidth="2" />
                    <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                    <circle cx={svgX} cy={svgY} r="6" fill="#60a5fa" />
                </svg>
                <div className="absolute bottom-4 left-4 flex space-x-2">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-500 rounded-full text-white">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
                    <button onClick={() => { setTime(0); setIsPlaying(false); }} className="p-2 bg-slate-700 rounded-full text-white"><RotateCcw size={18} /></button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Angle ({angle}°)</label><input type="range" min="0" max="90" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" /></div>
                <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Velocity ({velocity})</label><input type="range" min="10" max="100" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Kinematics" steps={["v₀x = v₀ cos θ, v₀y = v₀ sin θ", "x(t) = v₀x·t", "y(t) = v₀y·t - ½gt²", "Range R = v₀²sin(2θ)/g"]} />
        </div>
    );
};

const AtomicSimulator = () => {
    const [protons, setProtons] = useState(6);[0]; const [rotation, setRotation] = useState(0);
    useEffect(() => { const i = setInterval(() => setRotation(r => (r + 1) % 360), 30); return () => clearInterval(i); }, []);
    const shells = []; if (protons > 0) shells.push(Math.min(protons, 2)); if (protons > 2) shells.push(Math.min(protons - 2, 8)); if (protons > 10) shells.push(Math.min(protons - 10, 8));
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 400" className="w-full max-w-[350px]">
                    <circle cx="200" cy="200" r="15" fill="#ef4444" className="animate-pulse" />
                    <text x="200" y="205" textAnchor="middle" fill="white" className="text-[10px] font-bold">{protons}P</text>
                    {shells.map((count, shellIdx) => {
                        const radius = 50 + shellIdx * 40;
                        return (
                            <g key={shellIdx}>
                                <circle cx="200" cy="200" r={radius} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                                {[...Array(count)].map((_, eIdx) => {
                                    const rad = ((eIdx * (360 / count) + (rotation * (shellIdx + 1) * 0.5)) % 360 * Math.PI) / 180;
                                    return <circle key={eIdx} cx={200 + radius * Math.cos(rad)} cy={200 + radius * Math.sin(rad)} r="4" fill="#60a5fa" />;
                                })}
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Atomic Number ({protons})</label><input type="range" min="1" max="18" value={protons} onChange={e => setProtons(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Atomic Structure" steps={["Z = number of protons", "Electrons fill shells: 2, 8, 8...", "E_n = -13.6 Z²/n² eV", "Configuration determines properties"]} />
        </div>
    );
};

const DynamicsSimulator = () => {
    const [force, setForce] = useState(50); const [mass, setMass] = useState(10); const [pos, setPos] = useState(100); const [vel, setVel] = useState(0); const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        if (!isPlaying) return;
        const i = setInterval(() => {
            const acc = force / mass; setVel(v => v + acc * 0.05); setPos(p => {
                const next = p + vel * 0.05; if (next > 350 || next < 50) { setIsPlaying(false); setVel(0); return p; }
                return next;
            });
        }, 50); return () => clearInterval(i);
    }, [isPlaying, force, mass, vel]);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-end justify-center p-10 shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full max-w-[500px]">
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="2" />
                    <rect x={pos} y={140} width="40" height="40" fill="#3b82f6" rx="4" />
                    <path d={`M ${pos - 10} 160 L ${pos - 40 - force / 2} 160`} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead)" />
                </svg>
                <div className="absolute bottom-4 left-4 flex space-x-2"><button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-500 rounded-full text-white">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111827] p-3 rounded-lg shadow-sm"><label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Force ({force}N)</label><input type="range" min="10" max="100" value={force} onChange={e => setForce(Number(e.target.value))} className="w-full accent-blue-500" /></div>
                <div className="bg-[#111827] p-3 rounded-lg shadow-sm"><label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Mass ({mass}kg)</label><input type="range" min="1" max="50" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-blue-500" /></div>
            </div>
            <SolvingMethod title="Dynamics" steps={["a = F_net / m", "v(t) = v₀ + at", "s(t) = s₀ + v₀t + ½at²", "Force is the rate of change of momentum"]} />
        </div>
    );
};

const TrigSimulator = () => {
    const [angle, setAngle] = useState(45); const rad = (angle * Math.PI) / 180;
    const px = 150 + 100 * Math.cos(rad); const py = 150 - 100 * Math.sin(rad);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
                    <circle cx="150" cy="150" r="100" fill="none" stroke="#334155" strokeWidth="1" />
                    <line x1="30" y1="150" x2="270" y2="150" stroke="#1e293b" /><line x1="150" y1="30" x2="150" y2="270" stroke="#1e293b" />
                    <line x1={px} y1="150" x2={px} y2={py} stroke="#ef4444" strokeWidth="3" /><line x1="150" y1="150" x2={px} y2="150" stroke="#10b981" strokeWidth="3" />
                    <line x1="150" y1="150" x2={px} y2={py} stroke="#3b82f6" strokeWidth="2" /><circle cx={px} cy={py} r="4" fill="white" />
                </svg>
                <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-lg text-[10px] font-mono text-blue-300 shadow-lg">
                    <div>sin(θ) = {Math.sin(rad).toFixed(3)}</div><div>cos(θ) = {Math.cos(rad).toFixed(3)}</div>
                </div>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Trigonometry" steps={["P(x,y) = (cos θ, sin θ)", "tan θ = sin θ / cos θ", "Radius = 1 in unit circle", "sin²θ + cos²θ = 1"]} />
        </div>
    );
};

const FunctionPlotter = ({ type }: { type: 'diff' | 'int' | 'algebra' }) => {
    const [xVal, setXVal] = useState(0); const canvasRef = useRef<HTMLCanvasElement>(null);
    const f = (x: number) => Math.sin(x) + 0.5 * x; const df = (x: number) => Math.cos(x) + 0.5;
    useEffect(() => {
        const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
        ctx.clearRect(0, 0, c.width, c.height); const w = c.width, h = c.height, sX = 40, sY = 40, oX = w / 2, oY = h / 2;
        ctx.strokeStyle = '#1e293b'; ctx.beginPath(); for (let i = -10; i <= 10; i++) { ctx.moveTo(oX + i * sX, 0); ctx.lineTo(oX + i * sX, h); ctx.moveTo(0, oY + i * sY); ctx.lineTo(w, oY + i * sY); } ctx.stroke();
        ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 3; ctx.beginPath(); for (let sx = 0; sx < w; sx++) { const x = (sx - oX) / sX; const y = f(x); if (sx === 0) ctx.moveTo(sx, oY - y * sY); else ctx.lineTo(sx, oY - y * sY); } ctx.stroke();
        if (type === 'diff') {
            const y = f(xVal), m = df(xVal), sXval = oX + xVal * sX, sYval = oY - y * sY; ctx.strokeStyle = '#ef4444'; ctx.beginPath();
            const x1 = xVal - 2, x2 = xVal + 2; ctx.moveTo(oX + x1 * sX, oY - (y + m * (x1 - xVal)) * sY); ctx.lineTo(oX + x2 * sX, oY - (y + m * (x2 - xVal)) * sY); ctx.stroke();
        }
    }, [xVal, type]);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg"><canvas ref={canvasRef} width={600} height={300} className="w-full h-full" /></div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="-4" max="4" step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title={type === 'diff' ? "Derivatives" : "Integrals"} steps={["Calculate rate of change f'(x)", "Observe tangent slope", "Determine area under graph", "Limit approach as Δx -> 0"]} />
        </div>
    );
};

const CircuitSim = () => {
    const [v, setV] = useState(12); const [r, setR] = useState(10); const i_curr = v / r;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full max-w-[400px]">
                    <rect x="50" y="50" width="300" height="100" fill="none" stroke="#334155" strokeWidth="2" />
                    <g transform="translate(50, 100)"><line x1="0" y1="-20" x2="0" y2="20" stroke="#ef4444" strokeWidth="4" /><text x="-40" y="5" fill="#ef4444" fontSize="12" fontWeight="bold">{v}V</text></g>
                    <g transform="translate(200, 50)"><polyline points="-30,0 -20,10 -10,-10 0,10 10,-10 20,10 30,0" fill="none" stroke="#60a5fa" strokeWidth="2" /><text x="-15" y="-15" fill="#60a5fa" fontSize="12" fontWeight="bold">{r}Ω</text></g>
                    {[...Array(10)].map((_, i) => (<circle key={i} r="3" fill="#fbbf24"><animateMotion dur={`${2 / i_curr}s`} repeatCount="indefinite" path="M 50 100 L 50 50 L 350 50 L 350 150 L 50 150 Z" begin={`${i * 0.2}s`} /></circle>))}
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4"><input type="range" min="1" max="24" value={v} onChange={e => setV(Number(e.target.value))} className="w-full" /><input type="range" min="1" max="50" value={r} onChange={e => setR(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Ohm's Law" steps={["V = IR", "Current is directly proportional to Voltage", "Current is inversely proportional to Resistance", "Power P = VI"]} />
        </div>
    );
};

const PHSim = () => {
    const [pH, setPH] = useState(7);
    const getColor = (v: number) => { if (v < 3) return '#ef4444'; if (v < 6) return '#fb923c'; if (v < 8) return '#10b981'; if (v < 11) return '#3b82f6'; return '#8b5cf6'; };
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center p-10 shadow-lg">
                <div className="w-32 h-44 border-4 border-slate-700/50 rounded-b-3xl relative overflow-hidden bg-white/5">
                    <div className="absolute bottom-0 w-full transition-all duration-1000" style={{ height: `${(pH / 14) * 100}%`, backgroundColor: getColor(pH), opacity: 0.7 }} />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white mix-blend-overlay">{pH.toFixed(1)}</div>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: getColor(pH) }}>{pH < 7 ? 'Acidic' : pH > 7 ? 'Basic' : 'Neutral'}</div>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="0" max="14" step="0.1" value={pH} onChange={e => setPH(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Acids & Bases" steps={["pH = -log[H⁺]", "Neutral pH is 7.0 at 25°C", "Acids release H⁺ ions", "Bases release OH⁻ ions"]} />
        </div>
    );
};

const ProbabilitySim = () => {
    const [res, setRes] = useState(1); const [rolling, setRolling] = useState(false);
    const roll = () => { setRolling(true); setTimeout(() => { setRes(Math.floor(Math.random() * 6) + 1); setRolling(false); }, 500); };
    return (
        <div className="space-y-6 text-center">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <div className={`w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-3xl font-bold text-white transition-all ${rolling ? 'animate-bounce blur-sm' : ''}`}>{res}</div>
                <button onClick={roll} disabled={rolling} className="absolute bottom-6 bg-blue-500 px-4 py-2 rounded-full text-xs font-bold text-white hover:bg-blue-600">Roll Dice</button>
            </div>
            <SolvingMethod title="Probability" steps={["P(A) = n(A) / n(S)", "Die roll probability is 1/6", "Event space tracking", "Statistical averages"]} />
        </div>
    );
};

const OrbitSim = () => {
    const [dist, setDist] = useState(100); const [rot, setRot] = useState(0);
    useEffect(() => { const i = setInterval(() => setRot(r => (r + 2) % 360), 30); return () => clearInterval(i); }, []);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 400" className="w-full max-w-[300px]">
                    <circle cx="200" cy="200" r="20" fill="#fbbf24" /><circle cx="200" cy="200" r={dist} fill="none" stroke="#334155" strokeDasharray="4" />
                    <circle cx={200 + dist * Math.cos(rot * Math.PI / 180)} cy={200 + dist * Math.sin(rot * Math.PI / 180)} r="8" fill="#60a5fa" />
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="50" max="150" value={dist} onChange={e => setDist(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Gravitation" steps={["F = GMm / r²", "Centripetal force F = mv²/r", "Kepler's Laws of motion", "Orbital velocity v = √(GM/r)"]} />
        </div>
    );
};

const VectorSim = () => {
    const [x, setX] = useState(80), [y, setY] = useState(-60);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#1e293b" /><line x1="0" y1="150" x2="300" y2="150" stroke="#1e293b" />
                    <line x1="150" y1="150" x2={150 + x} y2={150 + y} stroke="#3b82f6" strokeWidth="3" /><circle cx={150 + x} cy={150 + y} r="4" fill="white" />
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4"><input type="range" min="-100" max="100" value={x} onChange={e => setX(Number(e.target.value))} className="w-full" /><input type="range" min="-100" max="100" value={y} onChange={e => setY(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Vectors" steps={["Resolution into i, j components", "|V| = √(x² + y²)", "θ = tan⁻¹(y/x)", "Vector addition methods"]} />
        </div>
    );
};

const GasSim = () => {
    const [t, setT] = useState(300); const vol = t / 300;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <div className="p-2 flex flex-wrap shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-lg bg-black/20" style={{ width: `${vol * 200}px`, height: `${vol * 200}px` }}>
                    {[...Array(15)].map((_, i) => (<div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse m-1" />))}
                </div>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="100" max="600" value={t} onChange={e => setT(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Gas Laws" steps={["PV = nRT", "Charles's Law: V ∝ T", "Boyle's Law: P ∝ 1/V", "Kinetic Theory of Gases"]} />
        </div>
    );
};

const WaveSim = () => {
    const [f, setF] = useState(2); const [t, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT(prev => prev + 0.1), 30); return () => clearInterval(i); }, []);
    const pts = []; for (let x = 0; x <= 400; x += 5) pts.push(`${x},${100 + 30 * Math.sin(f * (x / 40) - t)}`);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full"><polyline points={pts.join(' ')} fill="none" stroke="#60a5fa" strokeWidth="3" /></svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="1" max="10" step="0.1" value={f} onChange={e => setF(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Waves" steps={["v = fλ", "Wave equation y(x,t) = A sin(kx-ωt)", "Superposition principle", "Transverse vs Longitudinal"]} />
        </div>
    );
};

const BondingSim = () => {
    const [d, setD] = useState(100);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <div className="flex items-center justify-between" style={{ width: `${d * 2}px` }}><div className="w-10 h-10 bg-blue-500 rounded-full" /><div className="w-10 h-10 bg-emerald-500 rounded-full" /></div>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="50" max="200" value={d} onChange={e => setD(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Bonding" steps={["Lennard-Jones Potential", "Equilibrium bond length", "Ionic vs Covalent attraction", "Electronegativity difference"]} />
        </div>
    );
};

// ── ADDITIONAL SIMULATIONS ───────────────────────────────────────────────────

const WorkEnergySim = () => {
    const [h, setH] = useState(5); const g = 9.81;
    const pe = 10 * g * h; const ke = 10 * g * (10 - Math.min(h, 10));
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">h = {h.toFixed(1)} m</text>
                    <rect x="190" y={200 - h * 16} width="20" height={h * 16} fill="#3b82f6" rx="3" />
                    <text x="10" y="50" fill="#fbbf24" fontSize="11">PE = {pe.toFixed(0)} J</text>
                    <text x="10" y="70" fill="#34d399" fontSize="11">KE = {ke.toFixed(0)} J</text>
                    <text x="10" y="90" fill="#a78bfa" fontSize="11">Total = {(pe + ke).toFixed(0)} J</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="1" max="10" value={h} onChange={e => setH(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Work-Energy" steps={["KE = ½mv²", "PE = mgh", "W_net = ΔKE", "Conservation: KE + PE = Total E"]} />
        </div>
    );
};

const RotationalSim = () => {
    const [w, setW] = useState(2); const [t, setT] = useState(0);
    useEffect(() => { const i = setInterval(() => setT(prev => prev + 0.05), 50); return () => clearInterval(i); }, []);
    const angle = w * t;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                    <circle cx="150" cy="100" r="60" fill="none" stroke="#334155" strokeWidth="2" />
                    <circle cx="150" cy="100" r="5" fill="#60a5fa" />
                    <line x1="150" y1="100" x2={150 + 60 * Math.cos(angle)} y2={100 + 60 * Math.sin(angle)} stroke="#60a5fa" strokeWidth="2" />
                    <circle cx={150 + 60 * Math.cos(angle)} cy={100 + 60 * Math.sin(angle)} r="8" fill="#f59e0b" />
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">ω = {w} rad/s</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="0.5" max="6" step="0.1" value={w} onChange={e => setW(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Rotational" steps={["τ = Iα", "L = Iω", "KE_rot = ½Iω²", "θ = ωt (uniform)"]} />
        </div>
    );
};

const ElectrostaticsSim = () => {
    const [q1, setQ1] = useState(2); const [q2, setQ2] = useState(3); const [r, setR] = useState(5);
    const F = 8.99e9 * q1 * q2 / (r * r);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <circle cx="100" cy="100" r={20 + q1 * 5} fill={q1 >= 0 ? "#ef444450" : "#3b82f650"} stroke={q1 >= 0 ? "#ef4444" : "#3b82f6"} strokeWidth="2" />
                    <text x="95" y="105" fill="white" fontSize="12">{q1 > 0 ? '+' : ''}{q1}</text>
                    <circle cx="280" cy="100" r={20 + q2 * 5} fill={q2 >= 0 ? "#ef444450" : "#3b82f650"} stroke={q2 >= 0 ? "#ef4444" : "#3b82f6"} strokeWidth="2" />
                    <text x="275" y="105" fill="white" fontSize="12">{q2 > 0 ? '+' : ''}{q2}</text>
                    <text x="100" y="30" fill="#94a3b8" fontSize="12">F = {F.toExponential(2)} N at r={r}m</text>
                </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-[#111827] p-4 rounded-xl shadow-sm">
                <div><p className="text-xs text-slate-400 mb-1">q1 (μC)</p><input type="range" min="1" max="10" value={q1} onChange={e => setQ1(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">q2 (μC)</p><input type="range" min="1" max="10" value={q2} onChange={e => setQ2(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">r (m)</p><input type="range" min="1" max="20" value={r} onChange={e => setR(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Electrostatics" steps={["F = kq₁q₂/r²", "E = F/q = kQ/r²", "V = kQ/r", "Gauss's Law: ∮E·dA = Q/ε₀"]} />
        </div>
    );
};

const MagnetismSim = () => {
    const [t, setT] = useState(0);
    useEffect(() => { const i = setInterval(() => setT(prev => prev + 0.04), 40); return () => clearInterval(i); }, []);
    const particles = [0, 1, 2, 3, 4].map(i => ({ x: 50 + (t * 60 + i * 80) % 400, y: 100 + 30 * Math.sin(t + i) }));
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="25" fill="#94a3b8" fontSize="11">Charged particles in magnetic field B (into page)</text>
                    {[...Array(5)].map((_, i) => <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="200" stroke="#1e293b" strokeWidth="1" />)}
                    {particles.map((p, i) => (
                        <g key={i}>
                            <circle cx={p.x} cy={p.y} r="6" fill="#60a5fa" />
                            <line x1={p.x} y1={p.y} x2={p.x + 12} y2={p.y - 5} stroke="#f59e0b" strokeWidth="2" />
                        </g>
                    ))}
                    <text x="10" y="185" fill="#60a5fa" fontSize="11">F = qv × B (Lorentz force)</text>
                </svg>
            </div>
            <SolvingMethod title="Magnetism" steps={["F = qv × B", "B = μ₀I/2πr (wire)", "Φ = B·A·cos θ", "Faraday: EMF = -dΦ/dt"]} />
        </div>
    );
};

const ThermodynamicsSim = () => {
    const [t, setT] = useState(300); const p = 1e5 * t / 300;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <rect x="100" y="50" width="200" height="120" rx="8" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                    {[...Array(Math.floor(t / 50))].map((_, i) => (
                        <circle key={i} cx={120 + (i % 6) * 30} cy={70 + Math.floor(i / 6) * 30} r="4"
                            fill="#f59e0b" className="animate-pulse" />
                    ))}
                    <text x="10" y="25" fill="#94a3b8" fontSize="12">T = {t}K | P = {(p / 1000).toFixed(0)} kPa</text>
                    <text x="10" y="185" fill="#f59e0b" fontSize="11">Higher T → faster molecules → higher P</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm"><input type="range" min="100" max="600" value={t} onChange={e => setT(Number(e.target.value))} className="w-full" /></div>
            <SolvingMethod title="Thermodynamics" steps={["1st Law: ΔU = Q - W", "2nd Law: ΔS ≥ 0", "PV = nRT (ideal gas)", "Carnot efficiency = 1 - T_cold/T_hot"]} />
        </div>
    );
};

const StoichiometrySim = () => {
    const [m, setM] = useState(44);
    const molarMassCO2 = 44; const moles = m / molarMassCO2;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">Stoichiometry: CO₂ mass → moles</text>
                    <text x="10" y="60" fill="#60a5fa" fontSize="16">m = {m}g</text>
                    <text x="10" y="90" fill="#94a3b8" fontSize="12">M(CO₂) = 44 g/mol</text>
                    <text x="10" y="120" fill="#34d399" fontSize="16">n = {moles.toFixed(2)} mol</text>
                    <text x="10" y="150" fill="#f59e0b" fontSize="12">N = {(moles * 6.022e23).toExponential(2)} molecules</text>
                    <rect x="240" y="40" width={moles * 60} height="30" rx="4" fill="#3b82f650" stroke="#3b82f6" />
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 mb-1">Mass of CO₂ (g)</p>
                <input type="range" min="22" max="220" step="22" value={m} onChange={e => setM(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Stoichiometry" steps={["n = m / M", "N = n × Nₐ", "n = PV/RT (for gases)", "Molar ratios from balanced equations"]} />
        </div>
    );
};

const ThermochemistrySim = () => {
    const [dH, setDH] = useState(-100); const [dS, setDS] = useState(50); const T = 298;
    const dG = dH - T * (dS / 1000);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">Gibbs Free Energy: ΔG = ΔH - TΔS</text>
                    <text x="10" y="60" fill="#60a5fa" fontSize="13">ΔH = {dH} kJ/mol</text>
                    <text x="10" y="85" fill="#a78bfa" fontSize="13">TΔS = {(T * dS / 1000).toFixed(1)} kJ/mol</text>
                    <text x="10" y="115" fill={dG < 0 ? "#34d399" : "#ef4444"} fontSize="16" fontWeight="bold">
                        ΔG = {dG.toFixed(1)} kJ/mol
                    </text>
                    <text x="10" y="145" fill={dG < 0 ? "#34d399" : "#ef4444"} fontSize="12">
                        {dG < 0 ? "✓ Spontaneous reaction" : "✗ Non-spontaneous reaction"}
                    </text>
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl shadow-sm">
                <div><p className="text-xs text-slate-400 mb-1">ΔH (kJ/mol)</p><input type="range" min="-200" max="200" value={dH} onChange={e => setDH(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">ΔS (J/mol·K)</p><input type="range" min="-200" max="300" value={dS} onChange={e => setDS(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Thermochemistry" steps={["ΔG = ΔH - TΔS", "ΔG < 0 → spontaneous", "Hess's Law for ΔH°", "q = mcΔT"]} />
        </div>
    );
};

const EquilibriumSim = () => {
    const [qc, setQc] = useState(1.5); const Kc = 4;
    const dir = qc < Kc ? "→ Forward" : qc > Kc ? "← Reverse" : "⇌ At Equilibrium";
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">Kc = {Kc} | Qc = {qc.toFixed(1)}</text>
                    <rect x="50" y="100" width={qc * 50} height="20" rx="3" fill="#60a5fa80" stroke="#60a5fa" />
                    <rect x="50" y="130" width={Kc * 50} height="20" rx="3" fill="#34d39980" stroke="#34d399" />
                    <text x="60" y="115" fill="#60a5fa" fontSize="11">Qc</text>
                    <text x="60" y="150" fill="#34d399" fontSize="11">Kc</text>
                    <text x="10" y="190" fill={qc < Kc ? "#34d399" : qc > Kc ? "#ef4444" : "#f59e0b"} fontSize="14">{dir}</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 mb-1">Qc value</p>
                <input type="range" min="0.5" max="10" step="0.1" value={qc} onChange={e => setQc(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Equilibrium" steps={["Kc = [P]^n/[R]^m at equilibrium", "Q < K → reaction goes forward", "Q > K → reaction goes reverse", "Le Chatelier: add stress, shift equilibrium"]} />
        </div>
    );
};

const ElectrochemistrySim = () => {
    const [e0, setE0] = useState(1.1); const n = 2; const F = 96485;
    const dG = -n * F * e0;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <rect x="50" y="60" width="80" height="100" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="65" y="115" fill="#60a5fa" fontSize="12">Anode (−)</text>
                    <rect x="270" y="60" width="80" height="100" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="283" y="115" fill="#f59e0b" fontSize="12">Cathode (+)</text>
                    <line x1="130" y1="110" x2="270" y2="110" stroke="#94a3b8" strokeWidth="2" />
                    <text x="165" y="100" fill="#94a3b8" fontSize="11">Ion flow</text>
                    <text x="10" y="25" fill="#34d399" fontSize="12">E°_cell = {e0.toFixed(2)} V</text>
                    <text x="10" y="45" fill="#a78bfa" fontSize="11">ΔG° = {(dG / 1000).toFixed(1)} kJ/mol</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 mb-1">E°_cell (V)</p>
                <input type="range" min="-2" max="3" step="0.1" value={e0} onChange={e => setE0(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Electrochemistry" steps={["E° = E°_cathode - E°_anode", "ΔG° = -nFE°", "Nernst Eq: E = E° - (RT/nF)lnQ", "Faraday: m = (M/nF)It"]} />
        </div>
    );
};

const KineticsSim = () => {
    const [k, setK] = useState(0.2); const [c0] = useState(1.0);
    const times = [0, 1, 2, 4, 6, 8]; const pts = times.map(t => ({ t, c: c0 * Math.exp(-k * t) }));
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="24" fill="#94a3b8" fontSize="12">First Order Decay: [A] = [A]₀e^(-kt)</text>
                    <line x1="40" y1="10" x2="40" y2="180" stroke="#475569" strokeWidth="1" />
                    <line x1="40" y1="180" x2="390" y2="180" stroke="#475569" strokeWidth="1" />
                    <polyline points={pts.map(p => `${40 + p.t * 40},${180 - p.c * 140}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" />
                    {pts.map((p, i) => <circle key={i} cx={40 + p.t * 40} cy={180 - p.c * 140} r="4" fill="#f59e0b" />)}
                    <text x="10" y="190" fill="#f59e0b" fontSize="11">t½ = {(0.693 / k).toFixed(1)} s</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 mb-1">k (s⁻¹)</p>
                <input type="range" min="0.05" max="1" step="0.05" value={k} onChange={e => setK(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Kinetics" steps={["Rate = k[A]^n", "t½ = 0.693/k (first order)", "k = Ae^(-Ea/RT) (Arrhenius)", "Integrated rate laws"]} />
        </div>
    );
};

const CoordGeomSim = () => {
    const [m, setM] = useState(1); const [c, setC] = useState(0);
    const pts: string[] = []; for (let x = -5; x <= 5; x++) { pts.push(`${200 + x * 30},${100 - (m * x + c) * 20}`); }
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <line x1="20" y1="100" x2="380" y2="100" stroke="#334155" strokeWidth="1" />
                    <line x1="200" y1="10" x2="200" y2="190" stroke="#334155" strokeWidth="1" />
                    <polyline points={pts.join(' ')} fill="none" stroke="#60a5fa" strokeWidth="2" />
                    <text x="10" y="25" fill="#94a3b8" fontSize="12">y = {m}x + {c}  (slope = {m})</text>
                    <circle cx="200" cy={100 - c * 20} r="5" fill="#f59e0b" />
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl shadow-sm">
                <div><p className="text-xs text-slate-400 mb-1">Slope (m)</p><input type="range" min="-4" max="4" step="0.5" value={m} onChange={e => setM(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">Intercept (c)</p><input type="range" min="-3" max="3" step="0.5" value={c} onChange={e => setC(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Coordinate Geometry" steps={["y = mx + c (line)", "Distance = √((x₂-x₁)² + (y₂-y₁)²)", "Circle: (x-a)² + (y-b)² = r²", "Parabola: y² = 4ax"]} />
        </div>
    );
};

const MatricesSim = () => {
    const [a11, setA11] = useState(1); const [a12, setA12] = useState(2); const [a21, setA21] = useState(3); const [a22, setA22] = useState(4);
    const det = a11 * a22 - a12 * a21;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="30" fill="#94a3b8" fontSize="12">2×2 Matrix Properties</text>
                    <rect x="80" y="50" width="120" height="80" rx="4" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <text x="100" y="90" fill="#60a5fa" fontSize="20">{a11}</text>
                    <text x="150" y="90" fill="#60a5fa" fontSize="20">{a12}</text>
                    <text x="100" y="120" fill="#60a5fa" fontSize="20">{a21}</text>
                    <text x="150" y="120" fill="#60a5fa" fontSize="20">{a22}</text>
                    <text x="230" y="80" fill="#94a3b8" fontSize="12">det(A) = ad - bc</text>
                    <text x="230" y="100" fill={det !== 0 ? "#34d399" : "#ef4444"} fontSize="16">= {det}</text>
                    <text x="230" y="120" fill={det !== 0 ? "#34d399" : "#ef4444"} fontSize="11">{det !== 0 ? "Invertible ✓" : "Singular ✗"}</text>
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-[#111827] p-4 rounded-xl shadow-sm">
                {[['a', a11, setA11], ['b', a12, setA12], ['c', a21, setA21], ['d', a22, setA22]].map(([label, val, setter]: any, i) => (
                    <div key={i}><p className="text-xs text-slate-400 mb-1">{label}</p><input type="range" min="-5" max="5" value={val} onChange={e => setter(Number(e.target.value))} className="w-full" /></div>
                ))}
            </div>
            <SolvingMethod title="Matrices" steps={["det(A) = ad - bc", "A⁻¹ = adj(A)/det(A)", "Rank = max independent rows/cols", "Eigenvalues: det(A - λI) = 0"]} />
        </div>
    );
};

const DiffEqSim = () => {
    const [k, setK] = useState(-0.3);
    const pts: string[] = []; for (let t = 0; t <= 10; t += 0.5) pts.push(`${30 + t * 33},${180 - Math.exp(k * t) * 130}`);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="24" fill="#94a3b8" fontSize="12">Solution of dy/dt = ky: y = {k >= 0 ? 'eᵏᵗ' : 'e⁻ᵏᵗ'}</text>
                    <line x1="30" y1="10" x2="30" y2="185" stroke="#475569" strokeWidth="1" />
                    <line x1="30" y1="180" x2="390" y2="180" stroke="#475569" strokeWidth="1" />
                    <polyline points={pts.join(' ')} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
                    <text x="10" y="190" fill="#94a3b8" fontSize="11">k = {k.toFixed(1)}</text>
                </svg>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl shadow-sm">
                <p className="text-xs text-slate-400 mb-1">k (growth/decay rate)</p>
                <input type="range" min="-1" max="1" step="0.1" value={k} onChange={e => setK(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Diff. Equations" steps={["dy/dx = ky → y = Ce^(kx)", "Separation of variables: f(y)dy = g(x)dx", "Integrating factor for linear ODE", "Characteristic equation for 2nd order"]} />
        </div>
    );
};

const ComplexNumbersSim = () => {
    const [r, setR] = useState(3); const [theta, setTheta] = useState(45);
    const rad = theta * Math.PI / 180;
    const re = (r * Math.cos(rad)).toFixed(2); const im = (r * Math.sin(rad)).toFixed(2);
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                    <line x1="150" y1="10" x2="150" y2="190" stroke="#334155" strokeWidth="1" />
                    <line x1="10" y1="100" x2="290" y2="100" stroke="#334155" strokeWidth="1" />
                    <line x1="150" y1="100" x2={150 + r * 25 * Math.cos(rad)} y2={100 - r * 25 * Math.sin(rad)} stroke="#60a5fa" strokeWidth="2" />
                    <circle cx={150 + r * 25 * Math.cos(rad)} cy={100 - r * 25 * Math.sin(rad)} r="6" fill="#f59e0b" />
                    <text x="155" y="30" fill="#94a3b8" fontSize="10">Im</text>
                    <text x="270" y="105" fill="#94a3b8" fontSize="10">Re</text>
                    <text x="10" y="25" fill="#60a5fa" fontSize="11">z = {re} + {im}i</text>
                    <text x="10" y="40" fill="#f59e0b" fontSize="11">|z| = {r} | θ = {theta}°</text>
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl shadow-sm">
                <div><p className="text-xs text-slate-400 mb-1">r (modulus)</p><input type="range" min="1" max="5" value={r} onChange={e => setR(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">θ (argument °)</p><input type="range" min="0" max="360" value={theta} onChange={e => setTheta(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Complex Numbers" steps={["z = a + bi = r(cosθ + i sinθ)", "|z| = √(a²+b²)", "arg(z) = tan⁻¹(b/a)", "De Moivre: zⁿ = rⁿ(cos nθ + i sin nθ)"]} />
        </div>
    );
};

const SequencesSim = () => {
    const [a, setA] = useState(2); const [r, setR] = useState(2); const n = 8;
    const ap = Array.from({ length: n }, (_, i) => a + i * r);
    const gp = Array.from({ length: n }, (_, i) => a * Math.pow(1.5, i));
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video shadow-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <text x="10" y="24" fill="#94a3b8" fontSize="12">AP vs GP comparison</text>
                    {ap.map((v, i) => <rect key={i} x={20 + i * 44} y={180 - Math.min(v, 60) * 2} width="16" height={Math.min(v, 60) * 2} rx="2" fill="#60a5fa80" stroke="#60a5fa" />)}
                    {gp.map((v, i) => <rect key={i} x={36 + i * 44} y={180 - Math.min(v, 120) * 1.2} width="16" height={Math.min(v, 120) * 1.2} rx="2" fill="#f59e0b50" stroke="#f59e0b" />)}
                    <rect x="10" y="175" width="10" height="10" fill="#60a5fa" />
                    <text x="25" y="185" fill="#60a5fa" fontSize="11">AP (d={r})</text>
                    <rect x="80" y="175" width="10" height="10" fill="#f59e0b" />
                    <text x="95" y="185" fill="#f59e0b" fontSize="11">GP (r=1.5)</text>
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl shadow-sm">
                <div><p className="text-xs text-slate-400 mb-1">a (first term)</p><input type="range" min="1" max="10" value={a} onChange={e => setA(Number(e.target.value))} className="w-full" /></div>
                <div><p className="text-xs text-slate-400 mb-1">d (AP common diff)</p><input type="range" min="1" max="8" value={r} onChange={e => setR(Number(e.target.value))} className="w-full" /></div>
            </div>
            <SolvingMethod title="Sequences & Series" steps={["AP: aₙ = a + (n-1)d", "GP: aₙ = arⁿ⁻¹", "S∞ (GP) = a/(1-r) if |r| < 1", "Σn = n(n+1)/2"]} />
        </div>
    );
};

const CellSimulator = () => {
    const [cellType, setCellType] = useState<'Animal' | 'Plant'>('Animal');
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center p-4 shadow-lg">
                <svg viewBox="0 0 400 300" className="w-full max-w-[400px]">
                    {/* Cell Wall / Membrane */}
                    {cellType === 'Plant' ? (
                        <rect x="50" y="30" width="300" height="240" rx="20" fill="none" stroke="#059669" strokeWidth="8" />
                    ) : (
                        <ellipse cx="200" cy="150" rx="140" ry="110" fill="none" stroke="#3b82f6" strokeWidth="4" />
                    )}
                    {/* Cytoplasm */}
                    {cellType === 'Plant' ? (
                        <rect x="58" y="38" width="284" height="224" rx="16" fill="#10b98110" />
                    ) : (
                        <ellipse cx="200" cy="150" rx="136" ry="106" fill="#3b82f608" />
                    )}
                    {/* Nucleus */}
                    <circle cx="200" cy="150" r="30" fill="#8b5cf630" stroke="#8b5cf6" strokeWidth="2" />
                    <circle cx="210" cy="140" r="8" fill="#8b5cf660" /> {/* Nucleolus */}

                    {/* Mitochondria */}
                    <g transform="translate(100, 100) rotate(45)">
                        <ellipse cx="0" cy="0" rx="15" ry="8" fill="#ef444440" stroke="#ef4444" strokeWidth="1" />
                        <path d="M -10,0 Q 0,10 10,0" fill="none" stroke="#ef4444" strokeWidth="1" />
                    </g>
                    <g transform="translate(280, 200) rotate(-30)">
                        <ellipse cx="0" cy="0" rx="15" ry="8" fill="#ef444440" stroke="#ef4444" strokeWidth="1" />
                        <path d="M -10,0 Q 0,10 10,0" fill="none" stroke="#ef4444" strokeWidth="1" />
                    </g>

                    {/* Vacuole - Specific to Plant */}
                    {cellType === 'Plant' && (
                        <path d="M 120,80 Q 200,60 280,80 Q 300,150 280,220 Q 200,240 120,220 Z" fill="#3b82f620" stroke="#3b82f680" strokeWidth="1" />
                    )}

                    {/* Chloroplasts - Specific to Plant */}
                    {cellType === 'Plant' && (
                        <>
                            <ellipse cx="80" cy="60" rx="12" ry="7" fill="#10b981" />
                            <ellipse cx="320" cy="60" rx="12" ry="7" fill="#10b981" />
                            <ellipse cx="80" cy="240" rx="12" ry="7" fill="#10b981" />
                        </>
                    )}

                    {/* Labels */}
                    <text x="185" y="195" fill="#8b5cf6" className="text-[10px] font-bold">Nucleus</text>
                    <text x="60" y="125" fill="#ef4444" className="text-[10px] font-bold">Mitochondria</text>
                </svg>
            </div>
            <div className="flex justify-center space-x-4">
                <button onClick={() => setCellType('Animal')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${cellType === 'Animal' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Animal Cell</button>
                <button onClick={() => setCellType('Plant')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${cellType === 'Plant' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Plant Cell</button>
            </div>
            <SolvingMethod title="Cell Biology" steps={["Identify organelles and their unique functions", "Note differences: Plant cells have walls and chloroplasts", "SA:V ratio limits cell size", "ATP production happens in mitochondria"]} />
        </div>
    );
};

const GeneticsSim = () => {
    const [p1, setP1] = useState('Aa');
    const [p2, setP2] = useState('Aa');
    const alleles1 = p1.split('');
    const alleles2 = p2.split('');
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-3 gap-2 p-6 bg-slate-800/50 rounded-2xl shadow-xl">
                    <div />
                    <div className="flex items-center justify-center font-bold text-blue-400">{alleles1[0]}</div>
                    <div className="flex items-center justify-center font-bold text-blue-400">{alleles1[1]}</div>
                    <div className="flex items-center justify-center font-bold text-rose-400">{alleles2[0]}</div>
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-lg text-white font-mono shadow-inner">{alleles2[0]}{alleles1[0]}</div>
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-lg text-white font-mono shadow-inner">{alleles2[0]}{alleles1[1]}</div>
                    <div className="flex items-center justify-center font-bold text-rose-400">{alleles2[1]}</div>
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-lg text-white font-mono shadow-inner">{alleles2[1]}{alleles1[0]}</div>
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-lg text-white font-mono shadow-inner">{alleles2[1]}{alleles1[1]}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <select value={p1} onChange={e => setP1(e.target.value)} className="bg-slate-900 p-2 rounded-lg text-white text-xs shadow-sm focus:ring-1 focus:ring-blue-500 outline-none">
                    <option value="AA">Parent 1: AA</option><option value="Aa">Parent 1: Aa</option><option value="aa">Parent 1: aa</option>
                </select>
                <select value={p2} onChange={e => setP2(e.target.value)} className="bg-slate-900 p-2 rounded-lg text-white text-xs shadow-sm focus:ring-1 focus:ring-blue-500 outline-none">
                    <option value="AA">Parent 2: AA</option><option value="Aa">Parent 2: Aa</option><option value="aa">Parent 2: aa</option>
                </select>
            </div>
            <SolvingMethod title="Genetics" steps={["Law of Segregation: Alleles separate during gamete formation", "Punnett squares predict genotypic ratios", "Dominant alleles mask recessive ones", "Hardy-Weinberg equilibrium: p² + 2pq + q² = 1"]} />
        </div>
    );
};

const PhysiologySim = () => {
    const [hr, setHr] = useState(70);
    const sv = 70; // constant stroke volume for simplicity
    const co = (hr * sv) / 1000;
    return (
        <div className="space-y-6">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center p-6 text-center shadow-lg">
                <div className="relative mb-4">
                    <Heart className={`w-20 h-20 text-rose-500 transition-transform duration-200`} style={{ transform: `scale(${1 + Math.sin(Date.now() / 100) * 0.1})` }} />
                    <Activity className="absolute inset-x-0 -bottom-4 w-full h-8 text-blue-400" />
                </div>
                <div className="grid grid-cols-2 gap-8 text-white mt-4">
                    <div><p className="text-[10px] text-slate-400 uppercase font-black">Heart Rate</p><p className="text-2xl font-bold text-rose-400">{hr} BPM</p></div>
                    <div><p className="text-[10px] text-slate-400 uppercase font-black">Cardiac Output</p><p className="text-2xl font-bold text-blue-400">{co.toFixed(1)} L/min</p></div>
                </div>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Adjust Activity Level (Pulse)</p>
                <input type="range" min="40" max="180" value={hr} onChange={e => setHr(Number(e.target.value))} className="w-full" />
            </div>
            <SolvingMethod title="Human Physiology" steps={["CO = HR × SV (Cardiac Output)", "Stroke volume is volume per heart beat", "Homeostasis maintain stable internal conditions", "Nervous and Endocrine systems control HR"]} />
        </div>
    );
};

const STEMSimulator: React.FC<SimulatorProps> = ({ topicId }) => {
    switch (topicId) {
        // Biology
        case 'cell-biology': return <CellSimulator />;
        case 'genetics': return <GeneticsSim />;
        case 'human-phys': return <PhysiologySim />;
        // Physics
        case 'kinematics': return <KinematicsSimulator />;
        case 'dynamics': return <DynamicsSimulator />;
        case 'trigonometry': return <TrigSimulator />;
        case 'atomic-structure': return <AtomicSimulator />;
        case 'calculus-diff': return <FunctionPlotter type="diff" />;
        case 'calculus-int': return <FunctionPlotter type="int" />;
        case 'algebra': return <FunctionPlotter type="algebra" />;
        case 'current-electricity': return <CircuitSim />;
        case 'states-of-matter': return <GasSim />;
        case 'waves':
        case 'waves-oscillations': return <WaveSim />;
        case 'optics': return <WaveSim />;
        case 'gravitation': return <OrbitSim />;
        case 'vectors': return <VectorSim />;
        case 'acids-bases': return <PHSim />;
        case 'probability':
        case 'statistics': return <ProbabilitySim />;
        case 'bonding': return <BondingSim />;
        // New simulations
        case 'work-energy': return <WorkEnergySim />;
        case 'rotational': return <RotationalSim />;
        case 'electrostatics': return <ElectrostaticsSim />;
        case 'magnetism': return <MagnetismSim />;
        case 'thermodynamics': return <ThermodynamicsSim />;
        case 'stoichiometry': return <StoichiometrySim />;
        case 'thermochemistry': return <ThermochemistrySim />;
        case 'equilibrium': return <EquilibriumSim />;
        case 'electrochemistry': return <ElectrochemistrySim />;
        case 'kinetics': return <KineticsSim />;
        case 'coordinate-geometry': return <CoordGeomSim />;
        case 'matrices': return <MatricesSim />;
        case 'differential-equations': return <DiffEqSim />;
        case 'complex-numbers': return <ComplexNumbersSim />;
        case 'sequences-series': return <SequencesSim />;
        // Asset Mappings
        case 'modern-physics': return <AssetDisplay src="/assets/simulations/modern_physics.png" caption="Quantum Mechanics Visual Analysis" />;
        case 'periodic-table': return <AssetDisplay src="/assets/simulations/periodic_table.png" caption="Periodic Table Visual Reference" />;
        case 'organic-basics':
        case 'hydrocarbons': return <AssetDisplay src="/assets/simulations/organic_molecules.png" caption="Molecular Structure Visualizer" />;
        default:
            return (
                <div className="flex flex-col items-center justify-center py-16 bg-[#111827]/50 rounded-xl border border-dashed border-white/10">
                    <Settings2 className="w-10 h-10 text-slate-500 mb-4 opacity-30" />
                    <h4 className="text-white font-semibold">Simulation Loading</h4>
                    <p className="text-slate-400 text-xs mt-1">Interactive content for this topic is being prepared.</p>
                </div>
            );
    }
};

export default STEMSimulator;
