import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateChatResponse(
  question: string,
  context: string[]
): Promise<string> {
  const contextText = context.join("\n\n");
  
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are an analytics assistant. Answer questions about website analytics based on the provided event data. Be concise and cite specific data points.`,
      },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response.choices[0].message.content || "I couldn't generate a response.";
}

export { openai };
