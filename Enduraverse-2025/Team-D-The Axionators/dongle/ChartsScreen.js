import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const SERVER_URL = "ws://192.168.80.19:3000";

const MAX_POINTS = 30; // Fixed window size (30s)
const CHART_WIDTH = Dimensions.get("window").width - 40; // Fixed width
const CHART_HEIGHT = 250; // Fixed height

const GraphScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(SERVER_URL);
    socket.onopen = () => console.log("✅ Connected to WebSocket Server");

    socket.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        const timestamp = Math.floor(new Date().getTime() / 1000); // Time in seconds

        setData((prevData) => {
          const updatedData = [
            ...prevData,
            {
              x: timestamp,
              y: jsonData.acceleration.x,
              y2: jsonData.acceleration.y,
              y3: jsonData.acceleration.z,
            },
          ];

          return updatedData.length > MAX_POINTS
            ? updatedData.slice(1) // Shift window forward
            : updatedData;
        });
      } catch (err) {
        console.error("❌ Error parsing WebSocket data:", err);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket connection closed");
    return () => socket.close();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFD700",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        📊 Real-Time Acceleration Data
      </Text>

      <View
        style={{
          width: CHART_WIDTH,
          height: CHART_HEIGHT,
          backgroundColor: "#1e1e1e",
          borderRadius: 15,
          padding: 15,
          shadowColor: "#FFD700",
          shadowOpacity: 0.4,
          shadowRadius: 10,
        }}
      >
        <LineChart
          data={data.map((d) => ({ value: d.y, label: `${d.x % 60}s` }))}
          data2={data.map((d) => ({ value: d.y2, label: `${d.x % 60}s` }))}
          data3={data.map((d) => ({ value: d.y3, label: `${d.x % 60}s` }))}
          width={CHART_WIDTH} // Fixed width
          height={CHART_HEIGHT} // Fixed height
          color1="#FF3D00" // X (Red)
          color2="#00E676" // Y (Green)
          color3="#2979FF" // Z (Blue)
          thickness={3}
          xAxisLabelTextStyle={{ color: "#A0A0A0", fontSize: 12 }}
          yAxisLabelTextStyle={{ color: "#A0A0A0", fontSize: 12 }}
          xAxisColor="white"
          yAxisColor="white"
          yAxisLabelSuffix=" m/s²"
          hideRules
          scrollable
          initialSpacing={0}
          scrollToEnd
          isAnimated
          animationDuration={400}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: CHART_WIDTH,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#FFD700", fontSize: 16 }}>Time (s)</Text>
        <Text style={{ color: "#FFD700", fontSize: 16 }}>
          Acceleration (m/s²)
        </Text>
      </View>
    </View>
  );
};

export default GraphScreen;
