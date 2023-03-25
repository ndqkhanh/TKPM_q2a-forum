import React, { useEffect } from "react";
import { View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const BlankScreen = ({ navigation }) => {
  const onSignIn = () => {
    navigation.navigate("login_screen");
  };
  useEffect(() => {
    getStorageToken();
  }, []);
  const getStorageToken = async () => {
    try {
      storageToken = await AsyncStorage.getItem("UserToken");
      let responseCheckToken = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storageToken}`,
        },
      });
      const mjson = await responseCheckToken.json();
      if (mjson.hasOwnProperty("id")) {
        navigation.navigate("Home");
      } else onSignIn();
    } catch (error) {
      console.log("error", error);
    }
  };

  return <View></View>;
};

export default BlankScreen;
