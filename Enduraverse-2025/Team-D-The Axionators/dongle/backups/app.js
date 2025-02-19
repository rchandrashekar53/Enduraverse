// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import io from "socket.io-client";

// const SERVER_URL = "http://192.168.124.19:3000"; // Change this to your server IP

// const App = () => {
//   const [sensorData, setSensorData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [realTimeData, setRealTimeData] = useState(null);

//   useEffect(() => {
//     const socket = io(SERVER_URL);

//     socket.on("connect", () => console.log("✅ Connected to WebSocket Server"));

//     socket.on("message", (data) => {
//       const parsedData = JSON.parse(data);
//       setRealTimeData(parsedData);
//     });

//     return () => socket.disconnect();
//   }, []);

//   useEffect(() => {
//     console.log("📌 Data received:", realTimeData);
//   }, [realTimeData]); // This runs every time realTimeData updates

//   // const fetchSensorData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await fetch(`${SERVER_URL}/api/sensor-data`);
//   //     const data = await response.json();
//   //     setSensorData(data);
//   //   } catch (error) {
//   //     Alert.alert("Error", "Failed to fetch sensor data.");
//   //     console.error(error);
//   //   }
//   //   setLoading(false);
//   // };

//   useEffect(() => {
//     // fetchSensorData();
//   }, []);

//   const SensorCard = ({ data }) => (
//     <View style={styles.card}>
//       <Text style={styles.timestamp}>
//         {new Date(data.timestamp).toLocaleString()}
//       </Text>
//       <Text>
//         Acceleration: X: {data.acceleration.x}, Y: {data.acceleration.y}, Z:{" "}
//         {data.acceleration.z}
//       </Text>
//       <Text>
//         Gyroscope: X: {data.gyroscope.x}, Y: {data.gyroscope.y}, Z:{" "}
//         {data.gyroscope.z}
//       </Text>
//       <Text>Temperature: {data.temperature}°C</Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Sensor Data</Text>

//       {/* <TouchableOpacity onPress={fetchSensorData} style={styles.button}> */}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Fetch Historical Data</Text>
//       </TouchableOpacity>

//       {loading ? (
//         <ActivityIndicator size="large" color="#3498db" />
//       ) : (
//         sensorData.map((data, index) => <SensorCard key={index} data={data} />)
//       )}

//       {realTimeData ? (
//         <View style={styles.realTimeContainer}>
//           <Text style={styles.realTimeHeader}>Real-Time Data</Text>
//           <SensorCard data={realTimeData} />
//         </View>
//       ) : (
//         <Text>No real-time data</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
//   header: {
//     paddingTop: 25,
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: "#3498db",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonText: { color: "#fff", fontSize: 16 },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   timestamp: { fontWeight: "bold", marginBottom: 5 },
//   realTimeContainer: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#eaf7ff",
//     borderRadius: 5,
//   },
//   realTimeHeader: { fontSize: 20, fontWeight: "bold", color: "#007aff" },
// });

// export default App;
