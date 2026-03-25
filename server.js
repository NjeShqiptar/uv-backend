const express = require('express');
const { createServer } = require('node:http');
const { createBareServer } = require('@tomphttp/bare-server-node');

// This creates the engine that UV uses to fetch data
const bareServer = createBareServer('/bare/');
const app = express();
const server = createServer();

// Intercept requests and route them to the Bare Server
server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// Handle WebSockets (crucial for modern interactive sites)
server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Bare Server is running on port ${PORT}`);
});
