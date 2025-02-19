const WebSocket = require("ws");

// WebSocket connection to your server
const ws = new WebSocket("ws://192.168.80.19:3000"); // Change this to your backend WebSocket URL

ws.on("open", () => {
  console.log("Connected to WebSocket");

  // Send random data every 5 seconds
  setInterval(() => {
    const mockData = {
      acceleration: {
        x: parseFloat((Math.random() * 10).toFixed(2)),
        y: parseFloat((Math.random() * 10).toFixed(2)),
        z: parseFloat((Math.random() * 10).toFixed(2)),
      },
      gyroscope: {
        x: parseFloat((Math.random() * 500).toFixed(2)),
        y: parseFloat((Math.random() * 500).toFixed(2)),
        z: parseFloat((Math.random() * 500).toFixed(2)),
      },
      temperature: parseFloat((Math.random() * 40).toFixed(2)),
    };

    // Send data as a JSON string
    ws.send(JSON.stringify(mockData));
    console.log("Sent data:", mockData);
  }, 5000); // Send data every 5 seconds
});

// Handle errors
ws.on("error", (error) => {
  console.error("WebSocket Error:", error);
});

// Handle WebSocket close
ws.on("close", () => {
  console.log("WebSocket connection closed");
});
