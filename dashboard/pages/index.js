import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DiffViewer from 'react-diff-viewer';

export default function Home() {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/github-files')
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch files");
        return response.json();
      })
      .then(data => setFiles(data))
      .catch(error => console.error("Error fetching files:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Peeragogy Peer Review Dashboard</h1>
      <p className="text-lg mb-6">Select a chapter to view and suggest improvements.</p>
      <ul className="list-disc pl-6">
        {files.map((file, index) => (
          <li key={index} className="mb-2">
            <button 
              onClick={() => router.push(`/review?file=${encodeURIComponent(file)}`)}
              className="text-blue-600 hover:underline"
            >
              {file}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/history" legacyBehavior>
          <a className="text-blue-600 hover:underline">View Revision History</a>
        </Link>
      </div>
    </div>
  );
}

// API endpoint to fetch revision history from GitHub JSON file
export async function getServerSidePropsHistory() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Peeragogy/peeragogy-handbook-test/main/revision-history.json');
    if (!res.ok) throw new Error("Failed to fetch revision history");
    
    const history = await res.json();
    return { props: { history } };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { props: { history: [] } }; // Evita crash restituendo un array vuoto
  }
}

// Revision History Page with Approval and Rejection System
export function HistoryPage({ history }) {
  const approveRevision = async (file) => {
    try {
      await fetch('/api/update-revision-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, status: 'approved' })
      });
      alert(`Revision for ${file} approved!`);
    } catch (error) {
      alert("Error approving revision.");
      console.error(error);
    }
  };

  const rejectRevision = async (file) => {
    try {
      await fetch('/api/update-revision-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, status: 'rejected' })
      });
      alert(`Revision for ${file} rejected!`);
    } catch (error) {
      alert("Error rejecting revision.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Revision History</h1>
      <ul className="list-disc pl-6">
        {history.map((entry, index) => (
          <li key={index} className="mb-2">
            <strong>{entry.file}</strong> - {entry.date} - {entry.status}
            <button onClick={() => approveRevision(entry.file)} className="ml-4 p-2 bg-green-500 text-white rounded">
              ✅ Approve
            </button>
            <button onClick={() => rejectRevision(entry.file)} className="ml-2 p-2 bg-red-500 text-white rounded">
              ❌ Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

