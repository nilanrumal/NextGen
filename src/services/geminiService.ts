import { GoogleGenAI } from "@google/genai";

// Standard Vite environment variable access
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getChatBotResponse(messages: { text: string, type: 'user' | 'bot' | 'agent' }[], siteConfig: any) {
  const model = "gemini-3-flash-preview";
  
  if (!ai) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined.");
    return "I apologize, our AI assistant is not properly configured. Please contact support or use the hotline.";
  }

  const systemInstruction = `
    You are an AI Assistant for "NextGen Consultants & Doctors Pvt Ltd".
    Company Info:
    - Address: No. 185, Ebert Lane, Kaldemulla, Moratuwa. 10400
    - Hotline: +94 77 338 6064
    - Email: ceo@consultantsdoctors.com
    - Services: Accounting, Tax Consulting, Internal Auditing, Company Secretarial Services, Management Consultancy, Preparation of Project Proposals.
    - Style: Professional, friendly, and expert.
    - Knowledge: ${siteConfig?.knowledgeBase || 'We are a leading financial consultancy in Sri Lanka.'}
    
    CRITICAL: 
    - If the user explicitly asks to speak with a human, a real person, or an agent, or if you cannot answer a complex query after 2-3 attempts, you MUST output exactly: "[HANDOVER_REQUESTED]" followed by a reassuring message that a human agent is being notified.
    - Do not make up prices. For rates, ask them to leave their contact details or speak to an agent.
  `;

  const contents = messages.map(m => ({
    role: m.type === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm sorry, I am having trouble connecting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, our AI service is currently unavailable. Please try again later or contact us directly.";
  }
}
