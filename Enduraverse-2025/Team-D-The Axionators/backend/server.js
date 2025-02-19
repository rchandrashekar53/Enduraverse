// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const VehicleData = require("./models/data");

// dotenv.config();
// const express = require("express");

// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {});
//     console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1); // Exit process with failure
//   }
// };

// connectDB();

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Vehicle Data API is running...");
// });

// // Route to add vehicle data
// app.post("/api/vehicle-data", async (req, res) => {
//   try {
//     const vehicleData = new VehicleData(req.body);
//     await vehicleData.save();
//     res
//       .status(201)
//       .json({ message: "Vehicle data saved successfully", data: vehicleData });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Route to fetch all vehicle data
// app.get("/api/vehicle-data", async (req, res) => {
//   try {
//     const data = await VehicleData.find().sort({ timestamp: -1 });
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// // Working
// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// // Define schema
// const SensorDataSchema = new mongoose.Schema({
//   acceleration: { x: Number, y: Number, z: Number },
//   gyroscope: { x: Number, y: Number, z: Number },
//   temperature: Number,
//   timestamp: { type: Date, default: Date.now },
// });
// const SensorData = mongoose.model("SensorData", SensorDataSchema);

// // WebSocket connection
// // wss.on("connection", (ws) => {
// //   console.log("ESP32 Connected");

// //   ws.on("message", async (message) => {
// //     try {
// //       const data = JSON.parse(message);
// //       const sensorData = new SensorData(data);
// //       // await sensorData.save();
// //       console.log("Data saved:", sensorData);
// //       sensorData
// //         .save()
// //         .then(() => console.log("✅ Manual Save Successful"))
// //         .catch((err) => console.error("❌ Manual Save Failed:", err));

// //       wss.clients.forEach((client) => {
// //         if (client.readyState === WebSocket.OPEN) {
// //           client.send(JSON.stringify(sensorData));
// //         }
// //       });
// //     } catch (error) {
// //       console.log("Error saving data:", error);
// //     }
// //   });

// //   ws.on("close", (code, reason) => {
// //     console.log(`ESP32 Disconnected! Code: ${code}, Reason: ${reason}`);
// //   });
// // });
// // WebSocket connection
// wss.on("connection", (ws) => {
//   console.log("ESP32 Connected");

//   ws.on("message", async (message) => {
//     try {
//       const data = JSON.parse(message);
//       const sensorData = new SensorData(data);
//       // await sensorData.save();
//       console.log("Data saved:", sensorData);
//       sensorData
//         .save()
//         .then(() => console.log("✅ Manual Save Successful"))
//         .catch((err) => console.error("❌ Manual Save Failed:", err));

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(sensorData));
//         }
//       });
//     } catch (error) {
//       console.log("Error saving data:", error);
//     }
//   });

//   ws.on("close", () => console.log("ESP32 Disconnected"));
// });

// // API Endpoint to get sensor data
// app.get("/api/sensor-data", async (req, res) => {
//   try {
//     const data = await SensorData.find().sort({ timestamp: -1 }).limit(25);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.listen(3000, () => console.log("✅ Server running on port 3000"));

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Sensor Data Schema
const SensorSchema = new mongoose.Schema({
  acceleration: { x: Number, y: Number, z: Number },
  gyroscope: { x: Number, y: Number, z: Number },
  temperature: Number,
  alert: { type: String, default: "None" }, // 🔴 Added alert field
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model("Dataforsensor", SensorSchema);

// WebSocket Connection Handling
wss.on("connection", (ws) => {
  console.log("🔗 ESP32 Connected via WebSocket");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      const sensorData = new SensorData(data);
      console.log(sensorData);
      // // Save data to MongoDB
      sensorData
        .save()
        .then(() => console.log("✅ Data Saved:", sensorData))
        .catch((err) => console.error("❌ MongoDB Save Error:", err));

      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(sensorData));
        }
      });
    } catch (error) {
      console.log("❌ Error processing WebSocket message:", error);
    }
  });

  ws.on("close", () => console.log("❌ ESP32 Disconnected"));
  // Keep the connection alive
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 5000);
});

// API Endpoint to Get Recent Sensor Data
app.get("/api/sensor-data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(25);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));

// Working
// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config();
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// // Define schema
// const SensorDataSchema = new mongoose.Schema({
//   acceleration: { x: Number, y: Number, z: Number },
//   gyroscope: { x: Number, y: Number, z: Number },
//   temperature: Number,
//   timestamp: { type: Date, default: Date.now },
// });
// const SensorData = mongoose.model("SensorData", SensorDataSchema);

// // WebSocket connection
// wss.on("connection", (ws) => {
//   console.log("ESP32 Connected");

//   ws.on("message", async (message) => {
//     try {
//       const data = JSON.parse(message);
//       const sensorData = new SensorData(data);
//       // await sensorData.save();
//       console.log("Data saved:", sensorData);
//       sensorData
//         .save()
//         .then(() => console.log("✅ Manual Save Successful"))
//         .catch((err) => console.error("❌ Manual Save Failed:", err));

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(sensorData));
//         }
//       });
//     } catch (error) {
//       console.log("Error saving data:", error);
//     }
//   });

//   ws.on("close", () => console.log("ESP32 Disconnected"));
// });

// // API Endpoint to get sensor data
// app.get("/api/sensor-data", async (req, res) => {
//   try {
//     const data = await SensorData.find().sort({ timestamp: -1 }).limit(25);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// server.listen(3000, () => console.log("✅ Server running on port 3000"));
