import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        // Percorso corretto della cartella Markdown
        const folderPath = path.join(process.cwd(), "content", "en-md"); // Rimosso il doppio "dashboard"

        console.log(`📂 Checking folder path: ${folderPath}`);

        if (!fs.existsSync(folderPath)) {
            console.error(`❌ [ERROR] Directory not found: ${folderPath}`);
            return res.status(404).json({ error: `Directory not found: ${folderPath}`, files: [] });
        }

        const files = await readdir(folderPath);
        const markdownFiles = files.filter(file => file.endsWith(".md"));

        console.log("📁 Available Markdown Files:", markdownFiles);

        res.status(200).json({ files: markdownFiles });
    } catch (error) {
        console.error("❌ [ERROR] Listing Markdown files:", error.message);
        res.status(500).json({ error: "Failed to list Markdown files", files: [] });
    }
}
