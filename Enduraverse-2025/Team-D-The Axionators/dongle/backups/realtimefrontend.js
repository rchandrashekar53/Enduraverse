// import React, { useEffect, useState } from "react";
// import { Text, View } from "react-native";
// import { io } from "socket.io-client";

// const SERVER_URL = "ws://192.168.124.19:3000"; // Change to your backend WebSocket URL

// const App = () => {
//   const [realTimeData, setRealTimeData] = useState(null);

//   useEffect(() => {
//     const socket = new WebSocket(SERVER_URL);

//     socket.onopen = () => {
//       console.log("✅ Connected to WebSocket Server");
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("📌 Data received:", data);
//         setRealTimeData(data);
//       } catch (err) {
//         console.error("❌ Error parsing WebSocket data:", err);
//       }
//     };

//     socket.onerror = (error) => {
//       console.error("❌ WebSocket Error:", error);
//     };

//     socket.onclose = () => {
//       console.log("❌ WebSocket connection closed");
//     };

//     return () => socket.close();
//   }, []);

//   return (
//     <View>
//       <Text>Real-Time Data:</Text>
//       {realTimeData ? (
//         <>
//           <Text>Acceleration X: {realTimeData.acceleration.x}</Text>
//           <Text>Acceleration Y: {realTimeData.acceleration.y}</Text>
//           <Text>Acceleration Z: {realTimeData.acceleration.z}</Text>
//           <Text>Gyroscope X: {realTimeData.gyroscope.x}</Text>
//           <Text>Gyroscope Y: {realTimeData.gyroscope.y}</Text>
//           <Text>Gyroscope Z: {realTimeData.gyroscope.z}</Text>
//           <Text>Temperature: {realTimeData.temperature}°C</Text>
//         </>
//       ) : (
//         <Text>Waiting for data...</Text>
//       )}
//     </View>
//   );
// };

// export default App;
