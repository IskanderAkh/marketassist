import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.proxyapi.ru/openai/v1",
});

export const chatWithGPT = async (req, res) => {
    const { message } = req.body;
    console.log(message); // Ensure the message is being received

    try {
        const prompt = `Вы профессиональный маркетолог. Ответьте на следующий запрос с экспертным мнением и маркетингово-ориентированной точкой зрения: ${message}`;
        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }], // Use the "message" from the request body
            max_tokens: 1000,
        });

        res.json({ reply: aiResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error); // Log the actual error to debug
        res.status(500).json({ error: 'Error with OpenAI API' });
    }
};
