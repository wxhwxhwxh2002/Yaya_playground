import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateGameAssets(themeDescription: string): Promise<{
  bugUrl: string;
  fruitUrl: string;
  bgUrl: string;
}> {
  
  // 1. First, use Thinking Model to brainstorm the visual style
  // This satisfies the "Thinking" requirement to handle complex queries (in this case, complex creative direction)
  const thinkingResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Design a cohesive visual theme for a web game for birds based on this concept: "${themeDescription}".
    Describe three images to generate:
    1. A "bug" or target character.
    2. A "fruit" or collectible item.
    3. A background texture.
    
    The visuals should be high contrast and appealing to corvids (shiny, colorful).
    Return ONLY a JSON object with keys: bugPrompt, fruitPrompt, bgPrompt.`,
    config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 } // Using thinking budget as requested
    }
  });

  let prompts;
  try {
      prompts = JSON.parse(thinkingResponse.text || "{}");
  } catch (e) {
      console.error("Failed to parse thinking response", e);
      prompts = {
          bugPrompt: "A shiny golden beetle, high contrast, vector art style, white background",
          fruitPrompt: "A bright red cherry with a green leaf, glossy, vector art style, white background",
          bgPrompt: "A forest floor with leaves and pebbles, slightly blurred, top down view"
      };
  }

  // 2. Generate the images using Nano Banana Pro (gemini-3-pro-image-preview)
  // We run these in parallel for speed
  const [bugRes, fruitRes, bgRes] = await Promise.all([
    generateSingleImage(prompts.bugPrompt, "1K"),
    generateSingleImage(prompts.fruitPrompt, "1K"),
    generateSingleImage(prompts.bgPrompt, "2K") // Higher res for BG
  ]);

  return {
    bugUrl: bugRes,
    fruitUrl: fruitRes,
    bgUrl: bgRes
  };
}

async function generateSingleImage(prompt: string, size: "1K" | "2K" | "4K"): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    imageSize: size,
                    aspectRatio: size === "2K" ? "16:9" : "1:1"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found");
    } catch (error) {
        console.error("Image generation failed:", error);
        return "https://placehold.co/512x512/png?text=Error";
    }
}