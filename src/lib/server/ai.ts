import { DEEPSEEK_API_KEY } from '$env/static/private';

export async function generateContent(prompt: string): Promise<string> {
    if (!DEEPSEEK_API_KEY) {
        throw new Error('Missing DEEPSEEK_API_KEY');
    }

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
        throw new Error(`AI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
