import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserProfile = async (userId) => {
  try {
    let token = await AsyncStorage.getItem("UserToken");
    let data = await fetch(`${API_URL}/user/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
    return data;
  } catch (error) {
    console.error("error: ", error);
  }
};

export { getUserProfile, getMyProfile };
