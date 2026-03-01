import React from 'react';
import { Brain, Target, Clock, Flame } from 'lucide-react';
import Plot from 'react-plotly.js';
import { Language } from '../translations';

// Type workaround for react-plotly.js in React 18
const PlotComponent = Plot as any;

export const Analytics: React.FC<{ language: Language }> = ({ language }) => {

    // Mock Data for Charts
    const donutData: any = [{
        values: [2, 0, 0],
        labels: ['Physics', 'Chemistry', 'Mathematics'],
        type: 'pie',
        hole: .6,
        textinfo: 'none',
        hoverinfo: 'label+value',
        marker: {
            colors: ['#3b82f6', '#10b981', '#a855f7']
        }
    }];

    const donutLayout: Partial<Plotly.Layout> = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: true,
        legend: { font: { color: '#94a3b8' }, y: 0, x: 0.5, xanchor: 'center', orientation: 'h' },
        margin: { t: 10, b: 10, l: 10, r: 10 },
        height: 250,
    };

    const radarData: any = [{
        type: 'scatterpolar',
        r: [90, 10, 10, 80, 70],
        theta: ['Physics', 'Chemistry', 'Mathematics', 'Speed', 'Consistency'],
        fill: 'toself',
        fillcolor: 'rgba(59, 130, 246, 0.2)',
        line: { color: '#3b82f6', width: 2 },
        marker: { color: '#3b82f6', size: 6 }
    }];

    const radarLayout: Partial<Plotly.Layout> = {
        polar: {
            radialaxis: { visible: false, range: [0, 100] },
            angularaxis: {
                tickfont: { color: '#94a3b8', size: 10 },
                linecolor: 'rgba(148, 163, 184, 0.2)',
                gridcolor: 'rgba(148, 163, 184, 0.1)'
            },
            bgcolor: 'rgba(0,0,0,0)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        margin: { t: 30, b: 30, l: 30, r: 30 },
        height: 250,
    };

    const barData: any = [{
        type: 'bar',
        x: ['Kinematics', 'Dynamics', 'Algebra'],
        y: [5, 2, 0],
        marker: { color: '#3b82f6' }
    }];

    const barLayout: Partial<Plotly.Layout> = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 10, b: 20, l: 30, r: 10 },
        height: 150,
        xaxis: { tickfont: { color: '#94a3b8' }, gridcolor: 'rgba(148, 163, 184, 0.05)' },
        yaxis: { visible: false, gridcolor: 'rgba(148, 163, 184, 0.05)' }
    };

    const lineData: any = [{
        type: 'scatter',
        mode: 'lines+markers',
        x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        y: [80, 85, 90, 100, 100],
        line: { color: '#a855f7', width: 3, shape: 'spline' },
        marker: { color: '#a855f7', size: 8 }
    }];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-6xl w-full">

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<Brain className="w-5 h-5 text-blue-400" />} value="2" label="Total Solved" />
                <StatCard icon={<Target className="w-5 h-5 text-emerald-400" />} value="100%" label="Accuracy" />
                <StatCard icon={<Clock className="w-5 h-5 text-purple-400" />} value="13s" label="Avg Time" />
                <StatCard icon={<Flame className="w-5 h-5 text-orange-400" />} value="1 days" label="Streak" />
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Subject Distribution */}
                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Subject Distribution</h3>
                    <div className="flex items-center justify-center bg-[#0b1121] rounded-xl shadow-md">
                        <PlotComponent data={donutData} layout={donutLayout} config={{ displayModeBar: false }} className="w-full" />
                    </div>
                </div>

                {/* Skill Radar */}
                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Skill Radar</h3>
                    <div className="flex items-center justify-center bg-[#0b1121] rounded-xl shadow-md">
                        <PlotComponent data={radarData} layout={radarLayout} config={{ displayModeBar: false }} className="w-full" />
                    </div>
                </div>

            </div>

            {/* Bottom Section: More Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">

                {/* Accuracy Trend */}
                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Accuracy Trend</h3>
                    <div className="p-4 bg-[#0b1121] rounded-xl shadow-md">
                        <PlotComponent data={lineData} layout={barLayout} config={{ displayModeBar: false }} className="w-full" />
                    </div>
                </div>

                {/* Most Practiced Topics */}
                <div>
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Most Practiced Topics</h3>
                    <div className="p-4 bg-[#0b1121] rounded-xl shadow-md">
                        <PlotComponent data={barData} layout={barLayout} config={{ displayModeBar: false }} className="w-full" />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Sub-component
const StatCard = ({ icon, value, label }: any) => (
    <div className="bg-[#0b1121] p-5 rounded-xl flex flex-col space-y-3 shadow-md hover:shadow-lg transition-shadow">
        <div className="bg-brand-surface/40 w-10 h-10 rounded-lg flex items-center justify-center shadow-inner">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white leading-none mb-1">{value}</h3>
            <p className="text-brand-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        </div>
    </div>
);
