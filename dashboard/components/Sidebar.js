import React, { useEffect, useState } from "react";
import Link from "next/link";

console.log("👀 Sidebar ATTIVO!");

const Sidebar = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch("/api/listMarkdown");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFiles(data.files || []);
                setError(null);
            } catch (error) {
                console.error(
                    "❌ Errore nel caricamento della lista di file Markdown:",
                    error
                );
                setError(
                    "Errore nel caricamento della lista di file Markdown. Controlla la console per maggiori dettagli."
                );
                setFiles([]);
            }
        };

        fetchFiles();
    }, []);

    return (
        <aside
            style={{
                padding: "1rem",
                borderRight: "1px solid #ddd",
                width: "250px",
            }}
        >
            <h2>📖 Capitoli</h2>
            {error && (
                <div style={{ color: "red", marginBottom: "1rem" }}>
                    {error}
                </div>
            )}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {files.length > 0 ? (
                    files.map((file) => (
                        <li key={file} style={{ marginBottom: "0.5rem" }}>
                            <Link
                                href={`/viewer/${encodeURIComponent(file)}`}
                            >
                                <a>{file.replace(".md", "")}</a>
                            </Link>
                        </li>
                    ))
                ) : !error && (
                    <li>No files found.</li>
                )}
            </ul>
        </aside>
    );
};

export default Sidebar;
