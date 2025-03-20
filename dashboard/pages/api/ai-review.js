export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { text } = req.body;

    // Validate input: text must be a non-empty string
    if (!text || typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ error: "The 'text' parameter is required and must be a non-empty string." });
    }

    try {
        console.log("🔄 [INFO] Calling OpenAI API with the following text:", text);
        console.log("🔑 [DEBUG] API Key provided?", process.env.OPENAI_API_KEY ? "YES" : "NO");

        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                prompt: `Improve this chapter while keeping it true to the original text:\n\n${text}`,
                max_tokens: 300,
            }),
        });

        const responseText = await response.text();
        console.log("📝 [RAW RESPONSE] OpenAI API Response:", responseText);

        if (!response.ok) {
            console.error("❌ [ERROR] OpenAI API Error:", response.status, responseText);
            return res.status(response.status).json({
                error: "Failed to generate AI suggestions",
                status: response.status,
                details: responseText
            });
        }

        let aiData;
        try {
            aiData = JSON.parse(responseText);
            if (!aiData.choices || aiData.choices.length === 0) {
                throw new Error("Invalid AI response format");
            }
        } catch (jsonError) {
            console.error("❌ [ERROR] JSON Parsing Error:", jsonError, responseText);
            return res.status(500).json({
                error: "Failed to parse AI response",
                details: responseText
            });
        }

        console.log("✅ [SUCCESS] AI Suggestions Generated:", aiData.choices[0].text.trim());
        res.status(200).json({ suggestions: aiData.choices[0].text.trim() });

    } catch (error) {
        console.error("❌ [ERROR] AI Suggestion Generation Failed:", error.message);
        res.status(500).json({ error: "Failed to generate AI suggestions", details: error.message });
    }
}
