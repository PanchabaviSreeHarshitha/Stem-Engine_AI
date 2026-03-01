import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export const solveEquation = async (equation: string, solveFor?: string, knownVariables?: Record<string, string>, explanationLevel?: string) => {
    const response = await api.post('/solve', {
        equation,
        solve_for: solveFor,
        known_variables: knownVariables,
        explanation_level: explanationLevel
    });
    return response.data;
};

export const plotEquation = async (equation: string) => {
    const response = await api.post('/plot', { equation });
    return response.data;
};

export const getFormulas = async () => {
    const response = await api.get('/formulas');
    return response.data;
};

export const searchFormulas = async (query: string) => {
    const response = await api.get(`/formulas/search?q=${query}`);
    return response.data;
};

export const scanImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/scan-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Backend OCR Error:", error);

        // Fallback or detailed error
        return {
            success: false,
            error: "Failed to scan image. Ensure the STEM Engine backend server is running and AI features are enabled."
        };
    }
};

// No custom strip needed, use .trim()
