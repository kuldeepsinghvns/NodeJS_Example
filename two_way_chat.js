const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

let socket_1 = null;
let socket_2 = null;

console.log("WebSocket is running on ws://localhost:8080");

server.on("connection", (socket) => {
  if (!socket_1) {
    socket_1 = socket;
    console.log("Socket_1 connected");
    socket_1.send("Welcome Socket_1! You are connected.");
  } else if (!socket_2) {
    socket_2 = socket;
    console.log("Socket_2 connected");
    socket_2.send("Welcome Socket_2! You are connected.");
  } else {
    socket.send("Server full");
    socket.close();
    return;
  }

  // Handling message from clients
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);

    if (socket === socket_1 && socket_2 && socket_2.readyState === WebSocket.OPEN) {
      socket_2.send(`${message}`);
    } else if (socket === socket_2 && socket_1 && socket_1.readyState === WebSocket.OPEN) {
      socket_1.send(`${message}`);
    }
  });

  // Handling socket close event
  socket.on("close", () => {
    console.log("Connection closed");
    if (socket === socket_1) {
      socket_1 = null;
    } else if (socket === socket_2) {
      socket_2 = null;
    }
  });
});
