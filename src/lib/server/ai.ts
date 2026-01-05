import * as dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function generateContent(prompt: string): Promise<string> {
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
        const errorMessage = 'Invalid/Missing environment variable: "DEEPSEEK_API_KEY". Please ensure it is set to a valid key in your .env file.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`AI service request failed with status ${response.status}:`, errorBody);
            throw new Error(`AI service request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI API Error:', error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`AI API Error: ${message}`);
    }
}

export async function generateExpansion(prompt: string, existingWords: string[]): Promise<string> {
    const aiPrompt = `
Generate exactly 2 new English words related to the scenario: "${prompt}".
These words MUST NOT be any of the following: ${existingWords.join(', ')}.
Output strictly valid JSON with the following structure:
{
  "words": [
    {
      "word": "english word",
      "phonetics": "IPA",
      "definition": "english definition",
      "definition_cn": "中文意思",
      "examples": [
        { "en": "example sentence 1", "cn": "chinese translation" },
        { "en": "example sentence 2", "cn": "chinese translation" }
      ]
    }
  ]
}
Each word should have exactly 2 examples.
`;
    return generateContent(aiPrompt);
}
