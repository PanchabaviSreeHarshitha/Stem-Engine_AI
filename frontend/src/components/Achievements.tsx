import React, { useState } from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { Language } from '../translations';

type FilterType = 'All' | 'General' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Streak';

export const Achievements: React.FC<{ language: Language }> = ({ language }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const filters: FilterType[] = ['All', 'General', 'Physics', 'Chemistry', 'Mathematics', 'Streak'];

    const badges = [
        { id: 'first-step', title: 'First Step', desc: 'Solve your first problem', category: 'General', earned: true },
        { id: 'problem-crusher', title: 'Problem Crusher', desc: 'Solve 10 problems', category: 'General', earned: false },
        { id: 'knowledge-seeker', title: 'Knowledge Seeker', desc: 'Solve 50 problems', category: 'General', earned: false },
        { id: 'centurion', title: 'Centurion', desc: 'Solve 100 problems', category: 'General', earned: false },
        { id: 'newtons-apprentice', title: 'Newton\'s Apprentice', desc: 'Solve 10 Physics problems', category: 'Physics', earned: false },
        { id: 'alchemist', title: 'Alchemist', desc: 'Solve 10 Chemistry problems', category: 'Chemistry', earned: false },
        { id: 'eulers-student', title: 'Euler\'s Student', desc: 'Solve 10 Math problems', category: 'Mathematics', earned: false },
        { id: 'hot-streak', title: 'Hot Streak', desc: '3-day streak', category: 'Streak', earned: false },
        { id: 'on-fire', title: 'On Fire', desc: '7-day streak', category: 'Streak', earned: false },
        { id: 'unstoppable', title: 'Unstoppable', desc: '30-day streak', category: 'Streak', earned: false },
        { id: 'xp-hunter', title: 'XP Hunter', desc: 'Earn 1000 XP', category: 'General', earned: false },
        { id: 'xp-master', title: 'XP Master', desc: 'Earn 5000 XP', category: 'General', earned: false },
    ];

    const filteredBadges = activeFilter === 'All'
        ? badges
        : badges.filter(b => b.category === activeFilter);

    const earnedCount = badges.filter(b => b.earned).length;

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-6xl">

            {/* Header */}
            <div className="flex justify-between items-start mb-10 pb-6 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
                <div className="flex items-center space-x-4">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">Achievements</h2>
                        <p className="text-brand-muted text-sm mt-1">
                            <span className="font-bold text-white">{earnedCount}</span> of {badges.length} badges earned
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-500 leading-none">20</p>
                    <p className="text-brand-muted text-xs uppercase tracking-widest font-semibold mt-1">Total XP</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${activeFilter === filter
                            ? 'bg-brand-surface text-white shadow-md'
                            : 'text-brand-muted hover:text-white'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBadges.map(badge => (
                    <div
                        key={badge.id}
                        className={`p-4 rounded-xl flex items-center space-x-4 ${badge.earned
                            ? 'bg-yellow-900/15 shadow-[0_0_20px_rgba(234,179,8,0.05)]'
                            : 'bg-[#0b1121] opacity-70'
                            }`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${badge.earned
                            ? 'bg-yellow-500/10'
                            : 'bg-brand-surface'
                            }`}>
                            {badge.earned ? (
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                            ) : (
                                <Lock className="w-5 h-5 text-brand-muted/50" />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-semibold ${badge.earned ? 'text-white' : 'text-brand-muted'}`}>
                                {badge.title}
                            </h3>
                            <p className="text-brand-muted/70 text-xs mt-0.5">{badge.desc}</p>

                            <div className="mt-2 flex items-center">
                                {badge.earned ? (
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                        Earned
                                    </span>
                                ) : (
                                    <span className="bg-brand-surface text-brand-muted text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                        Locked
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
