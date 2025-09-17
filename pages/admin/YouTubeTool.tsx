
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePostFromTranscript } from '../../services/geminiService';
import Spinner from '../../components/Spinner';
import { Sparkles, AlertTriangle } from 'lucide-react';

const YouTubeTool = () => {
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleGenerate = async () => {
        if (!transcript.trim()) {
            setError('Please paste a transcript first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const { title, content } = await generatePostFromTranscript(transcript);
            navigate('/admin/posts/new', { state: { initialTitle: title, initialContent: content } });
        } catch (err) {
            setError((err as Error).message);
            console.error(err);
        } finally {
            setIsLoading(false);
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
                            <strong>Important Note:</strong> This tool requires you to manually paste the video transcript. You can usually get this from YouTube by clicking the '...' button below a video and selecting 'Show transcript'.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Paste Transcript Here
                        </label>
                        <textarea
                            id="transcript"
                            rows={15}
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Paste the full transcript text from a YouTube video..."
                            className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors"
                        >
                            {isLoading ? <Spinner /> : <><Sparkles className="mr-2 h-5 w-5" /> Generate Blog Post</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeTool;
