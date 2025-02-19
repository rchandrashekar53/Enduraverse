// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator, ScrollView } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from "axios";

// const SERVER_URL = "ws://192.168.124.19:3000"; // Change to your WebSocket URL
// const API_URL = "http://192.168.124.19:3000/api/sensor-data"; // Change to your API URL

// const App = () => {
//   const [realTimeData, setRealTimeData] = useState(null);
//   const [historicalData, setHistoricalData] = useState([]);

//   useEffect(() => {
//     // Fetch Historical Data
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await axios.get(API_URL);
//         setHistoricalData(response.data); // Assuming API returns an array
//       } catch (error) {
//         console.error("❌ Error fetching historical data:", error);
//       }
//     };

//     fetchHistoricalData();

//     // WebSocket connection
//     const socket = new WebSocket(SERVER_URL);

//     socket.onopen = () => console.log("✅ Connected to WebSocket Server");

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("📌 Data received:", data);
//         setRealTimeData(data);
//         // Update historical data with new real-time data
//         setHistoricalData((prevData) => [data, ...prevData]);
//       } catch (err) {
//         console.error("❌ Error parsing WebSocket data:", err);
//       }
//     };

//     socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
//     socket.onclose = () => console.log("❌ WebSocket connection closed");

//     return () => socket.close();
//   }, []);

//   return (
//     <LinearGradient
//       colors={["#1e3c72", "#2a5298"]}
//       style={{ flex: 1, padding: 20 }}
//     >
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Real-Time Data */}
//         <Text
//           style={{
//             color: "white",
//             fontSize: 24,
//             fontWeight: "bold",
//             textAlign: "center",
//             marginBottom: 20,
//           }}
//         >
//           🚀 Real-Time Sensor Data
//         </Text>

//         {realTimeData ? (
//           <SensorCard data={realTimeData} isRealTime={true} />
//         ) : (
//           <View style={{ alignItems: "center", marginBottom: 20 }}>
//             <ActivityIndicator size="large" color="white" />
//             <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
//               Waiting for Data...
//             </Text>
//           </View>
//         )}

//         {/* Historical Data Section */}
//         <Text
//           style={{
//             color: "white",
//             fontSize: 22,
//             fontWeight: "bold",
//             marginTop: 20,
//             marginBottom: 10,
//             textAlign: "center",
//           }}
//         >
//           📜 Historical Data
//         </Text>

//         {historicalData.length > 0 ? (
//           historicalData
//             .slice(1, 6)
//             .map((item, index) => (
//               <SensorCard key={index} data={item} timestamp={item.timestamp} />
//             ))
//         ) : (
//           <View style={{ alignItems: "center" }}>
//             <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
//               No historical data available.
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const SensorCard = ({ data, timestamp, isRealTime }) => (
//   <View
//     style={{
//       backgroundColor: isRealTime
//         ? "rgba(255, 255, 255, 0.15)"
//         : "rgba(255, 255, 255, 0.1)",
//       padding: 20,
//       borderRadius: 20,
//       shadowColor: "#000",
//       shadowOpacity: 0.2,
//       shadowRadius: 10,
//       marginBottom: 10,
//     }}
//   >
//     {timestamp && (
//       <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
//         🕒 {new Date(timestamp).toLocaleString()}
//       </Text>
//     )}
//     <SensorItem
//       icon="speedometer"
//       label="Acceleration X"
//       value={data.acceleration.x}
//       unit="m/s²"
//     />
//     <SensorItem
//       icon="speedometer"
//       label="Acceleration Y"
//       value={data.acceleration.y}
//       unit="m/s²"
//     />
//     <SensorItem
//       icon="speedometer"
//       label="Acceleration Z"
//       value={data.acceleration.z}
//       unit="m/s²"
//     />

//     <View
//       style={{
//         height: 1,
//         backgroundColor: "white",
//         marginVertical: 10,
//         opacity: 0.4,
//       }}
//     />

//     <SensorItem
//       icon="rotate-3d-variant"
//       label="Gyroscope X"
//       value={data.gyroscope.x}
//       unit="°/s"
//     />
//     <SensorItem
//       icon="rotate-3d-variant"
//       label="Gyroscope Y"
//       value={data.gyroscope.y}
//       unit="°/s"
//     />
//     <SensorItem
//       icon="rotate-3d-variant"
//       label="Gyroscope Z"
//       value={data.gyroscope.z}
//       unit="°/s"
//     />

//     <View
//       style={{
//         height: 1,
//         backgroundColor: "white",
//         marginVertical: 10,
//         opacity: 0.4,
//       }}
//     />

//     <SensorItem
//       icon="thermometer"
//       label="Temperature"
//       value={data.temperature}
//       unit="°C"
//     />
//   </View>
// );

// const SensorItem = ({ icon, label, value, unit }) => (
//   <View
//     style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
//   >
//     <MaterialCommunityIcons
//       name={icon}
//       size={24}
//       color="white"
//       style={{ marginRight: 10 }}
//     />
//     <Text style={{ color: "white", fontSize: 18, fontWeight: "600", flex: 1 }}>
//       {label}
//     </Text>
//     <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
//       {value} {unit}
//     </Text>
//   </View>
// );

// export default App;
