const { GoogleGenerativeAI } = require("@google/generative-ai");

let generativeAI = null;
let model = null;

const getModel = () => {
  if (!generativeAI) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Gemini service error: GEMINI_API_KEY is not configured.");
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    generativeAI = new GoogleGenerativeAI(apiKey);
  }

  if (!model) {
    model = generativeAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  return model;
};

async function generateResponse(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("A non-empty prompt string is required.");
  }

  try {
    const geminiModel = getModel();
    console.log(
      "Gemini service: generateContent called, prompt length",
      prompt.length
    );

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response?.text?.();

    console.log(
      "Gemini service: generateContent completed, response text length",
      responseText ? responseText.length : 0
    );

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    return responseText;
  } catch (error) {
    const message = error?.message || "Failed to generate a response from Gemini.";
    console.error("Gemini service error:", message);
    throw new Error(`Gemini service error: ${message}`);
  }
}

module.exports = {
  generateResponse,
};
