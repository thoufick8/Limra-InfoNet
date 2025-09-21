

import React, { useState } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { generatePostFromTranscript } from '../../services/geminiService';
import Spinner from '../../components/Spinner';
import { Sparkles, AlertTriangle, DownloadCloud } from 'lucide-react';

const YouTubeTool = () => {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
    const [isGeneratingPost, setIsGeneratingPost] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const navigate = ReactRouterDOM.useNavigate();

    const extractVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleFetchTranscript = async () => {
        if (!youtubeLink.trim()) {
            setFetchError('Please paste a YouTube link first.');
            return;
        }
        setIsFetchingTranscript(true);
        setFetchError(null);
        setTranscript('');

        const videoId = extractVideoId(youtubeLink);

        if (!videoId) {
            setFetchError('Invalid YouTube URL. Please check the link and try again.');
            setIsFetchingTranscript(false);
            return;
        }

        try {
            // Switched to a different CORS proxy for better reliability
            const response = await fetch('https://cors.sh/https://www.youtube-transcript.io/api/transcripts', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic 68cab8b990fe42b50845f80d',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: [videoId] }),
            });

            if (!response.ok) {
                throw new Error(`API request failed. This video might not have a transcript available.`);
            }

            const data = await response.json();
            
            if (data.transcripts && data.transcripts[0] && data.transcripts[0].status === 'completed' && data.transcripts[0].transcript) {
                const transcriptText = data.transcripts[0].transcript.map((segment: { text: string }) => segment.text).join(' ');
                setTranscript(transcriptText);
            } else {
                throw new Error("Transcript not found for this video, please paste manually.");
            }
        } catch (err) {
            console.error("Error fetching transcript:", err);
            const detailedError = "Failed to fetch the transcript. This can be due to a network issue, the CORS proxy being temporarily unavailable, or the video not having a transcript. Please check your connection or try pasting the transcript manually.";
            setFetchError(detailedError);
        } finally {
            setIsFetchingTranscript(false);
        }
    };
    
    const handleGenerate = async () => {
        if (!transcript.trim()) {
            setGenerateError('Transcript is empty. Please fetch or paste a transcript first.');
            return;
        }
        setIsGeneratingPost(true);
        setGenerateError(null);
        
        try {
            const { title, content } = await generatePostFromTranscript(transcript);
            navigate('/admin/posts/new', { state: { initialTitle: title, initialContent: content } });
        } catch (err) {
            setGenerateError((err as Error).message);
            console.error(err);
        } finally {
            setIsGeneratingPost(false);
        }
    };
    
    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">YouTube Transcript to Blog Post</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Turn any YouTube video transcript into a formatted blog post with an English summary and Tamil translation.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            <strong>How to use:</strong> Paste a YouTube link to fetch the transcript automatically. If unavailable, you can still paste it manually into the text area below.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            YouTube Video Link
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                id="youtubeLink"
                                type="text"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                placeholder="Paste YouTube link here..."
                                className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button
                                onClick={handleFetchTranscript}
                                disabled={isFetchingTranscript}
                                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isFetchingTranscript ? <Spinner /> : <><DownloadCloud className="mr-2 h-5 w-5" /> Fetch Transcript</>}
                            </button>
                        </div>
                         {fetchError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fetchError}</p>}
                    </div>

                    <div>
                        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Transcript (Editable)
                        </label>
                        <textarea
                            id="transcript"
                            rows={15}
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Transcript will appear here after fetching, or you can paste it manually..."
                            className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    {generateError && <p className="text-red-500 text-sm">{generateError}</p>}
                    
                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={isGeneratingPost || !transcript.trim()}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGeneratingPost ? <Spinner /> : <><Sparkles className="mr-2 h-5 w-5" /> Generate Blog Post</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeTool;