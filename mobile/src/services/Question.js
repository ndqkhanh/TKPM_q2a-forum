import { API_URL } from "@env";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const postQuestion = async (passTitle, passContent) => {
  let message = {};
  if (passTitle == null || passContent == null) {
    message = {
      header: "Can not post pending question list",
      content: "Missing title or content",
    };
  } else {
    try {
      const token = await AsyncStorage.getItem("UserToken");
      let responsePostQuestion = await fetch(`${API_URL}/question`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `${passTitle}`,
          content: `${passContent}`,
        }),
      });

      const mjson = await responsePostQuestion.json();
      if (mjson.hasOwnProperty("id")) {
        message = {
          header: "Sucess",
          content: "Quesion are in the pending list",
        };
      } else if (mjson.hasOwnProperty("message"))
        message = { header: "Error", content: mjson.message };
      else return null;
    } catch (error) {
      message = { header: "Error", content: error };
      console.log(error);
    }
  }
  return message;
};

const searchQuestion = async (keyword, page, limit) => {
    let message = {};
    if (keyword == null || keyword == "") {
        return null;
    } else {
        try {
            const token = await AsyncStorage.getItem("UserToken");
            let responseSearchQuestion = await fetch(
                `${API_URL}/question/search/${page}/${limit}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        keyword: `${keyword}`,
                    }),
                },
            );

            const mjson = await responseSearchQuestion.json();
            if (mjson.hasOwnProperty("questions")) {
                //alert(JSON.stringify(mjson))
                return mjson;
            } else if (mjson.hasOwnProperty("message"))
                message = { header: "Error", content: mjson.message };
            else return null;
        } catch (error) {
            message = { header: "Error", content: error };
            console.log(error);
        }
    }
    return message;
};

const deleteQuestion = async (token, questionId) => {
    try {
        let data = await fetch(`${API_URL}/question/${questionId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        data = await data.json();
        return data;
    } catch (error) {
        console.log("error", error);
        Alert.alert("error", error.message);
    }
    return null;
};

export { postQuestion, searchQuestion, deleteQuestion};
