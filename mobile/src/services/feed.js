// import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { Alert } from "react-native";

const getFeed = async (token, page) => {
  try {
    let data = await fetch(`${API_URL}/question/feed/${page}`, {
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
    console.error("error---", error);
  }
  return null;
};

export { getFeed };
