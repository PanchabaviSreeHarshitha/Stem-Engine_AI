import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const HF_MODEL = "Qwen/Qwen2.5-7B-Instruct"; // Top-tier open-source STEM model
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

app.post("/ai", async (req, res) => {
    try {
        const { prompt, problem, subject, level, language = "English" } = req.body;

        const apiToken = process.env.HF_TOKEN;
        console.log(`[AI Request] Mode: ${prompt ? 'Simple' : 'Structured'}, Model: ${HF_MODEL}`);
        console.log("Using HF Token:", apiToken ? `${apiToken.substring(0, 7)}...` : "MISSING");

        // 1. Simple Mode (for custom client functions like askAI)
        if (prompt && !problem) {
            const hfResponse = await axios.post(
                HF_API_URL,
                {
                    model: HF_MODEL,
                    messages: [
                        { role: "system", content: `You are an intelligent STEM assistant. Please respond in ${language}.` },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 500
                },
                { headers: { Authorization: `Bearer ${apiToken}` } }
            );

            const response = hfResponse.data.choices[0].message.content;
            return res.json({ response });
        }

        // 2. STEM Intelligence Engine Mode (New Standardized Structure)
        const systemPrompt = `You are an AI STEM Intelligence Engine.
            Always provide the solution in this specific structure:
            1. Subject: Identify the field (Physics, Chemistry, Math, Biology)
            2. Formula: The main LaTeX formula used
            3. Variable Explanation: Define all variables and units
            4. Step-by-Step Solution: Show clear logical steps with LaTeX
            5. Final Answer: The result with units
            6. Concept Explanation: A brief pedagogical summary of the concept
            
            CRITICAL: You must provide all textual descriptions, explanations, and step titles in the following language: ${language}.
            However, keep the JSON keys (e.g., "subject", "formula") strictly in English.
            Keep all mathematical formulas in LaTeX format.

            IMPORTANT: Return response in VALID JSON format ONLY. 
            The JSON structure must be:
            {
              "subject": "string",
              "formula": "LaTeX string",
              "variable_explanation": "string or array of definitions",
              "steps": [
                { "description": "Step title", "latex": "LaTeX code" }
              ],
              "final_answer": "string with units",
              "concept_explanation": "concise explanation"
            }`;

        console.log(`Sending structured request for: ${problem?.substring(0, 50)}...`);

        const hfResponse = await axios.post(
            HF_API_URL,
            {
                model: HF_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Solve this for subject: ${subject || "General STEM"} at level: ${level || "Detailed"} in language: ${language}: ${problem}` }
                ],
                max_tokens: 1500,
                temperature: 0.1 // Keep it deterministic
            },
            { headers: { Authorization: `Bearer ${apiToken}` } }
        );

        let generatedText = hfResponse.data.choices[0].message.content;
        console.log("AI Response Received. Length:", generatedText.length);

        // Clean up response: sometimes models wrap JSON in ```json ... ```
        let cleanJson = generatedText.trim();
        if (cleanJson.includes("```")) {
            const parts = cleanJson.split("```");
            cleanJson = parts.find(p => p.includes("{") && p.includes("}")) || cleanJson;
            if (cleanJson.startsWith("json")) {
                cleanJson = cleanJson.substring(4);
            }
        }

        try {
            const aiRes = JSON.parse(cleanJson);

            // Map to frontend SolveResult for compatibility
            res.json({
                success: true,
                ...aiRes,
                // Compatibility mapping
                problem_type: aiRes.subject,
                formula_used: aiRes.formula,
                final_values: [aiRes.final_answer],
                explanation: aiRes.concept_explanation,
                // Handle variable_explanation as formula_variables for the UI
                formula_variables: Array.isArray(aiRes.variable_explanation)
                    ? aiRes.variable_explanation
                    : [{ name: "Info", description: aiRes.variable_explanation, unit: "" }]
            });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError.message);
            console.log("Raw Response:", generatedText);
            throw new Error("Failed to parse AI response as JSON.");
        }

    } catch (err) {
        const errorData = err.response?.data;
        console.error("AI Error Detailed:", JSON.stringify(errorData, null, 2) || err.message);

        // Handle Hugging Face model loading (503)
        if (err.response?.status === 503 && errorData?.estimated_time) {
            return res.status(503).json({
                success: false,
                loading: true,
                estimated_time: errorData.estimated_time,
                error: `Hugging Face model is currently loading. Please try again in ${Math.ceil(errorData.estimated_time)} seconds.`
            });
        }

        res.status(500).json({
            success: false,
            error: "AI Solve failed. " + (errorData?.error || err.message)
        });
    }
});

app.listen(5000, "0.0.0.0", () => {
    console.log("STEM Engine: Hugging Face AI running (Standard Format)");
});
