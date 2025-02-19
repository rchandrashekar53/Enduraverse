import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const SafteyParameters = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Safety Parameters {id}</Text>
    </View>
  );
};

export default SafteyParameters;
