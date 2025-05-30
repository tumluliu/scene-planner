# Scene Planner - AI Scene Generator

A modern, elegant web application that transforms natural language descriptions into immersive scenes using AI. Built with React, TypeScript, Vite, and Tailwind CSS. Supports multiple output formats including GIFs, 3D meshes, and Gaussian splats.

## Features

- 🎨 **Modern UI/UX**: Clean, professional interface with glass morphism effects
- ⚡ **Fast Development**: Built with Vite for lightning-fast hot reload
- 🎯 **TypeScript**: Full type safety and excellent developer experience
- 🎭 **Responsive Design**: Works beautifully on all device sizes
- 🌈 **Smooth Animations**: Elegant transitions and loading states
- 📱 **Progressive Web App Ready**: Modern web standards

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## API Integration

The application uses a configurable API system for text-to-scene conversion.

### Configuration

The API base URL can be configured in several ways:

1. **Environment Variables** (recommended):
   ```bash
   # Create a .env file in the project root
   VITE_API_BASE_URL=http://localhost:3001
   ```

2. **Different Environment Examples**:
   ```bash
   # Development (default)
   VITE_API_BASE_URL=http://localhost:3001
   
   # Production
   VITE_API_BASE_URL=https://api.your-domain.com
   
   # Staging
   VITE_API_BASE_URL=https://staging-api.your-domain.com
   
   # Docker development
   VITE_API_BASE_URL=http://backend:3001
   ```

3. **Automatic Detection**: If no environment variable is set, the app will automatically detect the hostname and use port 3001.

### API Endpoints

The application expects these endpoints:

- `POST /api/text-to-gif` - Main generation endpoint
- `GET /api/sample-prompts` - Fetch sample prompts
- `GET /api/health` - Health check

### Expected API Request Format

```json
{
  "text_prompt": "A cat wearing sunglasses walking through a neon-lit cyberpunk city"
}
```

### Expected API Response

The `/api/text-to-gif` endpoint should return a GIF file directly with:
- Content-Type: `image/gif`
- The actual GIF file content as the response body

### API Requirements

Your API should:
- Accept POST requests with JSON body containing a `text_prompt` field
- Return the generated GIF file directly (not JSON)
- Set proper `Content-Type: image/gif` header
- Handle CORS if the API is on a different domain
- Support reasonable timeout limits for scene generation

### Mock API Server

A mock API server is included for development:

```bash
# Start the mock server
node server/mock-api.js
```

The mock server provides:
- Sample GIF responses based on keywords
- Realistic processing delays
- Error simulation for testing

## Customization

### Styling

The app uses Tailwind CSS with custom components defined in `src/index.css`:

- `.glass-effect`: Glass morphism effect for cards
- `.button-primary`: Primary gradient button style
- `.button-secondary`: Secondary button style

### Animations

Custom animations are defined in `tailwind.config.js`:

- `fade-in`: Smooth fade in effect
- `slide-up`: Slide up with fade effect
- `pulse-slow`: Slow pulsing animation

### Colors and Branding

Update the color scheme in `tailwind.config.js` and the gradient classes in the components.

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # React entry point
├── index.css        # Global styles and Tailwind
└── vite-env.d.ts    # Vite type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Prettier-compatible formatting

## Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on the GitHub repository. 