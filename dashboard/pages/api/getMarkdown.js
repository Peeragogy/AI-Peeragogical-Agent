import { readFile } from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: "Filename parameter is required" });
    }

    try {
        console.log(`📂 Fetching Markdown file: ${filename}`);

        // Percorso corretto
        const filePath = path.join(process.cwd(), "content", "en-md", filename);

        console.log(`🛠️ Checking file path: ${filePath}`);

        const markdownContent = await readFile(filePath, "utf-8");

        res.status(200).json({ content: markdownContent });
    } catch (error) {
        console.error("❌ [ERROR] Fetching Markdown:", error.message);
        res.status(500).json({ error: "Failed to fetch Markdown file", details: error.message });
    }
}
