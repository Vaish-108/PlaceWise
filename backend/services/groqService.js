const { Groq } = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};

async function generateResponse(prompt) {
  try {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string");
    }

    const client = getGroqClient();

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq response generation failed:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
