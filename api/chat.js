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
            ? `Eres un Scout Experto de la industria nupcial de ALTO NIVEL. 
               Tu misión es encontrar proveedores REALES y PROFESIONALES.
               REGLAS PARA EL JSON:
               1. No sugieras "DIY", "Hacerlo tú mismo" o "Google Maps" como nombre de proveedor.
               2. Busca nombres de floristas, caterings o fotógrafos reales (o tipos de establecimientos profesionales).
               3. Los "tips" deben ser consejos expertos sobre contratos, estilos o logística (ej: "Asegura el transporte climatizado para las peonías").
               4. "whereToLook" debe ser una plataforma específica del sector (Bodas.net, Instagram tags, Zankyou, etc.).
               5. Responde ÚNICAMENTE con un objeto JSON con el array "results".`
            : `Eres un Wedding Planner AI de lujo, profesional y detallista. Ayuda a la pareja con elegancia y conocimiento técnico del sector.
               CONTEXTO: ${JSON.stringify(context)}
               REGLAS:
               1. Sé impecable, cálido y experto. Usa emojis elegantes.
               2. Usa EXCLUSIVAMENTE HTML (<b>, <ul>, <li>, <br>).
               3. NO USES MARKDOWN.
               4. Los consejos deben ser proactivos (ej: hablar de 'timmings', 'lighting', contratos).`;

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
