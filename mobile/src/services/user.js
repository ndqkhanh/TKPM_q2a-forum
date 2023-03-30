import { API_URL } from "@env";

const updateUserInformation = async (token, body) => {
  try {
    // let token = await AsyncStorage.getItem("UserToken");
    let data = await fetch(`${API_URL}/user`, {
      method: "POST",
      body: JSON.stringify(body),
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
};

export { updateUserInformation};
