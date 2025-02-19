import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SERVER_URL = "http://192.168.80.19:3000"; // Change this to your server IP

const HistoricalScreen = ({ navigation }) => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoricalData(); // Fetch initially

    const interval = setInterval(fetchHistoricalData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/sensor-data`);
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error("❌ Error fetching historical data:", error);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#1e3c72", "#2a5298"]}
      style={{ flex: 1, padding: 20 }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        📜 Historical Sensor Data
      </Text>

      {loading ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
            Fetching Data...
          </Text>
        </View>
      ) : (
        <ScrollView>
          {sensorData.length > 0 ? (
            sensorData.map((data, index) => (
              <SensorCard key={index} data={data} />
            ))
          ) : (
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              No historical data available.
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: "#ff9800",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          ⬅️ Back to Real-Time Data
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const SensorCard = ({ data }) => (
  <View
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      padding: 15,
      borderRadius: 15,
      marginBottom: 10,
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold", marginBottom: 5 }}>
      {new Date(data.timestamp).toLocaleString()}
    </Text>
    <SensorItem
      icon="speedometer"
      label="Acceleration X"
      value={data.acceleration.x}
      unit="m/s²"
    />
    <SensorItem
      icon="speedometer"
      label="Acceleration Y"
      value={data.acceleration.y}
      unit="m/s²"
    />
    <SensorItem
      icon="speedometer"
      label="Acceleration Z"
      value={data.acceleration.z}
      unit="m/s²"
    />
    <View
      style={{
        height: 1,
        backgroundColor: "white",
        marginVertical: 5,
        opacity: 0.4,
      }}
    />
    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope X"
      value={data.gyroscope.x}
      unit="°/s"
    />
    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope Y"
      value={data.gyroscope.y}
      unit="°/s"
    />
    <SensorItem
      icon="rotate-3d-variant"
      label="Gyroscope Z"
      value={data.gyroscope.z}
      unit="°/s"
    />
    <View
      style={{
        height: 1,
        backgroundColor: "white",
        marginVertical: 5,
        opacity: 0.4,
      }}
    />
    <SensorItem
      icon="thermometer"
      label="Temperature"
      value={data.temperature}
      unit="°C"
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

export default HistoricalScreen;
