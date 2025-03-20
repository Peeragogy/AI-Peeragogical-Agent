import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [files, setFiles] = useState([]); // Impostiamo un array vuoto come valore iniziale
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per gestire errori

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/listMarkdown");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.files || !Array.isArray(data.files)) {
          throw new Error("Invalid response format");
        }

        setFiles(data.files);
      } catch (error) {
        console.error("❌ Error fetching Markdown file list:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1>📖 Peeragogy Handbook</h1>

      {loading && <p>Loading files...</p>}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {!loading && !error && (
        <ul>
          {files.length > 0 ? (
            files.map((file) => (
              <li key={file}>
                <Link href={`/viewer?filename=${file}`}>
                  {file.replace(".md", "")}
                </Link>
              </li>
            ))
          ) : (
            <p>No Markdown files found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
