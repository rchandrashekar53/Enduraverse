// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// // } from "react-native";
// // import io from "socket.io-client";

// // const SERVER_URL = "http://192.168.124.19:3000"; // Change this to your server IP

// // const App = () => {
// //   const [sensorData, setSensorData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [realTimeData, setRealTimeData] = useState(null);

// //   useEffect(() => {
// //     const socket = io(SERVER_URL);

// //     socket.on("connect", () => console.log("✅ Connected to WebSocket Server"));

// //     socket.on("message", (data) => {
// //       const parsedData = JSON.parse(data);
// //       setRealTimeData(parsedData);
// //     });

// //     return () => socket.disconnect();
// //   }, []);

// //   useEffect(() => {
// //     console.log("📌 Data received:", realTimeData);
// //   }, [realTimeData]); // This runs every time realTimeData updates

// //   // const fetchSensorData = async () => {
// //   //   setLoading(true);
// //   //   try {
// //   //     const response = await fetch(`${SERVER_URL}/api/sensor-data`);
// //   //     const data = await response.json();
// //   //     setSensorData(data);
// //   //   } catch (error) {
// //   //     Alert.alert("Error", "Failed to fetch sensor data.");
// //   //     console.error(error);
// //   //   }
// //   //   setLoading(false);
// //   // };

// //   useEffect(() => {
// //     // fetchSensorData();
// //   }, []);

// //   const SensorCard = ({ data }) => (
// //     <View style={styles.card}>
// //       <Text style={styles.timestamp}>
// //         {new Date(data.timestamp).toLocaleString()}
// //       </Text>
// //       <Text>
// //         Acceleration: X: {data.acceleration.x}, Y: {data.acceleration.y}, Z:{" "}
// //         {data.acceleration.z}
// //       </Text>
// //       <Text>
// //         Gyroscope: X: {data.gyroscope.x}, Y: {data.gyroscope.y}, Z:{" "}
// //         {data.gyroscope.z}
// //       </Text>
// //       <Text>Temperature: {data.temperature}°C</Text>
// //     </View>
// //   );

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.header}>Sensor Data</Text>

// //       {/* <TouchableOpacity onPress={fetchSensorData} style={styles.button}> */}
// //       <TouchableOpacity style={styles.button}>
// //         <Text style={styles.buttonText}>Fetch Historical Data</Text>
// //       </TouchableOpacity>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#3498db" />
// //       ) : (
// //         sensorData.map((data, index) => <SensorCard key={index} data={data} />)
// //       )}

// //       {realTimeData ? (
// //         <View style={styles.realTimeContainer}>
// //           <Text style={styles.realTimeHeader}>Real-Time Data</Text>
// //           <SensorCard data={realTimeData} />
// //         </View>
// //       ) : (
// //         <Text>No real-time data</Text>
// //       )}
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
// //   header: {
// //     paddingTop: 25,
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "#333",
// //     marginBottom: 10,
// //   },
// //   button: {
// //     backgroundColor: "#3498db",
// //     padding: 10,
// //     borderRadius: 5,
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   buttonText: { color: "#fff", fontSize: 16 },
// //   card: {
// //     backgroundColor: "#fff",
// //     padding: 15,
// //     borderRadius: 5,
// //     marginBottom: 10,
// //   },
// //   timestamp: { fontWeight: "bold", marginBottom: 5 },
// //   realTimeContainer: {
// //     marginTop: 20,
// //     padding: 15,
// //     backgroundColor: "#eaf7ff",
// //     borderRadius: 5,
// //   },
// //   realTimeHeader: { fontSize: 20, fontWeight: "bold", color: "#007aff" },
// // });

// // export default App;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";

// const SERVER_URL = "ws://192.168.124.19:3000"; // Change to your backend WebSocket URL

// const HomeScreen = ({ navigation }) => {
//   const [realTimeData, setRealTimeData] = useState(null);

//   useEffect(() => {
//     const socket = new WebSocket(SERVER_URL);

//     socket.onopen = () => console.log("✅ Connected to WebSocket Server");
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         setRealTimeData(data);
//       } catch (err) {
//         console.error("❌ Error parsing WebSocket data:", err);
//       }
//     };
//     socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
//     socket.onclose = () => console.log("❌ WebSocket connection closed");

//     return () => socket.close();
//   }, []);

//   return (
//     <LinearGradient colors={["#1e3c72", "#2a5298"]} style={styles.container}>
//       <Text style={styles.header}>🚀 Real-Time Sensor Data</Text>
//       {realTimeData ? (
//         <SensorCard data={realTimeData} />
//       ) : (
//         <ActivityIndicator size="large" color="white" />
//       )}
//       <TouchableOpacity
//         onPress={() => navigation.navigate("HistoricalScreen")}
//         style={styles.button}
//       >
//         <Text style={styles.buttonText}>Fetch Historical Data</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const HistoricalScreen = () => {
//   const [sensorData, setSensorData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${SERVER_URL}/api/sensor-data`)
//       .then((response) => response.json())
//       .then((data) => {
//         setSensorData(data);
//         setLoading(false);
//       })
//       .catch((error) =>
//         console.error("❌ Error fetching historical data:", error)
//       );
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>📊 Historical Sensor Data</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="white" />
//       ) : (
//         sensorData.map((data, index) => <SensorCard key={index} data={data} />)
//       )}
//     </ScrollView>
//   );
// };

// const SensorCard = ({ data }) => (
//   <View style={styles.card}>
//     <Text style={styles.timestamp}>
//       {new Date(data.timestamp).toLocaleString()}
//     </Text>
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
//     <SensorItem
//       icon="thermometer"
//       label="Temperature"
//       value={data.temperature}
//       unit="°C"
//     />
//   </View>
// );

// const SensorItem = ({ icon, label, value, unit }) => (
//   <View style={styles.sensorRow}>
//     <MaterialCommunityIcons
//       name={icon}
//       size={24}
//       color="white"
//       style={{ marginRight: 10 }}
//     />
//     <Text style={styles.sensorLabel}>{label}</Text>
//     <Text style={styles.sensorValue}>
//       {value} {unit}
//     </Text>
//   </View>
// );

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="HomeScreen" component={HomeScreen} />
//         <Stack.Screen name="HistoricalScreen" component={HistoricalScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   header: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#3498db",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
//   card: {
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 10,
//   },
//   timestamp: { color: "white", fontWeight: "bold", marginBottom: 5 },
//   sensorRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
//   sensorLabel: { color: "white", fontSize: 18, flex: 1 },
//   sensorValue: { color: "white", fontSize: 18, fontWeight: "bold" },
// });

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RealTimeScreen from "./RealTimeScreen";
import HistoricalScreen from "./HistoricalScreen";
import GraphScreen from "./ChartsScreen";
import { TelemetryProvider } from "./context/TelemetryContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <TelemetryProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RealTime" component={RealTimeScreen} />
          <Stack.Screen name="Historical" component={HistoricalScreen} />
          <Stack.Screen name="Graph" component={GraphScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TelemetryProvider>
  );
};

export default App;
