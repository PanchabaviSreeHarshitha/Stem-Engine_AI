import { SolveResult } from '../types';

const API_URL = 'http://127.0.0.1:8000/api/ai';

export const solveWithAI = async (
    problem: string,
    subject: string,
    level: string = 'Step by Step',
    language: string = 'English',
    provider: string = 'gemini',
    model?: string
): Promise<SolveResult> => {
    try {
        console.log(`[AI] Calling ${API_URL} (Provider: ${provider}) with problem: ${problem.substring(0, 50)}...`);

        // Add a 20-second timeout for the AI request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                problem,
                subject,
                level,
                language,
                provider,
                model
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log(`[AI] Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to connect to AI backend');
        }

        const data: SolveResult = await response.json();
        return data;
    } catch (error: any) {
        console.error("AI Solver Error:", error);
        return {
            success: false,
            error: error.message || "Failed to generate solution. Ensure the backend server is running."
        };
    }
};
