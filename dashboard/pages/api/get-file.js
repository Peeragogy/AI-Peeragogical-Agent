export default async function handler(req, res) {
    const { file } = req.query;

    if (!file) {
        return res.status(400).json({ error: "File parameter is required" });
    }

    try {
        const response = await fetch(`https://raw.githubusercontent.com/Peeragogy/peeragogy-handbook/master/en-md/${file}`);

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();
        res.status(200).json({ content }); // ✅ Restituisci direttamente il testo normale
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({ error: "Failed to fetch file content from GitHub" }); // ✅ Restituisci un messaggio di errore valido
    }
}
