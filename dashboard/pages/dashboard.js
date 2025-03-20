import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DiffViewer from 'react-diff-viewer';

export default function Home() {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/github-files')
      .then(response => response.json())
      .then(data => setFiles(data));
  }, []);

  return (
    <div className= "container mx-auto p-6" >
    <h1 className="text-3xl font-bold mb-4" > Peeragogy Peer Review Dashboard </h1>
      < p className = "text-lg mb-6" > Select a chapter to view and suggest improvements.</p>
        < ul className = "list-disc pl-6" >
        {
          files.map((file, index) => (
            <li key= { index } className = "mb-2" >
            <button 
              onClick={() => router.push(`/review?file=${encodeURIComponent(file)}`)}
  className = "text-blue-600 hover:underline" >
    { file }
    </button>
    </li>
        ))
}
</ul>
  < div className = "mt-8" >
    <Link href="/history" >
      <a className="text-blue-600 hover:underline" > View Revision History </a>
        </Link>
        </div>
        </div>
  );
}

// API endpoint to fetch revision history from GitHub JSON file
export async function getServerSidePropsHistory() {
  const res = await fetch('https://raw.githubusercontent.com/Peeragogy/peeragogy-handbook-test/main/revision-history.json');
  const history = await res.json();

  return {
    props: {
      history,
    },
  };
}

// Revision History Page with Approval and Rejection System
export function HistoryPage({ history }) {
  const approveRevision = async (file) => {
    await fetch('/api/update-revision-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, status: 'approved' })
    });
    alert(`Revision for ${file} approved!`);
  };

  const rejectRevision = async (file) => {
    await fetch('/api/update-revision-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, status: 'rejected' })
    });
    alert(`Revision for ${file} rejected!`);
  };

  return (
    <div className= "container mx-auto p-6" >
    <h1 className="text-3xl font-bold mb-4" > Revision History </h1>
      < ul className = "list-disc pl-6" >
      {
        history.map((entry, index) => (
          <li key= { index } className = "mb-2" >
          <strong>{ entry.file } </strong> - {entry.date} - {entry.status}
          < button onClick = {() => approveRevision(entry.file)} className = "ml-4 p-2 bg-green-500 text-white rounded" >✅ Approve </button>
            < button onClick = {() => rejectRevision(entry.file)
} className = "ml-2 p-2 bg-red-500 text-white rounded" >❌ Reject </button>
  </li>
        ))}
</ul>
  </div>
  );
}

// API to update revision status in JSON file on GitHub
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { file, status } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = 'Peeragogy';
    const repoName = 'peeragogy-handbook-test';
    const historyFilePath = 'revision-history.json';

    // Fetch current history file
    const historyRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${historyFilePath}`, {
      headers: { Authorization: `token ${githubToken}` }
    });
    const historyData = await historyRes.json();
    const historyContent = JSON.parse(Buffer.from(historyData.content, 'base64').toString('utf-8'));

    // Update the revision status
    const updatedHistory = historyContent.map(entry =>
      entry.file === file ? { ...entry, status } : entry
    );
    const updatedContent = Buffer.from(JSON.stringify(updatedHistory, null, 2)).toString('base64');

    // Commit updated history file
    await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${historyFilePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update revision status for ${file} to ${status}`,
        content: updatedContent,
        sha: historyData.sha
      })
    });

    res.status(200).json({ message: 'Revision status updated successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
