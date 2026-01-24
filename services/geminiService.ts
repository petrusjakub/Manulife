import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// 🔑 API KEY dari Vite define (AMAN UNTUK BUILD)
const apiKey = typeof __GEMINI_API_KEY__ !== "undefined"
  ? __GEMINI_API_KEY__
  : "";

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

// System instruction
const SYSTEM_INSTRUCTION = `
You are "Manu", the intelligent virtual assistant for Manulife Indonesia,
assisting agent Susana.

(isi instruction kamu TETAP, tidak perlu diubah)
`;

let chatSession: Chat | null = null;

export const initChat = (): void => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
};

export const sendMessageToGemini = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key tidak ditemukan. Silakan hubungi admin.";
  }

  try {
    if (!chatSession) initChat();
    if (!chatSession) throw new Error("Chat session gagal dibuat");

    const result = await chatSession.sendMessageStream({ message });

    let fullText = "";
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
        onChunk(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, sistem sedang sibuk. Silakan coba lagi.";
  }
};e
