import express from 'express';
import http from 'node:http';
import { createWispServer } from '@ultraviolet/wisp';

const app = express();
const server = http.createServer(app);

// Serve static files if needed
app.use(express.static('public'));

// Create Wisp server on /wisp
const wisp = createWispServer({ prefix: '/wisp/' });

// Handle WebSocket upgrades and requests
server.on('upgrade', wisp.handleUpgrade.bind(wisp));
server.on('request', (req, res) => {
    if (wisp.shouldRoute(req)) {
        wisp.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Wisp Server running on port ${PORT}`);
});
