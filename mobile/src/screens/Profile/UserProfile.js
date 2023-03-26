import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { formatDistance } from "date-fns";
import { Avatar, Card, Colors, Text, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import PersonalInfo from "~components/Profile/personalInfo";
import { getMyProfile, getUserProfile } from "~services/getProfile";
import { updateUserInformation, getMyQuestions } from "~services/user";
import { UserContext } from "~provider/UserProvider";
import { is_empty, is_URL } from "~utils/string";
import Post from "~components/Common/Post";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 100;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const ProfileScreen = ({ navigation, route }) => {
  const param = route.params;
  let userId = null;
  if (param != null) {
    userId = param.uid;
  }
  //console.log("--uid: ", userId)
  const { userData, setUserData, fetchUserInformation } =
    useContext(UserContext);
  //console.log("--user: ", userData)
  const [pendingData, setPendingData] = useState(userData);
  // console.log("pendingData", pendingData);
  const [anotherUserData, setAnotherUserData] = useState({});
  // const [userData, setUserData] = useState({});
  const [myQuestionsData, setMyQuestionsData] = useState([]);
  const [maxLength, setMaxLength] = useState(0);
  const [page, setPage] = useState(0);
  const [refetch, setRefetch] = useState(false);
  const fetchUserProfile = async (userId) => {
    let data;
    if (userId != null) {
      data = await getUserProfile(userId);
    }
    // else {
    //   data = await getMyProfile(token);
    // }
    //console.log("--AnotherUser: ", data)
    if (data) setAnotherUserData(data);
  };
  const limit = 5;
  const fetchMyQuestions = async (page, limit) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getMyQuestions(token, page, limit);
    //console.log("--questions: ", data.questions)
    var maxLength = 5;
    try {
      maxLength = parseInt(data.count);
    } catch (error) {
      console.error("error---", error);
    }
    setMaxLength(maxLength);
    setMyQuestionsData((myQuestionsData) => [
      ...myQuestionsData,
      ...data.questions,
    ]);
    setPage((page) => page + 1);
    setRefetch(false);
  };
  
