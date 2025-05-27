# Mock Text-to-GIF API Server

A simple Express.js server that provides a mock API for testing the Scene Planner frontend application.

## Features

- 🎯 **Realistic API simulation** with processing delays
- 🎨 **Keyword-based GIF selection** for relevant responses
- 🔄 **Error simulation** for testing error handling
- 📊 **Health check endpoint** for monitoring
- 💡 **Sample prompts endpoint** for inspiration

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **For development with auto-restart**:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/text-to-gif`

Converts text prompt to GIF URL.

**Request Body:**
```json
{
  "prompt": "A cat wearing sunglasses walking through a cyberpunk city"
}
```

**Response:**
```json
{
  "gif_url": "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "prompt": "A cat wearing sunglasses walking through a cyberpunk city",
  "status": "success",
  "processing_time": 1847,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response:**
```json
{
  "error": "GIF generation failed. Please try again.",
  "status": "error"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Mock Text-to-GIF API",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### GET `/api/sample-prompts`

Get sample prompts for testing.

**Response:**
```json
{
  "prompts": [
    "A cat wearing sunglasses walking through a neon-lit cyberpunk city",
    "A majestic dragon breathing fire in a medieval castle",
    "..."
  ],
  "count": 10
}
```

## Keyword Mapping

The server uses keyword detection to return relevant GIFs:

- **cat** → Cat GIF
- **dog** → Dog GIF
- **space** → Space/Astronaut GIF
- **ocean/water** → Ocean waves GIF
- **fire/dragon** → Fire/Dragon GIF
- **cyberpunk/neon** → Cyberpunk city GIF
- **forest** → Magical forest GIF
- **lightning/magic** → Lightning GIF

If no keywords match, a random GIF is returned.

## Features

### Realistic Simulation
- Processing delays (1-3 seconds)
- 10% chance of random errors
- Keyword-based relevant responses

### CORS Support
The server includes CORS middleware to allow requests from the frontend running on `http://localhost:3000`.

### Error Handling
- Input validation
- Graceful error responses
- Proper HTTP status codes

## Testing

You can test the API using curl:

```bash
# Test text-to-gif endpoint
curl -X POST http://localhost:3001/api/text-to-gif \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cat in space"}'

# Test health endpoint
curl http://localhost:3001/api/health

# Get sample prompts
curl http://localhost:3001/api/sample-prompts
```

## Integration with Frontend

The frontend is already configured to use this mock API. Just make sure both servers are running:

1. **Frontend**: `http://localhost:3000` (Vite dev server)
2. **Backend**: `http://localhost:3001` (Mock API server)

## Customization

### Adding New Keywords
Edit the `keywordGifs` object in `mock-api.js`:

```javascript
const keywordGifs = {
  // Add your keywords here
  unicorn: 'https://your-gif-url.gif',
  rainbow: 'https://another-gif-url.gif',
};
```

### Changing Processing Time
Modify the processing time range:

```javascript
// Current: 1-3 seconds
const processingTime = Math.random() * 2000 + 1000;

// Example: 0.5-2 seconds
const processingTime = Math.random() * 1500 + 500;
```

### Adjusting Error Rate
Change the error simulation probability:

```javascript
// Current: 10% chance
if (Math.random() < 0.1) {

// Example: 5% chance
if (Math.random() < 0.05) {
``` 