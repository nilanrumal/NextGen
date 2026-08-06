export async function getChatBotResponse(
  messages: { text: string; type: 'user' | 'bot' | 'agent' }[],
  siteConfig: any
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, siteConfig }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I am having trouble connecting.";
  } catch (error) {
    console.error("Gemini service client error:", error);
    return "I apologize, our AI service is currently unavailable. Please try again later or contact us directly.";
  }
}
