import { useState } from 'react'
import { Sparkles, Download, Loader2, Image as ImageIcon, Wand2 } from 'lucide-react'
import { clsx } from 'clsx'

interface GenerationResult {
    url: string
    prompt: string
    timestamp: number
    type?: string // 'gif' | '3d-mesh' | 'gaussian-splat' | etc.
}

function App() {
    const [prompt, setPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const samplePrompts = [
        "A cat wearing sunglasses walking through a neon-lit cyberpunk city",
        "A majestic dragon breathing fire in a medieval castle",
        "Astronauts floating in space with Earth in the background",
        "Ocean waves crashing against rocks during a storm",
        "A magical forest with glowing mushrooms and fireflies",
        "Lightning striking a futuristic city skyline"
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setIsLoading(true)
        setError(null)
        setGenerationResult(null)

        try {
            // Using mock API endpoint for testing
            const response = await fetch('http://localhost:3001/api/text-to-gif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt.trim() }),
            })

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`)
            }

            const data = await response.json()

            setGenerationResult({
                url: data.gif_url || data.url,
                prompt: prompt.trim(),
                timestamp: Date.now(),
                type: data.type || 'gif'
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate GIF')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = () => {
        if (generationResult?.url) {
            const link = document.createElement('a')
            link.href = generationResult.url
            const extension = generationResult.type === 'gif' ? 'gif' : 'file'
            link.download = `scene-${Date.now()}.${extension}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <Wand2 className="w-8 h-8 text-purple-600 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Scene Planner
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Transform your imagination into animated scenes. Describe what you want to see, and watch it come to life.
                    </p>
                </div>

                {/* Main Content */}
                <div className="glass-effect rounded-2xl p-8 mb-8 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                                Describe your scene
                            </label>
                            <div className="relative">
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="A cat wearing sunglasses walking through a neon-lit cyberpunk city at night..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                                    rows={4}
                                    disabled={isLoading}
                                />
                                <Sparkles className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={!prompt.trim() || isLoading}
                                className={clsx(
                                    'button-primary flex-1 flex items-center justify-center gap-2',
                                    (!prompt.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-5 h-5" />
                                        Generate Scene
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Sample Prompts */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-3">Try these sample prompts:</p>
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.map((sample, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setPrompt(sample)}
                                        disabled={isLoading}
                                        className="text-xs px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {sample.length > 40 ? `${sample.substring(0, 40)}...` : sample}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Result */}
                {generationResult && (
                    <div className="glass-effect rounded-2xl p-8 animate-slide-up">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Your Generated Scene
                            </h3>
                            <p className="text-gray-600 mb-6 italic">"{generationResult.prompt}"</p>

                            <div className="relative inline-block">
                                <img
                                    src={generationResult.url}
                                    alt={generationResult.prompt}
                                    className="max-w-full h-auto rounded-lg shadow-lg"
                                    style={{ maxHeight: '400px' }}
                                />
                            </div>

                            <div className="mt-6 flex justify-center gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="button-secondary flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => {
                                        setGenerationResult(null)
                                        setPrompt('')
                                    }}
                                    className="button-primary"
                                >
                                    Create Another
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by AI • Built with modern web technologies</p>
                </div>
            </div>
        </div>
    )
}

export default App 