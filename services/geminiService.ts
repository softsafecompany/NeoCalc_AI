
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveMathProblem = async (query: string, imageBase64?: string): Promise<AIResponse> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: imageBase64 ? [
      {
        parts: [
          { inlineData: { mimeType: 'image/png', data: imageBase64 } },
          { text: `Solve this math problem. If it's a function, provide points for a graph. Query: ${query}` }
        ]
      }
    ] : query,
    config: {
      systemInstruction: `You are NeoCalc, an elite AI mathematician. 
      Analyze the input (text or image) and solve the problem.
      Provide:
      1. A clear, concise final answer.
      2. Logical step-by-step breakdown.
      3. A brief intuitive explanation.
      4. If the query involves a function (e.g., y = x^2), provide 10-20 data points for plotting.
      
      Always return valid JSON matching the schema provided.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          steps: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          explanation: { type: Type.STRING },
          graphableData: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              points: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER }
                  },
                  required: ["x", "y"]
                }
              }
            }
          }
        },
        required: ["answer", "steps", "explanation"]
      }
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}') as AIResponse;
};
