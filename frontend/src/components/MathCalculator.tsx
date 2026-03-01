import React, { useState } from 'react';
import { Send, Delete, X } from 'lucide-react';

interface MathCalculatorProps {
    onInput: (val: string) => void;
    onDelete: () => void;
    onClear: () => void;
    onSolve: () => void;
    onClose: () => void;
}

type Tab = 'Algebra' | 'Trigonometry' | 'Calculus';

export const MathCalculator: React.FC<MathCalculatorProps> = ({ onInput, onDelete, onClear, onSolve, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Algebra');

    const tabs: Tab[] = ['Algebra', 'Trigonometry', 'Calculus'];

    const renderButton = (label: string | React.ReactNode, value: string, className: string = '', isAction: boolean = false) => {
        const handleClick = () => {
            if (value === 'SEND') {
                onSolve();
            } else if (value === 'BACKSPACE') {
                onDelete();
            } else if (value === 'AC') {
                onClear();
            } else {
                onInput(value);
            }
        };

        return (
            <button
                key={typeof label === 'string' ? label : Math.random()}
                onClick={handleClick}
                className={`flex items-center justify-center p-3 rounded-2xl text-sm font-medium transition-all duration-200 border border-white/5 active:scale-95 ${className}`}
            >
                {label}
            </button>
        );
    };

    const getSendButtonColor = () => {
        switch (activeTab) {
            case 'Algebra': return 'bg-[#d1c4e9] hover:bg-[#b39ddb] text-purple-900';
            case 'Trigonometry': return 'bg-[#81c784] hover:bg-[#66bb6a] text-green-900';
            case 'Calculus': return 'bg-[#f48fb1] hover:bg-[#f06292] text-pink-900';
            default: return 'bg-blue-600';
        }
    };

    const algebraButtons = [
        { label: 'x²', val: '**2' }, { label: '√', val: 'sqrt(' }, { label: '<', val: '<' }, { label: '(', val: '(' }, { label: ')', val: ')' }, { label: <Delete className="w-4 h-4" />, val: 'BACKSPACE', class: 'bg-white/5 hover:bg-white/10' }, { label: 'AC', val: 'AC', class: 'bg-white/5 hover:bg-white/10' },
        { label: '□/□', val: '/' }, { label: '|□|', val: 'abs(' }, { label: '≤', val: '<=' }, { label: '7', val: '7', class: 'bg-white/10' }, { label: '8', val: '8', class: 'bg-white/10' }, { label: '9', val: '9', class: 'bg-white/10' }, { label: '÷', val: '/', class: 'bg-white/5' },
        { label: 'log_b', val: 'log(' }, { label: '□!', val: '!' }, { label: '>', val: '>' }, { label: '4', val: '4', class: 'bg-white/10' }, { label: '5', val: '5', class: 'bg-white/10' }, { label: '6', val: '6', class: 'bg-white/10' }, { label: '×', val: '*', class: 'bg-white/5' },
        { label: 'i', val: 'i' }, { label: '%', val: '%' }, { label: '≥', val: '>=' }, { label: '1', val: '1', class: 'bg-white/10' }, { label: '2', val: '2', class: 'bg-white/10' }, { label: '3', val: '3', class: 'bg-white/10' }, { label: '-', val: '-', class: 'bg-white/5' },
        { label: 'x', val: 'x' }, { label: 'y', val: 'y' }, { label: '=', val: '=' }, { label: '0', val: '0', class: 'bg-white/10 col-span-1' }, { label: '.', val: '.', class: 'bg-white/10' }, { label: <Send className="w-4 h-4" />, val: 'SEND', class: `col-span-1 ${getSendButtonColor()}` }, { label: '+', val: '+', class: 'bg-white/5' },
    ];

    const trigButtons = [
        { label: 'sin', val: 'sin(' }, { label: 'cos', val: 'cos(' }, { label: 'tan', val: 'tan(' }, { label: '(', val: '(' }, { label: ')', val: ')' }, { label: <Delete className="w-4 h-4" />, val: 'BACKSPACE', class: 'bg-white/5 hover:bg-white/10' }, { label: 'AC', val: 'AC', class: 'bg-white/5 hover:bg-white/10' },
        { label: 'csc', val: 'csc(' }, { label: 'sec', val: 'sec(' }, { label: 'cot', val: 'cot(' }, { label: '7', val: '7', class: 'bg-white/10' }, { label: '8', val: '8', class: 'bg-white/10' }, { label: '9', val: '9', class: 'bg-white/10' }, { label: '÷', val: '/', class: 'bg-white/5' },
        { label: 'arcsin', val: 'asin(' }, { label: 'arccos', val: 'acos(' }, { label: 'arctan', val: 'atan(' }, { label: '4', val: '4', class: 'bg-white/10' }, { label: '5', val: '5', class: 'bg-white/10' }, { label: '6', val: '6', class: 'bg-white/10' }, { label: '×', val: '*', class: 'bg-white/5' },
        { label: '□²', val: '**2' }, { label: '□°', val: '*pi/180' }, { label: 'π', val: 'pi' }, { label: '1', val: '1', class: 'bg-white/10' }, { label: '2', val: '2', class: 'bg-white/10' }, { label: '3', val: '3', class: 'bg-white/10' }, { label: '-', val: '-', class: 'bg-white/5' },
        { label: 'x', val: 'x' }, { label: 'y', val: 'y' }, { label: '=', val: '=' }, { label: '0', val: '0', class: 'bg-white/10' }, { label: '.', val: '.', class: 'bg-white/10' }, { label: <Send className="w-4 h-4" />, val: 'SEND', class: `col-span-1 ${getSendButtonColor()}` }, { label: '+', val: '+', class: 'bg-white/5' },
    ];

    const calcButtons = [
        { label: 'd/d□', val: 'diff(' }, { label: '∞', val: 'oo' }, { label: '√', val: 'sqrt(' }, { label: '(', val: '(' }, { label: ')', val: ')' }, { label: <Delete className="w-4 h-4" />, val: 'BACKSPACE', class: 'bg-white/5 hover:bg-white/10' }, { label: 'AC', val: 'AC', class: 'bg-white/5 hover:bg-white/10' },
        { label: 'lim □→0', val: 'limit(' }, { label: 'lim □→0+', val: 'limit(' }, { label: 'lim □→0-', val: 'limit(' }, { label: '7', val: '7', class: 'bg-white/10' }, { label: '8', val: '8', class: 'bg-white/10' }, { label: '9', val: '9', class: 'bg-white/10' }, { label: '÷', val: '/', class: 'bg-white/5' },
        { label: 'log_b', val: 'log(' }, { label: 'C(n,k)', val: 'comb(' }, { label: 'P(n,k)', val: 'perm(' }, { label: '4', val: '4', class: 'bg-white/10' }, { label: '5', val: '5', class: 'bg-white/10' }, { label: '6', val: '6', class: 'bg-white/10' }, { label: '×', val: '*', class: 'bg-white/5' },
        { label: 'Σ', val: 'summation(' }, { label: '∫', val: 'integrate(' }, { label: '∫_a^b', val: 'integrate(' }, { label: '1', val: '1', class: 'bg-white/10' }, { label: '2', val: '2', class: 'bg-white/10' }, { label: '3', val: '3', class: 'bg-white/10' }, { label: '-', val: '-', class: 'bg-white/5' },
        { label: 'x', val: 'x' }, { label: 'y', val: 'y' }, { label: 'e', val: 'e' }, { label: '0', val: '0', class: 'bg-white/10' }, { label: '.', val: '.', class: 'bg-white/10' }, { label: <Send className="w-4 h-4" />, val: 'SEND', class: `col-span-1 ${getSendButtonColor()}` }, { label: '+', val: '+', class: 'bg-white/5' },
    ];

    const currentButtons = activeTab === 'Algebra' ? algebraButtons : activeTab === 'Trigonometry' ? trigButtons : calcButtons;

    return (
        <div className="bg-[#121826] border border-white/5 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-500 max-w-md w-full mx-auto relative overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm font-semibold transition-all relative pb-1 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2">
                {currentButtons.map((btn, idx) => renderButton(btn.label, btn.val, btn.class))}
            </div>
        </div>
    );
};
