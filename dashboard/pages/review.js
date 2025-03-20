import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReviewPage() {
    const router = useRouter();
    const { file } = router.query;
    const [content, setContent] = useState("");
    const [aiSuggestions, setAiSuggestions] = useState("");
    const [votes, setVotes] = useState(0);

    useEffect(() => {
        if (file) {
            fetch(`/api/get-file?file=${file}`)
                .then(response => response.json())
                .then(data => setContent(data.content))
                .catch(error => console.error("Error fetching file content:", error));
        }
    }, [file]);

    const handleAISuggestions = async () => {
        try {
            const response = await fetch('/api/ai-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });

            const responseText = await response.text(); // Legge il testo della risposta
            console.log("AI API Response:", responseText);

            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status} - ${responseText}`);
            }

            const data = JSON.parse(responseText); // Ora convertiamo in JSON
            setAiSuggestions(data.suggestions);
        } catch (error) {
            console.error("Error fetching AI suggestions:", error.message);
            setAiSuggestions("Failed to generate AI suggestions.");
        }
    };

    const voteUp = () => setVotes(votes + 1);
    const voteDown = () => setVotes(votes - 1);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Reviewing: {file}</h1>
            <textarea
                className="w-full h-96 p-4 border rounded-lg"
                value={content}
                readOnly
            />
            <button
                onClick={handleAISuggestions}
                className="mt-4 p-2 bg-green-600 text-white rounded"
            >
                🤖 Get AI Suggestions
            </button>
            {aiSuggestions && (
                <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
                    <h2 className="text-xl font-semibold">AI Suggestions:</h2>
                    <p>{aiSuggestions}</p>
                    <div className="mt-4 flex items-center">
                        <button onClick={voteUp} className="mr-4 p-2 bg-green-500 text-white rounded">👍 {votes}</button>
                        <button onClick={voteDown} className="p-2 bg-red-500 text-white rounded">👎</button>
                    </div>
                </div>
            )}
        </div>
    );
}
