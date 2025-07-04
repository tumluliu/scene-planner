import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from any origin (including no origin for same-server requests)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/gifs', express.static(path.join(__dirname, 'sample-gifs')));

// Request logging middleware for debugging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const origin = req.headers.origin || 'no-origin';
    console.log(`[${timestamp}] ${req.method} ${req.url} - Origin: ${origin}`);
    next();
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(204);
});

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

// Alternative GIFs for rearrangement - different perspectives/arrangements of similar themes
const rearrangeGifs = {
    cat: [
        'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif', // Different cat GIF
        'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif', // Another cat variation
        'https://media.giphy.com/media/kFgzrTt798d2w/giphy.gif', // Cat playing
    ],
    dog: [
        'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif',
        'https://media.giphy.com/media/l3V0lsGtTMSB5YNgc/giphy.gif',
    ],
    space: [
        'https://media.giphy.com/media/xT9IgN8YKRhByRBxK0/giphy.gif', // Different space scene
        'https://media.giphy.com/media/3o7abA6VhHdnt6R8x2/giphy.gif', // Space exploration
        'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif', // Cosmic scene
    ],
    ocean: [
        'https://media.giphy.com/media/3o7abNwhf1SbtIKYj6/giphy.gif', // Different ocean waves
        'https://media.giphy.com/media/l0HlTy9x8FZo0XO4U/giphy.gif', // Underwater view
    ],
    fire: [
        'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif', // Different fire animation
        'https://media.giphy.com/media/l0MYAn3XZeCPFGHV6/giphy.gif', // Campfire
    ],
    cyberpunk: [
        'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', // Neon city from different angle
        'https://media.giphy.com/media/l0HlALoyOgM02LhAc/giphy.gif', // Cyberpunk street
    ],
    city: [
        'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif', // City from different perspective
        'https://media.giphy.com/media/3o7abMQoF1K4z7wq3K/giphy.gif', // Night city
    ],
    forest: [
        'https://media.giphy.com/media/l0HlLzQ8YH6s7v7TW/giphy.gif', // Forest from different angle
        'https://media.giphy.com/media/3o7abKO4TNnF5vhgfw/giphy.gif', // Mystical forest
    ],
    water: [
        'https://media.giphy.com/media/l0HlGkBl5nJ5v7RyU/giphy.gif', // Water from different view
        'https://media.giphy.com/media/xT9IgAzXkCgAqHMvkI/giphy.gif', // Rain/water drops
    ],
    lightning: [
        'https://media.giphy.com/media/l0HlFl0z5VvOJV3UI/giphy.gif', // Lightning from different angle
        'https://media.giphy.com/media/3o7abJtDvSKfPHNjKE/giphy.gif', // Storm scene
    ],
    default: [
        'https://media.giphy.com/media/xT9IgN8YKRhByRBxK0/giphy.gif',
        'https://media.giphy.com/media/3o7abA6VhHdnt6R8x2/giphy.gif',
        'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
        'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
        'https://media.giphy.com/media/l0MYAn3XZeCPFGHV6/giphy.gif',
    ]
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

// Helper function to get a rearranged version of a scene
function getRearrangedGif(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // Find which category this prompt belongs to
    for (const [keyword, _] of Object.entries(keywordGifs)) {
        if (lowerPrompt.includes(keyword) && rearrangeGifs[keyword]) {
            const alternatives = rearrangeGifs[keyword];
            return alternatives[Math.floor(Math.random() * alternatives.length)];
        }
    }

    // If no specific category found, use default rearrange options
    const defaultOptions = rearrangeGifs.default;
    return defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
}

// Mock text-to-scene endpoint (backward compatible with text-to-gif)
app.post('/api/text-to-gif', async (req, res) => {
    try {
        const { text_prompt } = req.body;

        if (!text_prompt || typeof text_prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid text_prompt. Please provide a text description.',
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

        // Generate scene ID in format similar to real server (xxxx-xxxx pattern)
        const sceneId = randomUUID();
        console.log(`🎨 Generated scene ID: ${sceneId} for prompt: "${text_prompt}"`);

        // Get relevant GIF based on prompt
        const gifUrl = getRelevantGif(text_prompt);

        try {
            // Fetch the actual GIF file
            const gifResponse = await fetch(gifUrl);
            if (!gifResponse.ok) {
                throw new Error('Failed to fetch GIF');
            }

            const gifBuffer = await gifResponse.arrayBuffer();

            // Set headers for GIF file to match real server format
            res.set({
                'Content-Type': 'image/gif',
                'Content-Length': gifBuffer.byteLength,
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                'Content-Disposition': `attachment; filename="${sceneId}.gif"` // Match real server format
            });

            // Send the GIF file
            res.send(Buffer.from(gifBuffer));

        } catch (fetchError) {
            console.error('Error fetching GIF:', fetchError);
            return res.status(500).json({
                error: 'Failed to generate GIF file',
                status: 'error'
            });
        }

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

// Mock rearrange-scene endpoint
app.post('/api/rearrange-scene', async (req, res) => {
    try {
        const { scene_id, original_prompt } = req.body;

        if (!scene_id || typeof scene_id !== 'string') {
            return res.status(400).json({
                error: 'Invalid scene_id. Please provide a valid scene identifier.',
                status: 'error'
            });
        }

        if (!original_prompt || typeof original_prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid original_prompt. Please provide the original scene description.',
                status: 'error'
            });
        }

        console.log(`🔄 Rearranging scene: ${scene_id} - "${original_prompt}"`);

        // Generate new scene ID for the rearranged scene
        const newSceneId = randomUUID();
        console.log(`🎨 Generated new scene ID: ${newSceneId} for rearranged scene (original: ${scene_id})`);

        // Simulate processing time (1-2 seconds, slightly faster than generation)
        const processingTime = Math.random() * 1000 + 1000;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // Occasionally simulate errors for testing (lower chance than generation)
        if (Math.random() < 0.05) { // 5% chance of error
            return res.status(500).json({
                error: 'Scene rearrangement failed. Please try again.',
                status: 'error'
            });
        }

        // Get a rearranged version of the scene
        const rearrangedGifUrl = getRearrangedGif(original_prompt);

        try {
            // Fetch the actual GIF file
            const gifResponse = await fetch(rearrangedGifUrl);
            if (!gifResponse.ok) {
                throw new Error('Failed to fetch rearranged GIF');
            }

            const gifBuffer = await gifResponse.arrayBuffer();

            // Set headers for GIF file to match real server format
            res.set({
                'Content-Type': 'image/gif',
                'Content-Length': gifBuffer.byteLength,
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                'Content-Disposition': `attachment; filename="${newSceneId}.gif"` // Match real server format
            });

            // Send the GIF file
            res.send(Buffer.from(gifBuffer));

        } catch (fetchError) {
            console.error('Error fetching rearranged GIF:', fetchError);
            return res.status(500).json({
                error: 'Failed to generate rearranged GIF file',
                status: 'error'
            });
        }

    } catch (error) {
        console.error('Error processing rearrange request:', error);
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
    console.log(`🔄 Rearrange endpoint: POST http://0.0.0.0:${PORT}/api/rearrange-scene`);
    console.log(`❤️  Health check: GET http://0.0.0.0:${PORT}/api/health`);
    console.log(`💡 Sample prompts: GET http://0.0.0.0:${PORT}/api/sample-prompts`);
    console.log(`🌐 Also accessible via localhost: http://localhost:${PORT}`);
    console.log(`🔓 CORS enabled - accepting requests from any origin`);
    console.log(`📡 Supports cross-origin requests from different servers`);
}); 