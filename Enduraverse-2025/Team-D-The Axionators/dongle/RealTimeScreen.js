import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";

const SERVER_URL = "ws://192.168.80.19:3000";
const API_URL = "http://192.168.80.19:3000/api/sensor-data";

const RealTimeScreen = ({ navigation }) => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const socketRef = useRef(null);
  const locationRef = useRef(null);

  // useEffect(() => {
  //   const fetchHistoricalData = async () => {
  //     try {
  //       const response = await axios.get(API_URL);
  //       setHistoricalData(response.data.slice(0, 5));
  //     } catch (error) {
  //       console.error("❌ Error fetching historical data:", error);
  //     }
  //   };

  //   const getLocation = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //     let loc = await Location.getCurrentPositionAsync({});
  //     setLocation(loc.coords);
  //   };

  //   fetchHistoricalData();
  //   getLocation();

  //   const locationSubscription = Location.watchPositionAsync(
  //     {
  //       accuracy: Location.Accuracy.High,
  //       timeInterval: 1000,
  //       distanceInterval: 1,
  //     },
  //     (loc) => setLocation(loc.coords)
  //   );

  //   const socket = new WebSocket(SERVER_URL);
  //   socket.onopen = () => console.log("✅ Connected to WebSocket Server");

  //   socket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       console.log("📌 Data received:", data);

  //       // Append real-time location data
  //       const updatedData = {
  //         ...data,
  //         location: location
  //           ? {
  //               lat: location.latitude,
  //               lon: location.longitude,
  //               alt: location.altitude,
  //             }
  //           : null,
  //       };

  //       setRealTimeData(updatedData);

  //       // if (data?.alert && data.alert !== "None") {
  //       //   Alert.alert("🚨 Alert", data.alert);
  //       // }

  //       setHistoricalData((prevData) => [updatedData, ...prevData.slice(0, 4)]);
  //     } catch (err) {
  //       console.error("❌ Error parsing WebSocket data:", err);
  //     }
  //   };

  //   socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
  //   socket.onclose = () => console.log("❌ WebSocket connection closed");

  //   return () => {
  //     socket.close();
  //     locationSubscription.then((sub) => sub.remove());
  //   };
  // }, [location]);
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(API_URL);
        setHistoricalData(response.data.slice(0, 5));
      } catch (error) {
        console.error("❌ Error fetching historical data:", error);
      }
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      locationRef.current = loc.coords; // Store in ref for real-time updates
    };

    fetchHistoricalData();
    getLocation();

    const locationSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000, // Update every second
        distanceInterval: 1, // Update when moving at least 1 meter
      },
      (loc) => {
        setLocation(loc.coords);
        locationRef.current = loc.coords; // Store latest location in ref
      }
    );

    if (!socketRef.current) {
      socketRef.current = new WebSocket(SERVER_URL);

      socketRef.current.onopen = () =>
        console.log("✅ Connected to WebSocket Server");

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📌 Data received:", data);

          // Append real-time location data without triggering re-renders
          const updatedData = {
            ...data,
            location: locationRef.current
              ? {
                  lat: locationRef.current.latitude,
                  lon: locationRef.current.longitude,
                  alt: locationRef.current.altitude,
                }
              : null,
          };

          setRealTimeData(updatedData);
          setHistoricalData((prevData) => [
            updatedData,
            ...prevData.slice(0, 4),
          ]);
        } catch (err) {
          console.error("❌ Error parsing WebSocket data:", err);
        }
      };

      socketRef.current.onerror = (error) =>
        console.error("❌ WebSocket Error:", error);
      socketRef.current.onclose = () =>
        console.log("❌ WebSocket connection closed");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      locationSubscription.then((sub) => sub.remove());
    };
  }, []); // ❌ `location` removed from dependencies

  return (
    <LinearGradient
      colors={["#1e3c72", "#2a5298"]}
      style={{ flex: 1, padding: 20 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          🚀 Real-Time Sensor Data
        </Text>

        {realTimeData ? (
          <SensorCard data={realTimeData} isRealTime={true} />
        ) : (
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
              Waiting for Data...
            </Text>
          </View>
        )}

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          📜 Last 5 Historical Records
        </Text>

        {historicalData.length > 0 ? (
          historicalData
            .slice(1, 6)
            .map((item, index) => (
              <SensorCard key={index} data={item} timestamp={item.timestamp} />
            ))
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
              No historical data available.
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Historical")}
          style={{
            backgroundColor: "#ff9800",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            📜 Fetch Historical Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Graph")}
          style={{
            backgroundColor: "#ff5722",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            📊 View Real-Time Graph
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const SensorCard = ({ data, timestamp, isRealTime }) => (
  <View
    style={{
      backgroundColor: isRealTime
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(255, 255, 255, 0.1)",
      padding: 20,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      marginBottom: 10,
    }}
  >
    {timestamp && (
      <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
        🕒 {new Date(timestamp).toLocaleString()}
      </Text>
    )}

    <SensorItem
      icon="map-marker"
      label="Latitude"
      value={data.location?.lat?.toFixed(6)}
      unit=""
    />
    <SensorItem
      icon="map-marker"
      label="Longitude"
      value={data.location?.lon?.toFixed(6)}
      unit=""
    />
    <SensorItem
      icon="altimeter"
      label="Altitude"
      value={data.location?.alt?.toFixed(2) || "N/A"}
      unit="m"
    />

    <View
      style={{
        height: 1,
        backgroundColor: "white",
        marginVertical: 10,
        opacity: 0.4,
      }}
    />

    <SensorItem
      icon="speedometer"
      label="Acceleration X"
      value={data.acceleration?.x}
      unit="m/s²"
    />
    <SensorItem
      icon="speedometer"
      label="Acceleration Y"
      value={data.acceleration?.y}
      unit="m/s²"
    />
    <SensorItem
      icon="speedometer"
      label="Acceleration Z"
      value={data.acceleration?.z}
      unit="m/s²"
    />

    <View
      style={{
        height: 1,
        backgroundColor: "white",
        marginVertical: 10,
        opacity: 0.4,
      }}
    />

    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope X"
      value={data.gyroscope?.x}
      unit="°/s"
    />
    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope Y"
      value={data.gyroscope?.y}
      unit="°/s"
    />
    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope Z"
      value={data.gyroscope?.z}
      unit="°/s"
    />
    <View
      style={{
        height: 1,
        backgroundColor: "white",
        marginVertical: 10,
        opacity: 0.4,
      }}
    />

    <SensorItem
      icon="rotate-3d-variant"
      label="Temperature"
      value={data?.temperature}
      unit="°/s"
    />
  </View>
);

const SensorItem = ({ icon, label, value, unit }) => (
  <View
    style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}
  >
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color="white"
      style={{ marginRight: 10 }}
    />
    <Text style={{ color: "white", fontSize: 18, fontWeight: "600", flex: 1 }}>
      {label}
    </Text>
    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
      {value} {unit}
    </Text>
  </View>
);

export default RealTimeScreen;
