import { readdir } from "fs/promises";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        const folderPath = path.join(process.cwd(), "content", "en-md");

        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ error: "Directory not found", files: [] });
        }

        const files = await readdir(folderPath);
        const markdownFiles = files.filter((file) => file.endsWith(".md"));
        res.status(200).json({ files: markdownFiles });
    } catch (error) {
        console.error("❌ listMarkdown error:", error);
        res.status(500).json({ error: "Server error", files: [] });
    }
}
