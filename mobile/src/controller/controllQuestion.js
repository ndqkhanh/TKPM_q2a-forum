import { Alert } from "react-native";
import {
  postQuestion,
  searchQuestion,
  updateQuestion,
} from "~services/Question";
const controllPostQuestion = async (passTitle, passContent) => {
  try {
    let message = await postQuestion(passTitle, passContent);
    Alert.alert(message.header, JSON.stringify(message.content));
  } catch (error) {
    return null;
    // console.log(error);
    // Alert.alert("error", error);
  }
};
const controllsSearchQuestion = async (keyword, page, limit) => {
  try {
    let res = await searchQuestion(keyword, page, limit);

    if (res.hasOwnProperty("questions")) {
      //alert(JSON.stringify(res));
      //console.log(res)
      return res;
    } else {
      Alert.alert(message.header, JSON.stringify(message.content));
      return null;
    }
  } catch (error) {
    return null;
    // console.log(error);
    // Alert.alert("error", error);
  }
};

