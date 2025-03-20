import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MarkdownViewer from "../../components/MarkdownViewer";

export default function ViewerPage() {
    const router = useRouter();
    const { filename } = router.query;
    const [content, setContent] = useState("Loading...");

    useEffect(() => {
        if (!filename) return;

        const fetchMarkdown = async () => {
            try {
                const response = await fetch(`/api/getMarkdown?filename=${filename}`);
                if (!response.ok) throw new Error("Failed to load file");
                const data = await response.json();
                setContent(data.content);
            } catch (error) {
                console.error("❌ Error loading markdown:", error);
                setContent("Error loading file.");
            }
        };

        fetchMarkdown();
    }, [filename]);

    return (
        <div>
            <h1>{filename ? filename.replace(".md", "") : "Loading..."}</h1>
            <MarkdownViewer content={content} />
        </div>
    );
}
