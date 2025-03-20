export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text parameter is required" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                prompt: `Migliora questo capitolo mantenendolo fedele al testo originale:\n\n${text}`,
                max_tokens: 300,
            }),
        });

        const responseText = await response.text();
        console.log("RAW AI API RESPONSE:", responseText);

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.status} - ${responseText}`);
        }

        const aiData = JSON.parse(responseText);
        if (!aiData.choices || aiData.choices.length === 0) {
            throw new Error("Invalid AI response format");
        }

        res.status(200).json({ suggestions: aiData.choices[0].text.trim() });
    } catch (error) {
        console.error("Error fetching AI suggestions:", error.message);
        res.status(500).json({ error: "Failed to generate AI suggestions", details: error.message });
    }
}
