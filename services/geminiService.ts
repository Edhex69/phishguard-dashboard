
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Ensure API_KEY is available in the environment.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        url: { type: Type.STRING },
        isPhishing: { type: Type.BOOLEAN },
        confidenceScore: { type: Type.NUMBER },
        analysisDetails: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    module: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    triggeredRules: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["module", "reason", "triggeredRules"]
            }
        },
        visualSimilarityScore: { type: Type.NUMBER },
        suggestedLegitimateSite: { type: Type.STRING },
    },
    required: ["url", "isPhishing", "confidenceScore", "analysisDetails", "visualSimilarityScore"]
};

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
    const prompt = `
        Act as the 'PhishGuard' cybersecurity analysis system.
        Analyze the following URL for phishing characteristics: ${url}

        Perform a multi-layered analysis:
        1.  **Heuristic Analysis:** Check for typosquatting, combosquatting, homoglyphs, suspicious keywords ('login', 'secure', 'update'), URL shorteners, and IP addresses as domains.
        2.  **Content Analysis:** Hypothesize the content. Would it have suspicious forms, iframes, or obfuscated JavaScript?
        3.  **Visual Similarity:** Estimate a visual similarity score to a known legitimate site if applicable.

        Based on your analysis, provide a JSON response conforming to the specified schema.
        - If it is phishing, set 'isPhishing' to true and provide a high confidence score (e.g., > 0.8). Detail the reasons in 'analysisDetails'.
        - If it is safe, set 'isPhishing' to false and provide a low confidence score (e.g., < 0.1).
        - If you identify a typosquatted domain, provide the likely legitimate site in 'suggestedLegitimateSite'. For example, if the URL is 'microsft-login.com', suggest 'microsoft.com'.
        - Be creative and realistic in your analysis, simulating a real detection engine.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Add a timestamp and unique ID to the result
        const result: AnalysisResult = {
            ...parsedJson,
            id: new Date().getTime().toString(),
            timestamp: new Date().toISOString()
        };

        return result;

    } catch (error) {
        console.error("Error analyzing URL with Gemini API:", error);
        // Provide a more user-friendly error message
        if (error instanceof Error && error.message.includes('json')) {
             throw new Error("Failed to get a valid analysis from the AI. It may have returned an unexpected format. Please try again.");
        }
        throw new Error("Failed to analyze URL. The AI service may be temporarily unavailable.");
    }
};