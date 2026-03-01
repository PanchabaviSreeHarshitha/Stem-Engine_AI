import React, { useState } from 'react';
import { subjectsData, topicContentMap } from './Concepts';
import { Download, ChevronDown, ChevronRight, X, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type CheatSheetProps = {
    onClose: () => void;
};

export const CheatSheet: React.FC<CheatSheetProps> = ({ onClose }) => {
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
        Physics: true,
        Chemistry: true,
        Mathematics: true
    });
    const [isDownloading, setIsDownloading] = useState(false);

    const toggleSubject = (subject: string) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subject]: !prev[subject]
        }));
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        const element = document.getElementById('cheat-sheet-content');
        if (!element) return;

        try {
            // Expand all temporarily for the PDF
            const prevExpanded = { ...expandedSubjects };
            setExpandedSubjects({ Physics: true, Chemistry: true, Mathematics: true });

            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0b1121' // match dark theme
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            pdf.save('STEM_Cheat_Sheet.pdf');

            // Restore state
            setExpandedSubjects(prevExpanded);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-brand-surface border border-brand-muted/20 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-muted/10 bg-[#0b1121]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Master Formula Cheat Sheet</h2>
                            <p className="text-sm text-brand-muted">Comprehensive reference for all STEM formulas</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 text-brand-muted hover:text-white rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b1121] p-6">
                    <div id="cheat-sheet-content" className="bg-[#0b1121] pb-12">
                        {/* Title for PDF only */}
                        <div className="hidden print-title text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">STEM Formula Reference Guide</h1>
                            <p className="text-brand-muted">Complete collection of Physics, Chemistry, and Mathematics equations.</p>
                        </div>

                        {Object.entries(subjectsData).map(([subject, data]) => {
                            const Icon = data.icon;
                            const isExpanded = expandedSubjects[subject];

                            // Determine color classes
                            const headerColors = {
                                Physics: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
                                Chemistry: 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400',
                                Mathematics: 'bg-purple-900/20 border-purple-500/30 text-purple-400'
                            }[subject] || 'bg-gray-900/20 border-gray-500/30 text-gray-400';

                            return (
                                <div key={subject} className="mb-8">
                                    <button
                                        onClick={() => toggleSubject(subject)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border ${headerColors} transition-colors mb-4`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="w-6 h-6" />
                                            <span className="text-xl font-bold">{subject}</span>
                                        </div>
                                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </button>

                                    {isExpanded && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                                            {data.topics.map(topic => {
                                                const content = topicContentMap[topic.id];
                                                if (!content || content.formulas.length === 0) return null;

                                                return (
                                                    <div key={topic.id} className="bg-[#111827] border border-brand-muted/15 rounded-xl p-5 shadow-sm">
                                                        <h3 className="text-base font-bold text-white mb-4 border-b border-brand-muted/10 pb-2">{content.title}</h3>
                                                        <div className="space-y-4">
                                                            {content.formulas.map((formula, idx) => (
                                                                <div key={idx} className="flex flex-col">
                                                                    <code className="text-blue-300 font-mono text-sm mb-1 bg-[#0b1121] p-2 rounded-lg border border-blue-900/30 overflow-x-auto">
                                                                        {formula.equation}
                                                                    </code>
                                                                    <div className="flex items-baseline justify-between mt-1 px-1">
                                                                        <span className="text-white text-xs font-semibold">{formula.name}</span>
                                                                        <span className="text-brand-muted text-[10px] truncate ml-2 max-w-[60%]" title={formula.desc}>{formula.desc}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Styles for PDF generation to ensure hidden elements show up in canvas if needed */}
            <style>{`
                #cheat-sheet-content {
                    font-family: system-ui, -apple-system, sans-serif;
                }
            `}</style>
        </div>
    );
};
