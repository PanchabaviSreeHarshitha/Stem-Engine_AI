import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { SolveResult } from '../types';
import {
    Copy, Check, ArrowRight, Globe, Lightbulb,
    ChevronDown, ChevronUp, BookOpen, Sigma,
    CheckCircle2, Info, Zap, Wrench, FlaskConical, Target, HelpCircle
} from 'lucide-react';

interface StepByStepViewProps {
    result: SolveResult | null;
    loading: boolean;
}

export const StepByStepView: React.FC<StepByStepViewProps> = ({ result, loading }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!result) return;
        const text = [
            result.problem_type ? `Problem: ${result.problem_type}` : '',
            result.formula_used ? `Formula: ${result.formula_used}` : '',
            result.steps?.map((s, i) => `Step ${i + 1}: ${s.description}`).join('\n') ?? '',
            result.final_values?.length ? `Answer: ${result.final_values.join(', ')}` : '',
        ].filter(Boolean).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-64 bg-slate-900/40 rounded-2xl animate-pulse flex flex-col items-center justify-center space-y-4 shadow-sm">
                    <div className="h-4 bg-white/5 rounded-full w-32"></div>
                    <div className="h-8 bg-white/10 rounded-lg w-64"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-slate-900/40 rounded-xl animate-pulse shadow-sm"></div>
                    <div className="h-12 bg-slate-900/40 rounded-xl animate-pulse shadow-sm"></div>
                </div>
                <div className="h-96 bg-slate-900/40 rounded-2xl animate-pulse p-8 shadow-sm">
                    <div className="h-4 bg-white/5 rounded-full w-24 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-3 bg-white/5 rounded-full w-full"></div>
                        <div className="h-3 bg-white/5 rounded-full w-5/6"></div>
                        <div className="h-3 bg-white/5 rounded-full w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) return null;

    if (!result.success) {
        return (
            <div className="p-6 bg-red-950/20 rounded-2xl text-red-100/90 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <Info className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-red-300">Analysis Halted</h3>
                </div>
                <div className="p-4 bg-black/20 rounded-xl shadow-inner font-mono text-sm leading-relaxed">
                    {result.error || 'The system could not process this request. Please verify the problem statement.'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── Formula Used ── */}
            {result.formula_used && (
                <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 bg-blue-500/5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] flex items-center space-x-2">
                        <Sigma className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Formula Used</h4>
                    </div>
                    <div className="p-10 flex flex-col items-center justify-center">
                        <div className="text-2xl md:text-3xl text-white font-serif tracking-wide hover:scale-105 transition-transform duration-500 cursor-default">
                            <BlockMath math={result.formula_used} />
                        </div>

                        {/* ── Variables Grid ── */}
                        {result.formula_variables && result.formula_variables.length > 0 && (
                            <div className="mt-8 w-full shadow-[0_-1px_0_0_rgba(255,255,255,0.03)] pt-8">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Info className="w-3 h-3 text-brand-muted" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Variables</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {result.formula_variables.map((v, i) => (
                                        <div key={i} className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/[0.08] transition-colors group shadow-sm">
                                            <span className="text-blue-400 font-bold font-serif whitespace-nowrap">{v.name}</span>
                                            <span className="text-white/20">=</span>
                                            <span className="text-sm text-brand-text/80 truncate group-hover:text-white transition-colors">{v.description} ({v.unit})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Variable Explanation ── */}
            {(result.formula_variables && result.formula_variables.length > 0 || result.variable_explanation) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.variable_explanation && typeof result.variable_explanation === 'string' ? (
                        <div className="md:col-span-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/20 transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-2">
                                <Sigma className="w-3 h-3 text-blue-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Variable Explanation</h4>
                            </div>
                            <p className="text-sm text-brand-text/80 leading-relaxed italic">{result.variable_explanation}</p>
                        </div>
                    ) : (
                        (result.formula_variables || (Array.isArray(result.variable_explanation) ? result.variable_explanation : [])).map((v, i) => (
                            <div key={i} className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all duration-300">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-blue-400 font-bold">{v.name}</span>
                                    <span className="text-[10px] text-white/30 uppercase font-black">{v.unit}</span>
                                </div>
                                <p className="text-xs text-brand-text/60 leading-tight">{v.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Solution Steps ── */}
            {result.steps && result.steps.length > 0 && (
                <div className="bg-[#0f172a]/60 backdrop-blur-lg border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 bg-emerald-500/5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Solution</h4>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-muted hover:text-white transition-colors"
                        >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied' : 'Copy Result'}</span>
                        </button>
                    </div>
                    <div className="p-8 space-y-6 relative">
                        <div className="absolute left-12 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/20 to-transparent"></div>
                        {result.steps.map((step, i) => (
                            <div key={i} className="relative pl-12 group animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="absolute left-0 top-1 w-8 h-8 bg-[#0f172a] border border-blue-500/30 rounded-full flex items-center justify-center text-[10px] font-black group-hover:border-blue-400 transition-colors z-10 shadow-lg shadow-blue-500/10">
                                    {i + 1}
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/[0.07] transition-all duration-300">
                                    <p className="text-sm font-bold text-white/90 mb-3">{step.description}</p>
                                    <div className="p-4 bg-black/40 rounded-xl overflow-x-auto border border-white/5 flex justify-center">
                                        <InlineMath math={step.latex} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Final Answer ── */}
            {(result.final_values && result.final_values.length > 0 || result.final_answer) && (
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-[#0b1121] border border-blue-500/30 rounded-2xl p-8 overflow-hidden">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center space-x-2">
                                <Target className="w-3 h-3" />
                                <span>Final Result</span>
                            </span>
                            <div className="space-y-4">
                                {(result.final_values || [result.final_answer]).filter(Boolean).map((v, i) => (
                                    <div key={i} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
                                        {v}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -right-10 -bottom-10 opacity-5 text-[120px] font-black select-none pointer-events-none">RESULT</div>
                    </div>
                </div>
            )}

            {/* ── Concept Explanation ── */}
            {(result.concept_explanation || result.explanation) && (
                <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl animate-in fade-in duration-1000">
                    <div className="flex items-center space-x-2 mb-3">
                        <HelpCircle className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Concept Explanation</h4>
                    </div>
                    <p className="text-sm text-brand-text/90 leading-relaxed italic">
                        {result.concept_explanation || result.explanation}
                    </p>
                </div>
            )}

            {/* ── Related Concepts ── */}
            {result.related_concepts && result.related_concepts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {result.related_concepts.map((concept, i) => (
                        <div key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center space-x-2 hover:bg-indigo-500/20 transition-colors cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            <span>{concept}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Real World & Next Steps ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Real-World Connections */}
                {result.real_world_applications && result.real_world_applications.length > 0 && (
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400/80">Real-World Connections</h4>
                        </div>
                        <div className="space-y-4">
                            {result.real_world_applications.map((app, i) => {
                                let Icon = Globe;
                                let colorClass = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

                                if (app.type === 'engineering') {
                                    Icon = Wrench;
                                    colorClass = "text-amber-400 bg-amber-400/10 border-amber-400/20";
                                } else if (app.type === 'scientific') {
                                    Icon = FlaskConical;
                                    colorClass = "text-purple-400 bg-purple-400/10 border-purple-400/20";
                                } else if (app.type === 'interdisciplinary') {
                                    Icon = Lightbulb;
                                    colorClass = "text-blue-400 bg-blue-400/10 border-blue-400/20";
                                }

                                return (
                                    <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className={`p-1.5 rounded-lg border ${colorClass}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50">{app.label}</h5>
                                        </div>
                                        <p className="text-sm text-brand-muted leading-relaxed group-hover:text-brand-text transition-colors">
                                            {app.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                {result.next_steps && result.next_steps.length > 0 && (
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <ArrowRight className="w-4 h-4 text-brand-muted" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-brand-muted">Recommended Studies</h4>
                        </div>
                        <div className="space-y-3">
                            {result.next_steps.map((step, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group">
                                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors"></div>
                                    <p className="text-sm text-brand-muted group-hover:text-white transition-colors">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* suggestion footer */}
            <div className="pt-4 flex items-center justify-center text-xs text-brand-muted font-medium italic space-x-2 opacity-50 hover:opacity-100 transition-opacity">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Tip: You can use "Dictate" to input problems via voice.</span>
            </div>

        </div>
    );
};
