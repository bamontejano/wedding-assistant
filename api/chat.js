const Groq = require('groq-sdk');

module.exports = async (req, res) => {
    // CORS initialization for Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, context, format } = req.body;
        const isJson = format === 'json';

        // Groq Config
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const systemPrompt = isJson
            ? `Eres un experto buscador de proveedores de bodas. Responde ÚNICAMENTE con un objeto JSON válido que contenga un array "results". Cada objeto debe tener: "name", "priceRange", "description", "tips" (array de 2 strings), "whereToLook". No incluyas explicaciones fuera del JSON.`
            : `Eres un Wedding Planner AI profesional, empático y experto. Ayuda a la pareja a organizar su boda.
               CONTEXTO: ${JSON.stringify(context)}
               REGLAS:
               1. Sé breve y amable. Usa emojis.
               2. Usa EXCLUSIVAMENTE HTML básicos (<b>, <ul>, <li>, <br>).
               3. NO USES MARKDOWN (evita **, #, \`\`\`).
               4. Responde en español.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            response_format: isJson ? { type: "json_object" } : undefined,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        res.status(200).json({ response: responseText });

    } catch (error) {
        console.error('Groq API Error:', error);
        const apiKeyStatus = process.env.GROQ_API_KEY ? `Present(Len: ${process.env.GROQ_API_KEY.length})` : 'Missing';

        res.status(500).json({
            response: `Lo siento, hubo un error con Groq. 
            <br><small><b>Debug:</b> ${error.message}</small>
            <br><small><b>Key:</b> ${apiKeyStatus}</small>`
        });
    }
};
