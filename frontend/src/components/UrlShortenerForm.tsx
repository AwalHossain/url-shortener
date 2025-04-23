import { Check, Copy, Link as LinkIcon, Send } from 'lucide-react';
import React, { useState } from 'react';

const UrlShortenerForm: React.FC = () => {
    const [longUrl, setLongUrl] = useState<string>('');
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        setShortUrl(null);
        setCopied(false);

        if (!longUrl || !/^https?:\/\/.+/.test(longUrl)) {
            setError('Please enter a valid URL (starting with http:// or https://)');
            setIsLoading(false);
            return;
        }

        console.log('Submitting URL:', longUrl);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/url`, { // Your backend endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl: longUrl }),
            });
            if (!response.ok) {
                let errorMessage = 'Network response was not ok';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // Ignore if response is not JSON or empty
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            const newShortUrl = data?.data?.shortUrl;
            if (newShortUrl) {
                setShortUrl(newShortUrl);
                setSuccessMessage('URL shortened successfully!');
            } else {
                throw new Error('Invalid response format from server.');
            }
        } catch (err: unknown) {
            let message = 'Please try again.';
            if (err instanceof Error) {
                message = err.message;
            }
            setError(`Failed to shorten URL: ${message}`);
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }

        // // Simulating API call delay and response (REMOVE THIS IN PRODUCTION)
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // const mockShortUrl = `http://short.ly/${Math.random().toString(36).substring(2, 8)}`;
        // setShortUrl(mockShortUrl);
        // setSuccessMessage('URL shortened successfully! (Mock)'); // Example for mock
        // // setError('Simulated Error'); // Uncomment to test error state
        // setIsLoading(false);
        // // END SIMULATION
    };

    const handleCopy = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    // Optional: Show an error message to the user
                });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-xl mt-[-40px] relative z-0 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-6 text-center">Shorten a long URL</h2>
                <div className="relative flex items-center">
                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        value={longUrl}
                        required
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="Enter your long URL here... (e.g., https://example.com)"
                        className="w-full text-gray-500 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition duration-200 text-brand-text placeholder-gray-400 text-base"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 bg-brand-primary hover:bg-opacity-90 text-brand-bg font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 shadow-md"
                    disabled={isLoading || !longUrl}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Shortening...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Shorten URL
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-5 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center text-sm shadow-sm">
                    {error}
                </div>
            )}

            {successMessage && !error && (
                <div className="mt-5 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-center text-sm shadow-sm">
                    {successMessage}
                </div>
            )}

            {shortUrl && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                    <h3 className="text-base font-medium text-brand-primary mb-2">Your shortened URL:</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-md border border-gray-200">
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all flex-grow text-sm sm:text-base"
                        >
                            {shortUrl}
                        </a>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-1.5 min-w-[80px] ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-200'} font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out text-sm border ${copied ? 'border-green-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-brand-primary/30`}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UrlShortenerForm; 