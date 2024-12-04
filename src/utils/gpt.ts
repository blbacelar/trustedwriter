import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config({ path: ".env.local" });

const api_key = process.env.API_KEY || "";
const openai = new OpenAI({
  apiKey: api_key,
});

export async function queryGPT(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3000,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
