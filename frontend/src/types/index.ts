export interface Step {
    description: string;
    latex: string;
}

export interface SolveResult {
    success: boolean;
    solve_for?: string;
    solutions?: string[];
    steps?: Step[];
    final_values?: string[];
    error?: string;
    // AI STEM Intelligence Engine fields (Standardized)
    subject?: string;
    formula?: string;
    variable_explanation?: string | any[];
    final_answer?: string;
    concept_explanation?: string;
    explanation?: string; // Legacy/Compat
    // Word problem solver fields
    problem_type?: string;
    formula_used?: string;
    formula_variables?: { name: string; description: string; unit: string }[];
    // Enrichment fields
    related_concepts?: string[];
    next_steps?: string[];
    real_world_applications?: {
        type: 'application' | 'engineering' | 'scientific' | 'interdisciplinary';
        label: string;
        description: string;
    }[];
}

export interface PlotData {
    type: '2d' | '3d';
    x: number[];
    y: number[];
    z?: number[][];
    xaxis_title?: string;
    yaxis_title?: string;
    zaxis_title?: string;
    error?: string;
}

export interface Variable {
    name: string;
    unit: string;
    constant?: number;
}

export interface Formula {
    id: string;
    name: string;
    equation: string;
    variables: Record<string, Variable>;
    description: string;
    tags: string[];
}
