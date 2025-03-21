const handleAISuggestions = async () => {
    try {
        const response = await fetch("/api/ai-review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: content })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Errore AI");
        }

        setAiSuggestions(data.suggestions);
    } catch (error) {
        console.error("Errore:", error.message);
        setAiSuggestions("Errore nel generare i suggerimenti.");
    }
};
