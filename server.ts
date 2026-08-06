import dotenv from 'dotenv';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    transports: ['websocket']
  });

  const PORT = 3000;

  // Secure API endpoint for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, siteConfig } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("CRITICAL: GEMINI_API_KEY is not defined in the server environment.");
        return res.json({ 
          text: "I apologize, our AI assistant is not properly configured. Please contact support or use the hotline." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

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

      const contents = messages.map((m: any) => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const model = "gemini-3.5-flash";

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        }
      });

      const responseText = response.text || "I'm sorry, I am having trouble connecting.";
      return res.json({ text: responseText });
    } catch (error) {
      console.error("Gemini server error:", error);
      return res.status(500).json({ 
        error: "I apologize, our AI service is currently unavailable. Please try again later or contact us directly." 
      });
    }
  });

  // Real-time notifications for handover
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_admin", () => {
      socket.join("admin_room");
      console.log("Admin joined admin_room");
    });

    socket.on("handover_request", (data) => {
      // Broadcast to admins for sound notification
      io.to("admin_room").emit("notify_handover", data);
    });

    socket.on("agent_join", (data) => {
      // Notify user that agent joined
      io.emit("agent_joined_chat", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
