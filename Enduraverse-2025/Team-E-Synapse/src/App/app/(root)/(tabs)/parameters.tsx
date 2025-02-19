import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const safetyParameters = [
  {
    id: "1",
    parameter: "Braking",
    description: "Measures the severity of braking events.",
    score: "Moderate",
  },
  {
    id: "2",
    parameter: "Acceleration",
    description: "Measures the severity of acceleration events.",
    score: "Severe",
  },
  {
    id: "3",
    parameter: "Cornering",
    description: "Measures the severity of cornering events.",
    score: "Mild",
  },
  {
    id: "4",
    parameter: "Speeding",
    description: "Measures the frequency and severity of speeding events.",
    score: "Low",
  },
];

const renderParameterItem = ({ item }: { item: { id: string; parameter: string; description: string; score: string } }) => (
  <View className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
    <View className="flex-1">
      <Text className="text-lg font-bold">{item.parameter}</Text>
      <Text className="text-sm text-gray-500 pl-5 justify-center align-middle">{item.description}</Text>
    </View>
    <Text className="text-sm font-bold text-primary-300 align-middle">{item.score}</Text>
  </View>
);

const Parameters = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-black-300">Safety Parameters</Text>
        <FlatList
          data={safetyParameters}
          renderItem={renderParameterItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pb-4"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Parameters;
