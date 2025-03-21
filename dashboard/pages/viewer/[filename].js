import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MarkdownViewer from "../../components/MarkdownViewer";

export default function ViewerPage() {
    const router = useRouter();
    const { filename } = router.query;
    const [content, setContent] = useState("Loading...");

    useEffect(() => {
        if (!filename) return;
        const fetchMarkdown = async () => {
            try {
                const res = await fetch(`/api/getMarkdown?filename=${filename}`);
                const data = await res.json();
                setContent(data.content);
            } catch (err) {
                console.error("❌ Failed to load markdown:", err);
                setContent("Errore nel caricamento del file.");
            }
        };
        fetchMarkdown();
    }, [filename]);

    return (
        <div style={{ padding: "1rem", flex: 1 }}>
            <h1>{filename?.replace(".md", "")}</h1>
            <MarkdownViewer content={content} />
        </div>
    );
}
