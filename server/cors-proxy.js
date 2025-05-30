import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
}));

// Proxy all requests to your real backend
const TARGET_SERVER = process.env.TARGET_SERVER || 'http://your-real-backend-server:port';

app.use('/api', createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api', // Keep the /api prefix
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying: ${req.method} ${req.url} -> ${TARGET_SERVER}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to all responses
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    }
}));

app.listen(PORT, () => {
    console.log(`🔄 CORS Proxy running on http://localhost:${PORT}`);
    console.log(`🎯 Forwarding requests to: ${TARGET_SERVER}`);
    console.log(`📝 Example: http://localhost:${PORT}/api/health -> ${TARGET_SERVER}/api/health`);
    console.log(`🔓 CORS completely disabled for all requests`);
}); 