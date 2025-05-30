# Configuration Guide

This document explains how to configure the Scene Planner application for different environments.

## API Base URL Configuration

The application supports multiple ways to configure the API base URL, in order of priority:

### 1. Environment Variables (Highest Priority)

Create a `.env` file in the project root:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3001
```

**Examples for different environments:**

```bash
# Development
VITE_API_BASE_URL=http://localhost:3001

# Production
VITE_API_BASE_URL=https://api.your-domain.com

# Staging
VITE_API_BASE_URL=https://staging-api.your-domain.com

# Docker Compose
VITE_API_BASE_URL=http://backend:3001

# Custom port
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Automatic Detection (Fallback)

If no environment variable is set, the application will:

1. Use `localhost:3001` if the frontend is running on localhost or 127.0.0.1
2. Use `{current-hostname}:3001` for other hostnames
3. Fall back to `http://localhost:3001` as the final default

## Environment-Specific Setup

### Development

```bash
# .env
VITE_API_BASE_URL=http://localhost:3001

# Start the mock server
node server/mock-api.js

# Start the frontend (in another terminal)
npm run dev
```

### Production Build

```bash
# .env.production
VITE_API_BASE_URL=https://api.your-domain.com

# Build for production
npm run build
```

### Docker

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    environment:
      - VITE_API_BASE_URL=http://backend:3001
    ports:
      - "3000:3000"
  
  backend:
    # Your API service
    ports:
      - "3001:3001"
```

### Staging/Testing

```bash
# .env.staging
VITE_API_BASE_URL=https://staging-api.your-domain.com
```

## Configuration Validation

The configuration system includes validation:

- URLs must be properly formatted
- Supports both HTTP and HTTPS
- Handles custom ports
- Provides meaningful error messages

## Debugging Configuration

To see which API base URL is being used:

1. Check the browser's Network tab in Developer Tools
2. Look at the API requests to see the full URLs
3. Check the console for any configuration warnings

## API Endpoints

The application expects these endpoints to be available on the configured base URL:

- `POST /api/text-to-gif` - Main generation endpoint
- `GET /api/sample-prompts` - Fetch sample prompts  
- `GET /api/health` - Health check

## Example Configurations

### Local Development with Custom Port

```bash
VITE_API_BASE_URL=http://localhost:8080
```

### Production with HTTPS

```bash
VITE_API_BASE_URL=https://api.scene-planner.com
```

### Load Balancer Setup

```bash
VITE_API_BASE_URL=https://lb.your-domain.com/api
```

### Development with IP Address

```bash
VITE_API_BASE_URL=http://192.168.1.100:3001
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your API server allows requests from your frontend domain
2. **Connection refused**: Check that the API server is running on the configured URL
3. **404 errors**: Verify the API endpoints exist at the configured base URL

### Testing Configuration

```bash
# Test the health endpoint
curl {VITE_API_BASE_URL}/api/health

# Test the main endpoint
curl -X POST {VITE_API_BASE_URL}/api/text-to-gif \
  -H "Content-Type: application/json" \
  -d '{"text_prompt": "test"}' \
  -I
``` 