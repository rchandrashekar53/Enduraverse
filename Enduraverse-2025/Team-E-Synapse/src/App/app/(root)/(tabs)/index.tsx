import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { ProgressCircle } from "react-native-svg-charts"; // Use this for speedometer-like gauges

import icons from "@/constants/icons";

import Search from "@/components/Search";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import { Card } from "@/components/Cards";

import { useAppwrite } from "@/lib/useappwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";

const Home = () => {
  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: properties, refetch, loading } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [safetyScore, setSafetyScore] = useState<number>(45); // Example safety score
  const [speed, setSpeed] = useState<number>(0); // Placeholder speed value

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    });
  }, [params.filter, params.query]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Set speed if available
      if (location.coords.speed) {
        setSpeed(Math.round(location.coords.speed * 3.6)); // Convert m/s to km/h
      }
    })();
  }, []);

  const handleCardPress = (id: string) => router.push(`/parameters/${id}`);

  const getProgressColor = (progress: number) => {
    if (progress >= 0.75) return "#4caf50";
    if (progress > 0.60) return "yellow";
    return "red";
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            {/* Greeting Section */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>

            <Search />

            {/* Map Section */}
            <View className="my-5">
              <Text className="text-xl font-rubik-bold text-black-300">
                Most Important Parameters
              </Text>
              {location ? (
                <MapView
                  style={{ width: "100%", height: 200, marginTop: 10 }}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title="You are here"
                    image={icons.carPark}
                  />
                </MapView>
              ) : errorMsg ? (
                <Text className="text-base font-rubik text-red-500 mt-5">
                  {errorMsg}
                </Text>
              ) : (
                <ActivityIndicator
                  size="large"
                  className="text-primary-300 mt-5"
                />
              )}

              {/* Safety Score and Speed Section */}
              <View className="flex flex-col items-center mt-5">
                <ProgressCircle
                  style={{ height: 150, width: 150 }}
                  progress={safetyScore / 100}
                  progressColor={getProgressColor(safetyScore / 100)}
                  backgroundColor={"#e0e0e0"}
                  startAngle={-Math.PI * 0.8}
                  endAngle={Math.PI * 0.8}
                />
                <Text className="text-xl font-rubik-bold text-black-300 mt-3">
                  Safety Score: {safetyScore}%
                </Text>
                <View className="flex flex-row items-center justify-between mt-3 w-full px-5">
                  <Text className="text-base font-rubik-medium text-black-300">
                    Speed: {speed} km/h
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    Mileage: -- km/l
                  </Text>
                </View>
              </View>
            </View>

            {/* Recommendation Section */}
            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
