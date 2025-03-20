export default async function handler(req, res) {
    try {
        console.log("Fetching files from GitHub...");

        // URL corretto della cartella `en-md` nella repository ufficiale
        const response = await fetch('https://api.github.com/repos/Peeragogy/peeragogy-handbook/contents/en-md');

        // Controlliamo se la risposta è valida
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Estrarre solo i nomi dei file Markdown (.md)
        const files = data.filter(file => file.name.endsWith('.md')).map(file => file.name);

        console.log("Fetched files:", files);

        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching files:", error.message);
        res.status(500).json({ error: "Failed to fetch data from GitHub" });
    }
}

