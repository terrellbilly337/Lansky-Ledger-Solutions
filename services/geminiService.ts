
import { GoogleGenAI } from "@google/genai";

// getBusinessAdvice analyzes business data and provides strategic insights.
// Upgraded to gemini-3-pro-preview for advanced reasoning on financial data.
export const getBusinessAdvice = async (dataSummary: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: `You are a world-class e-commerce and reselling business advisor. 
      Analyze the following business financial summary and provide 3-5 high-impact, actionable insights 
      to increase profit margins and efficiency. Use a professional yet encouraging tone.
      
      Business Data Summary:
      ${dataSummary}
      
      Format the response in clear Markdown with bold headers.`,
    });

    return response.text || "I couldn't generate advice at this moment. Please try again with more data.";
  } catch (error) {
    console.error("Error getting business advice:", error);
    return "An error occurred while contacting the AI Advisor. Ensure your data is populated and try again.";
  }
};

// editImageWithGemini enhances product photos based on user prompts.
// Uses gemini-2.5-flash-image as specified in the ImageEditor component.
export const editImageWithGemini = async (image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract base64 data and mime type from the data URL
    const base64Data = image.split(',')[1] || image;
    const mimeTypeMatch = image.match(/^data:([^;]+);/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    // Iterate through response parts to find the generated image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const encodedData = part.inlineData.data;
          const outputMime = part.inlineData.mimeType;
          return `data:${outputMime};base64,${encodedData}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};
