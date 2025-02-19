// components/TelematicsDisplay.js
import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { saveTelematicsData } from "../firebaseConfig"; // Import the function from firebase.js

const TelematicsDisplay = () => {
  // Sample data
  const [data, setData] = useState({
    timestamp: new Date().toISOString(),
    acceleration: {
      x: Math.random().toFixed(2), // Random data for X-axis
      y: Math.random().toFixed(2), // Random data for Y-axis
      z: Math.random().toFixed(2), // Random data for Z-axis
    },
    derivedMetrics: {
      suddenBraking: Math.random() < 0.5,
      harshAcceleration: Math.random() < 0.5,
      sharpTurns: Math.random() < 0.5,
      impactDetection: Math.random() < 0.5,
    },
    gps: {
      latitude: (Math.random() * 180 - 90).toFixed(5), // Random latitude between -90 and 90
      longitude: (Math.random() * 360 - 180).toFixed(5), // Random longitude between -180 and 180
    },
    speed: (Math.random() * 100).toFixed(2), // Random speed between 0 and 100
  });

  // Function to handle the button click
  const handleSaveData = () => {
    saveTelematicsData(data); // Save the data to Firestore
  };

  return (
    <View>
      <Text>
        Acceleration (X, Y, Z): {data.acceleration.x}, {data.acceleration.y},{" "}
        {data.acceleration.z}
      </Text>
      <Text>Speed: {data.speed} km/h</Text>
      <Text>
        GPS: {data.gps.latitude}, {data.gps.longitude}
      </Text>
      <Text>Timestamp: {data.timestamp}</Text>
      <Text>
        Sudden Braking: {data.derivedMetrics.suddenBraking ? "Yes" : "No"}
      </Text>
      <Text>
        Harsh Acceleration:{" "}
        {data.derivedMetrics.harshAcceleration ? "Yes" : "No"}
      </Text>
      <Text>Sharp Turns: {data.derivedMetrics.sharpTurns ? "Yes" : "No"}</Text>
      <Text>
        Impact Detection: {data.derivedMetrics.impactDetection ? "Yes" : "No"}
      </Text>

      <Button title="Save Data to Firestore" onPress={handleSaveData} />
    </View>
  );
};

export default TelematicsDisplay;
