import React, { useEffect, useState } from "react";
import Link from "next/link";

const Sidebar = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch("/api/listMarkdown");
                const data = await response.json();
                setFiles(data.files);
            } catch (error) {
                console.error("❌ Error fetching Markdown file list:", error);
            }
        };

        fetchFiles();
    }, []);

    return (
        <nav className="sidebar">
            <h2>📖 Chapters</h2>
            <ul>
                {files.length > 0 ? (
                    files.map((file) => (
                        <li key={file}>
                            <Link href={`/viewer/[filename]`} as={`/viewer/${encodeURIComponent(file)}`}>
                                {file.replace(".md", "")}
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No Markdown files found.</p>
                )}
            </ul>
        </nav>
    );
};

export default S
