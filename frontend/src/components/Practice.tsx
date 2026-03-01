import React, { useState, useEffect } from 'react';
import { Atom, Shell, Sigma, Play, ArrowRight, CheckCircle2, XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { questionBank, Question } from '../data/questionBank';
import { Language } from '../translations';

type Subject = 'Physics' | 'Chemistry' | 'Mathematics';
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Advanced';
type Mode = 'Free Practice' | 'Timed Challenge' | 'JEE Style' | 'NEET Style' | 'SAT Style';

export const Practice: React.FC<{ onSolveProblem?: (problem: string) => void; language: Language }> = ({ onSolveProblem }) => {
    const [subject, setSubject] = useState<Subject>('Physics');
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [mode, setMode] = useState<Mode>('Free Practice');

    // Exam State
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const subjects: { id: Subject, icon: any }[] = [
        { id: 'Physics', icon: Atom },
        { id: 'Chemistry', icon: Shell },
        { id: 'Mathematics', icon: Sigma },
    ];

    const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Advanced'];

    const modes: { id: Mode, label: string, desc: string }[] = [
        { id: 'Free Practice', label: 'Free Practice', desc: 'No time limit' },
        { id: 'Timed Challenge', label: 'Timed Challenge', desc: 'Timer tracking' },
        { id: 'JEE Style', label: 'JEE Style', desc: 'Competitive exam' },
        { id: 'NEET Style', label: 'NEET Style', desc: 'Medical entrance' },
    ];

    const handleStart = () => {
        // Filter min 10 questions
        const filtered = questionBank.filter(q => q.subject === subject && q.difficulty === difficulty);
        // Shuffle them
        const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
        setCurrentQuestions(shuffled);
        setCurrentIndex(0);
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
        setIsSessionActive(true);
    };

    const handleAnswerSelect = (opt: string) => {
        if (isSubmitted) return;
        const qId = currentQuestions[currentIndex].id;
        setUserAnswers(prev => ({ ...prev, [qId]: opt }));
    };

    const handleSubmitExam = () => {
        let currentScore = 0;
        currentQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) {
                currentScore += 1;
            }
        });
        setScore(currentScore);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setIsSessionActive(false);
    };

    // ---------------- ACTIVE EXAM UI ---------------- //
    if (isSessionActive) {
        if (currentQuestions.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-12 h-full text-center">
                    <p className="text-brand-muted mb-4">No questions found for this configuration.</p>
                    <button onClick={handleReset} className="px-4 py-2 bg-brand-surface rounded-xl text-white">Go Back</button>
                </div>
            );
        }

        if (isSubmitted) {
            return (
                <div className="flex flex-col h-full animate-in fade-in max-w-4xl pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Exam Results</h2>
                            <p className="text-brand-muted">You scored {score} out of {currentQuestions.length}</p>
                        </div>
                        <button onClick={handleReset} className="flex items-center space-x-2 bg-brand-surface hover:bg-brand-surface/80 px-4 py-2 rounded-xl text-white transition-all shadow-md">
                            <RefreshCcw className="w-4 h-4" />
                            <span>New Session</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {currentQuestions.map((q, idx) => {
                            const isCorrect = userAnswers[q.id] === q.correctAnswer;
                            const isUnanswered = !userAnswers[q.id];
                            return (
                                <div key={q.id} className={`p-6 bg-brand-surface rounded-2xl ${isCorrect ? 'shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'shadow-[0_0_20px_rgba(239,68,68,0.05)]'}`}>
                                    <div className="flex space-x-3 items-start mb-4">
                                        <div className="mt-1">
                                            {isCorrect ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : <XCircle className="text-red-400 w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Q{idx + 1}. {q.question}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8 mb-4">
                                        {q.options.map((opt, i) => {
                                            let bg = 'bg-brand-background text-brand-muted';
                                            if (opt === q.correctAnswer) bg = 'bg-green-500/10 text-green-300';
                                            else if (opt === userAnswers[q.id] && !isCorrect) bg = 'bg-red-500/10 text-red-300';

                                            return (
                                                <div key={i} className={`px-4 py-3 rounded-xl ${bg} transition-colors`}>
                                                    {opt}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {!isCorrect && (
                                        <div className="pl-8">
                                            <div className="px-4 py-3 bg-blue-900/20 rounded-xl">
                                                <p className="text-xs text-blue-300/70 font-semibold mb-1 uppercase tracking-wider">Explanation</p>
                                                <p className="text-sm text-blue-100">{q.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        const q = currentQuestions[currentIndex];
        const selectedOpt = userAnswers[q.id];

        return (
            <div className="flex flex-col h-full animate-in slide-in-from-right max-w-4xl relative">
                <div className="flex items-center justify-between mb-8 pb-4 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
                    <div>
                        <button onClick={handleReset} className="flex items-center space-x-2 text-brand-muted hover:text-white transition-colors text-sm mb-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Exit Session</span>
                        </button>
                        <h2 className="text-xl font-bold text-white">{subject} &bull; {difficulty}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            {currentIndex + 1}
                        </span>
                        <span className="text-brand-muted font-medium"> / {currentQuestions.length}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-8 bg-brand-surface rounded-2xl mb-8 shadow-xl shadow-black/25">
                        <h3 className="text-xl text-white font-medium leading-relaxed mb-8">{q.question}</h3>

                        <div className="grid grid-cols-1 gap-4">
                            {q.options.map((opt, i) => {
                                const isSelected = selectedOpt === opt;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswerSelect(opt)}
                                        className={`flex items-center px-6 py-4 rounded-xl text-left transition-all ${isSelected
                                            ? 'bg-blue-600/25 text-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.01]'
                                            : 'bg-brand-background text-brand-text hover:bg-brand-surface/80'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 transition-colors ${isSelected ? 'bg-blue-500/20' : 'bg-brand-muted/10'}`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />}
                                        </div>
                                        <span className="text-base">{opt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 shadow-[0_-1px_0_0_rgba(255,255,255,0.03)]">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-brand-muted bg-brand-surface' : 'text-white bg-brand-surface hover:bg-brand-surface/80'}`}
                    >
                        Previous
                    </button>

                    {currentIndex === currentQuestions.length - 1 ? (
                        <button
                            onClick={handleSubmitExam}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-green-500/20"
                        >
                            Submit Exam
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center space-x-2"
                        >
                            <span>Next Question</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ---------------- CONFIGURATION UI ---------------- //
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-2">Practice Module</h2>
            <p className="text-brand-muted mb-8">Configure your exam parameters and start testing your knowledge.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Subject</h3>
                    <div className="grid grid-cols-1 gap-3 mb-8">
                        {subjects.map(s => {
                            const Icon = s.icon;
                            const isActive = subject === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setSubject(s.id)}
                                    className={`flex items-center space-x-3 px-5 py-4 rounded-xl text-left transition-all duration-200 ${isActive
                                        ? 'bg-blue-900/40 text-white shadow-lg'
                                        : 'bg-brand-surface text-brand-muted hover:bg-brand-surface/80 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-brand-muted'}`} />
                                    <span className="font-medium text-base">{s.id}</span>
                                </button>
                            );
                        })}
                    </div>

                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Difficulty</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {difficulties.map(d => {
                            const isActive = difficulty === d;
                            return (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`px-4 py-3 rounded-xl text-center transition-all duration-200 ${isActive
                                        ? 'bg-blue-900/40 text-white shadow-lg'
                                        : 'bg-brand-surface text-brand-muted hover:bg-brand-surface/80 hover:text-white'
                                        }`}
                                >
                                    <span className="font-medium">{d}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Mode</h3>
                    <div className="grid grid-cols-1 gap-4 mb-10">
                        {modes.map(m => {
                            const isActive = mode === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`flex flex-col text-left px-5 py-4 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-blue-900/30 text-white shadow-lg'
                                        : 'bg-brand-surface text-brand-muted hover:bg-brand-surface/80 hover:text-white'
                                        }`}
                                >
                                    <span className="font-semibold text-sm mb-1">{m.label}</span>
                                    <span className={`text-xs ${isActive ? 'text-blue-300/70' : 'text-brand-muted/60'}`}>{m.desc}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6 bg-blue-950/20 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="w-5 h-5 text-blue-400 fill-blue-400 ml-1" />
                        </div>
                        <h4 className="text-white font-medium mb-2">Ready to begin?</h4>
                        <p className="text-sm text-brand-muted mb-6">You will be tested with 10 random questions from your selected configuration.</p>
                        <button
                            onClick={handleStart}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Start Practice Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
