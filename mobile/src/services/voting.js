import { API_URL } from "@env";

const voteAndUnvoteAnswer = async (token, answerId, status) => {
  try {
    // let token = await AsyncStorage.getItem("UserToken");
    let data = await fetch(`${API_URL}/voting/${answerId}`, {
      method: "POST",
      body: JSON.stringify({
        status,
      }),
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

export { voteAndUnvoteAnswer };
