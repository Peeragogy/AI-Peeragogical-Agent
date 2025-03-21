const { text } = req.body;

if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' in request body" });
}

try {
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Migliora il seguente capitolo Markdown mantenendo il significato:\n\n${text}`,
            max_tokens: 300,
            temperature: 0.7
        }),
    });

    const aiData = await response.json();

    if (!response.ok || !aiData.choices || !aiData.choices.length) {
        throw new Error(JSON.stringify(aiData));
    }

    res.status(200).json({ suggestions: aiData.choices[0].text.trim() });
} catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ error: "AI suggestion failed", details: error.message });
}