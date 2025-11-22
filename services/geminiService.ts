
import { GoogleGenAI } from "@google/genai";
import { GeneratedFrame } from "../types";

// Helper to strip the data URL prefix for the API call
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

/**
 * Generates a sequence of frames based on a source character and a prompt.
 */
export const generateAnimationFrames = async (
  apiKey: string,
  sourceImage: string, // Base64 Data URL
  prompt: string,
  count: number
): Promise<GeneratedFrame[]> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = 'gemini-2.5-flash-image'; 

  const frames: GeneratedFrame[] = [];
  const base64Data = cleanBase64(sourceImage);
  const mimeType = sourceImage.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/png';
  
  // Use a random seed for the batch to encourage style consistency across frames
  const batchSeed = Math.floor(Math.random() * 1000000);

  try {
    // Function to generate a single frame
    const generateFramePromise = async (index: number) => {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: `You are a strict sprite sheet animator. 
              
              TASK: Generate Frame ${index + 1} of a ${count}-frame animation for the character provided.
              ACTION: ${prompt}.

              CRITICAL CONSISTENCY RULES (MUST FOLLOW):
              1. **IDENTITY LOCK**: The output character MUST be identical to the source image. Keep the exact same eyes, ears, colors, and body proportions. Do NOT redesign the character.
              2. **BACKGROUND**: The background MUST be pure solid WHITE (#FFFFFF). No transparency, no patterns, no shadows.
              3. **SCALE**: The character must be the EXACT SAME SIZE as the original. Do not zoom in or out.
              4. **STYLE**: Keep the original flat 2D art style. No 3D shading, no realistic lighting.

              Output ONLY the character on a white background.`,
            },
          ],
        },
        config: {
          // @ts-ignore - Seed is supported in beta/preview models often, helpful for consistency
          seed: batchSeed,
          temperature: 0.2, // Low temperature for more deterministic/consistent results
        }
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) throw new Error("No content returned");

      let imageBase64 = null;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }

      if (!imageBase64) {
         throw new Error("Model did not return an image.");
      }

      return {
        id: `frame-${Date.now()}-${index}`,
        dataUrl: `data:image/png;base64,${imageBase64}`
      };
    };

    // Generate frames sequentially to avoid rate limits and ensure order
    for (let i = 0; i < count; i++) {
      // Add a small delay between requests if needed, but sequential await is usually enough
      const frame = await generateFramePromise(i);
      frames.push(frame);
    }

    return frames;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
