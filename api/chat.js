const { GoogleGenerativeAI } = require('@google/generative-ai');

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
        const { message, context } = req.body;

        // Gemini Config
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const isJson = req.body.format === 'json';

        const systemPrompt = isJson
            ? `Eres un experto buscador de proveedores. Responde ÚNICAMENTE con un objeto JSON válido. No incluyas explicaciones fuera del JSON.`
            : `
    Eres un Wedding Planner AI profesional, empático y experto.
    Tu objetivo es ayudar a la pareja a organizar su boda perfecta.
    
    CONTEXTO DE LA BODA ACTUAL:
    ${JSON.stringify(context, null, 2)}
    
    INSTRUCCIONES:
    1. Sé breve, amable y directo. Usa emojis.
    2. Usa EXCLUSIVAMENTE HTML para el formato (<b>, <ul>, <li>, <br>).
    3. NO uses Markdown (evita asteriscos, almohadillas o triples comillas).
    4. Si te preguntan por datos, usa el CONTEXTO proporcionado.
    5. Responde directamente al grano.
    `;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Entendido. Soy vuestro Wedding Planner virtual. ¿En qué puedo ayudaros?" }] },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.status(200).json({ response });

    } catch (error) {
        console.error('Vercel API Error Full:', error);
        const apiKeyStatus = process.env.GEMINI_API_KEY ? `Present(Length: ${process.env.GEMINI_API_KEY.length})` : 'Missing';

        res.status(500).json({
            response: `Lo siento, tuve un problema al conectar con la IA. 
            < br ><small><b>Debug Error:</b> ${error.message}</small>
            <br><small><b>Key Status:</b> ${apiKeyStatus}</small>`
        });
    }
};
