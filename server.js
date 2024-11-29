const WebSocket = require("ws");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Firebase Admin initialization with your service account
const serviceAccount = require("./firebase_credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Express setup for handling token storage
const app = express();
app.use(cors());

const userTokens = new Map(); // Store FCM tokens for connected users

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to receive and store the token
app.post("/store-token", (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token);

  // Store the token in memory or a database
  userTokens.set(token, Date.now());

  res.json({ message: "Token stored successfully" });
});

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log("Express server running on http://localhost:3000");
});

// WebSocket server creation
const server = new WebSocket.Server({ port: 8080 }); // Run WebSocket server on port 8080

let socket_1 = null;
let socket_2 = null;
let tokens = new Map(); // Map to store FCM tokens for each connected socket

console.log("WebSocket server running on ws://localhost:8080");

server.on("connection", (socket) => {
  if (!socket_1) {
    socket_1 = socket;
    console.log("Socket_1 connected");

    // Generate FCM token for socket_1 and store it
    const token_1 = generateDeviceToken();
    tokens.set("socket_1", token_1);

    socket_1.send("Welcome Socket_1! You are connected.");
    socket_1.send(`Your FCM token: ${token_1}`);
  } else if (!socket_2) {
    socket_2 = socket;
    console.log("Socket_2 connected");

    // Generate FCM token for socket_2 and store it
    const token_2 = generateDeviceToken();
    tokens.set("socket_2", token_2);

    socket_2.send("Welcome Socket_2! You are connected.");
    socket_2.send(`Your FCM token: ${token_2}`);
  } else {
    socket.send("Server full");
    socket.close();
    return;
  }

  // Handling message from clients
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Ensure that the socket is open and not closing before sending a message
    if (
      socket === socket_1 &&
      socket_2 &&
      socket_2.readyState === WebSocket.OPEN
    ) {
      socket_2.send(`${message}`);
      sendPushNotification(tokens.get("socket_2"), message); // Send notification to socket_2
    } else if (
      socket === socket_2 &&
      socket_1 &&
      socket_1.readyState === WebSocket.OPEN
    ) {
      socket_1.send(`${message}`);
      sendPushNotification(tokens.get("socket_1"), message); // Send notification to socket_1
    }
  });

  // Handling socket close event
  socket.on("close", () => {
    console.log("Connection closed");
    if (socket === socket_1) {
      socket_1 = null;
      tokens.delete("socket_1"); // Remove token from map
    } else if (socket === socket_2) {
      socket_2 = null;
      tokens.delete("socket_2"); // Remove token from map
    }
  });

  // Handling errors in WebSocket connection
  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// Generate device token (this is a placeholder; you can use any logic to generate tokens)
function generateDeviceToken() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Function to send push notification via Firebase Cloud Messaging
function sendPushNotification(token, message) {
  // Ensure message is a string before sending
  const messageBody = message ? message.toString() : "No message received"; // default message if null or undefined

  const payload = {
    notification: {
      title: "New Message", // Title of the notification
      body: messageBody, // Body of the notification, message as string
      icon: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGaPQ6uIDTwwDaoWbOcmfpdfa4CWXJiUbwvfwIVEbq1vvHYmUr_9Rq6w4rGTU1fl4dhH3GH4j9BiSiVylBzIvVJuYMxBB3jPJsVpC8lbYoCfWBYxNZEdahYFOS4ARyZZ2HJ2vhhMEv-dY/s1600/Varanasi+Software+Junction+Phone+Logo.png'
           
    },
  };

  console.log("Sending notification to token:", token);

  // Send notification to the specific device using the FCM token
  admin
    .messaging()
    .send({
      token: "dTO7ag9LaU9pBDl8hnh0Ps:APA91bGQarPYgNDhWsOgnkkSnkmXsmAhXlMrvJSu6LreDPdDprTpLawdlTAnGHg0eSDis0bJarA2usU2-op4FNELJBi3FGwA0RSTAkCq63F-L5UNSe2tLRs",
      notification: {
        title: "Sent Message",
        body: "Notification Body",
       
      },
    })
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}
