
import { GoogleGenAI, Type } from "@google/genai";

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// It is assumed to be pre-configured and available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateArticleSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A catchy and SEO-friendly title for the blog post.' },
    content: { type: Type.STRING, description: 'The full content of the blog post, written in engaging and well-structured markdown format. It should be at least 500 words.' },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of 3-5 relevant SEO keywords for the article.'
    },
    meta_description: { type: Type.STRING, description: 'A concise and compelling meta description for SEO purposes, under 160 characters.' }
  },
  required: ['title', 'content', 'keywords', 'meta_description'],
};

export const generateArticle = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a comprehensive, well-structured, and engaging blog post about "${topic}". The tone should be informative and professional. The output must be in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: generateArticleSchema,
      },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Error generating article:", error);
    throw new Error("Failed to generate article. Please check the topic or API key.");
  }
};

export const generateSeoSuggestions = async (articleContent: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following article content, generate SEO suggestions.
            
            Article: "${articleContent.substring(0, 4000)}"
            
            Provide an SEO-optimized title (max 60 characters), a meta description (max 160 characters), and an array of 5 relevant keywords. Return the response as a JSON object with keys "seoTitle", "metaDescription", and "keywords".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        seoTitle: { type: Type.STRING },
                        metaDescription: { type: Type.STRING },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['seoTitle', 'metaDescription', 'keywords']
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating SEO suggestions:", error);
        throw new Error("Failed to generate SEO suggestions.");
    }
};

export const generateImageFromPrompt = async (prompt: string) => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A vibrant and artistic blog post thumbnail for an article about: "${prompt}". Digital art style, eye-catching, no text.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("No image was generated.");
        }

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image thumbnail.");
    }
};

export const generateSummary = async (content: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Summarize the following article content into 2-3 key bullet points. Keep it concise and easy to read.
            
            Article: "${content.substring(0, 4000)}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary.");
    }
};

export const generatePostFromTranscript = async (transcript: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert content creator. The user will provide a raw transcript from a YouTube video. Your task is to do the following:
1. Read and understand the entire transcript.
2. Create a concise summary of the key points and main ideas.
3. Translate this summary accurately into Tamil.
4. Format the final output as a complete blog post using Markdown.
5. The blog post must have a compelling title in both English and Tamil, like this: 'English Title | தமிழ் தலைப்பு'.
6. The body of the post should contain the English summary first, followed by the Tamil translation. Use clear headings for each section (e.g., ### English Summary, ### தமிழ் சுருக்கம்).
7. The tone should be informative and engaging for a blog reader.

Here is the transcript:
---
${transcript.substring(0, 8000)}
---
`,
        });
        
        // Let's assume the AI gives the title on the first line and content after.
        const fullText = response.text;
        const firstLineBreak = fullText.indexOf('\n');
        const title = fullText.substring(0, firstLineBreak).replace(/^#+\s*/, '').trim();
        const content = fullText.substring(firstLineBreak + 1).trim();

        return { title, content };

    } catch (error) {
        console.error("Error processing transcript:", error);
        throw new Error("Failed to generate blog post from transcript.");
    }
}