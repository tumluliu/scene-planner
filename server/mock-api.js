import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/gifs', express.static(path.join(__dirname, 'sample-gifs')));

// Sample GIF URLs (using popular GIF hosting services)
const sampleGifs = [
    'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', // Cat
    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // Cyberpunk
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', // Space
    'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', // Ocean
    'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif', // Forest
    'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif', // City
    'https://media.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif', // Abstract
    'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', // Fire
    'https://media.giphy.com/media/l0HlR2Q80bGAEXPy0/giphy.gif', // Water
    'https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif', // Lightning
];

// Keywords to GIF mapping for more relevant responses
const keywordGifs = {
    cat: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    dog: 'https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif',
    space: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    ocean: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
    fire: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    cyberpunk: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    city: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif',
    forest: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    water: 'https://media.giphy.com/media/l0HlR2Q80bGAEXPy0/giphy.gif',
    lightning: 'https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif',
    neon: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    robot: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    dragon: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    magic: 'https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif',
};

// Helper function to find relevant GIF based on prompt
function getRelevantGif(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // Check for keywords
    for (const [keyword, gif] of Object.entries(keywordGifs)) {
        if (lowerPrompt.includes(keyword)) {
            return gif;
        }
    }

    // Return random GIF if no keywords match
    return sampleGifs[Math.floor(Math.random() * sampleGifs.length)];
}

// Mock text-to-scene endpoint (backward compatible with text-to-gif)
app.post('/api/text-to-gif', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid prompt. Please provide a text description.',
                status: 'error'
            });
        }

        // Simulate processing time (1-3 seconds)
        const processingTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // Occasionally simulate errors for testing
        if (Math.random() < 0.1) { // 10% chance of error
            return res.status(500).json({
                error: 'Scene generation failed. Please try again.',
                status: 'error'
            });
        }

        // Get relevant GIF based on prompt
        const gifUrl = getRelevantGif(prompt);

        res.json({
            url: gifUrl, // Generic URL field
            gif_url: gifUrl, // Backward compatibility
            prompt: prompt,
            status: 'success',
            type: 'gif', // Can be 'gif', '3d-mesh', 'gaussian-splat', etc.
            processing_time: Math.round(processingTime),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            error: 'Internal server error',
            status: 'error'
        });
    }
});

// Generic text-to-scene endpoint (future-ready for 3D formats)
app.post('/api/text-to-scene', async (req, res) => {
    try {
        const { prompt, format = 'gif' } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid prompt. Please provide a text description.',
                status: 'error'
            });
        }

        // Simulate processing time (1-3 seconds)
        const processingTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // Occasionally simulate errors for testing
        if (Math.random() < 0.1) { // 10% chance of error
            return res.status(500).json({
                error: 'Scene generation failed. Please try again.',
                status: 'error'
            });
        }

        // For now, return GIF regardless of format (can be extended later)
        const sceneUrl = getRelevantGif(prompt);

        // Future: handle different formats
        // if (format === '3d-mesh') { ... }
        // if (format === 'gaussian-splat') { ... }

        res.json({
            url: sceneUrl,
            prompt: prompt,
            status: 'success',
            type: format,
            format: format, // Alternative field name
            processing_time: Math.round(processingTime),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            error: 'Internal server error',
            status: 'error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Mock Text-to-GIF API',
        timestamp: new Date().toISOString()
    });
});

// List available sample prompts
app.get('/api/sample-prompts', (req, res) => {
    const samplePrompts = [
        "A cat wearing sunglasses walking through a neon-lit cyberpunk city",
        "A majestic dragon breathing fire in a medieval castle",
        "Astronauts floating in space with Earth in the background",
        "Ocean waves crashing against rocks during a storm",
        "A magical forest with glowing mushrooms and fireflies",
        "Lightning striking a futuristic city skyline",
        "A robot dancing in a disco with colorful lights",
        "Underwater scene with tropical fish and coral reefs",
        "A phoenix rising from flames in slow motion",
        "Northern lights dancing over a snowy mountain landscape"
    ];

    res.json({
        prompts: samplePrompts,
        count: samplePrompts.length
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mock Scene Generation API running on http://0.0.0.0:${PORT}`);
    console.log(`📝 Legacy endpoint: POST http://0.0.0.0:${PORT}/api/text-to-gif`);
    console.log(`🎨 Generic endpoint: POST http://0.0.0.0:${PORT}/api/text-to-scene`);
    console.log(`❤️  Health check: GET http://0.0.0.0:${PORT}/api/health`);
    console.log(`💡 Sample prompts: GET http://0.0.0.0:${PORT}/api/sample-prompts`);
    console.log(`🌐 Also accessible via localhost: http://localhost:${PORT}`);
}); 