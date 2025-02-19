import { View, Text, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import icons from "@/constants/icons";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";

const SignIn = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handlelogin = async () => {
    const result = await login();
    if (result) {
      refetch({});
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Image source={images.onboarding} className="w-full h-4/6" resizeMode="contain"/>
            <View className="px-10">
              <Text className="text-base text-center uppercase font-sans font-bold text-black-200 ">WELCOME TO ENDURIDE</Text>
              <Text className="text-3xl font-serif font-bold text-black-300 text-center mt-4">
                Let's Get Started {"\n"}
                <Text className="text-blue-500">
                With Your Saftey
                </Text>
              </Text>
              <Text className="text-lg font-sans text-black text-center mt-12">
                Login To Enduride with Google
              </Text>
              
              <TouchableOpacity onPress={handlelogin} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
                <View className="flex flex-row items-center justify-center">
                  <Image source={icons.google} className="w-5 h-5" resizeMode="contain" />
                  <Text className="text-lg font-sans-medium text-black-300 ml-2">Continue With Google</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerClassName="h-full"
      />
    </SafeAreaView>
  );
};

export default SignIn;
