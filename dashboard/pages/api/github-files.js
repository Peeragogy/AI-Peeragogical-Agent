let cache = { files: null, timestamp: 0 }; // Cache locale per ridurre chiamate API

export default async function handler(req, res) {
    try {
        console.log("🔄 Fetching Markdown files from GitHub...");

        const CACHE_DURATION = 60 * 5 * 1000; // Cache per 5 minuti

        // Se i file sono già in cache e non sono scaduti, restituiamoli direttamente
        if (cache.files && (Date.now() - cache.timestamp < CACHE_DURATION)) {
            console.log("✅ [CACHE] Returning cached file list");
            return res.status(200).json(cache.files);
        }

        // URL della cartella `en-md` nel repository Peeragogy Handbook
        const GITHUB_API_URL = "https://api.github.com/repos/Peeragogy/peeragogy-handbook/contents/en-md";

        // Usa un token API se disponibile per evitare rate limits
        const headers = process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {};

        // Fetch dei file da GitHub
        const response = await fetch(GITHUB_API_URL, { headers });

        // Controllo della risposta API
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Filtrare solo i file Markdown (.md)
        const files = data
            .filter(file => file.name.endsWith('.md'))
            .map(file => file.name);

        console.log("✅ Successfully fetched files:", files);

        // Salvare i file in cache
        cache = { files, timestamp: Date.now() };

        res.status(200).json(files);
    } catch (error) {
        console.error("❌ Error fetching files:", error.message);
        res.status(500).json({ error: "Failed to fetch data from GitHub" });
    }
}
