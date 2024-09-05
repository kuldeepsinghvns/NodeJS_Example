const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

console.log("WebSocket is running on ws://localhost:8080");

server.on('connection', (ws) => {
    console.log('Client Connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        ws.send(`Received: ${message}`);
    });

    ws.on('close', () => {
        console.log("Client Disconnected");
    });
});
