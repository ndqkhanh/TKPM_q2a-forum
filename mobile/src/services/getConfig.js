import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getConfiguration = async () => {
  try {
    let token = await AsyncStorage.getItem("UserToken");
    let data = await fetch(`${API_URL}/admin/list-configuration`, {
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
  return null;
};

export { getConfiguration };
