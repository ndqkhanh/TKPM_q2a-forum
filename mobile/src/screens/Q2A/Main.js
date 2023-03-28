import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "~components/Common/Post";
import Q2APagination from "~components/Q2A/Pagination";
import { UserContext } from "~provider/UserProvider";
import {
  deleteAnswer,
  getAllAnswersAndVotings,
  pickACorrectAnswer,
} from "~services/answer";
import { voteAndUnvoteAnswer } from "~services/voting";
import { deleteQuestion } from "~services/Question";

const ScreensQ2AMain = ({ navigation, route }) => {
  const { questionId } = route.params;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);

  const [question, setQuestion] = useState(null);
  const [countAnswer, setCountAnswer] = useState(0);
  const [answersAndVotes, setAnswersAndVotes] = useState([]);
  const [answerId, setAnswerId] = useState("");

  // Use context to get userdata
  const { userData } = useContext(UserContext);

  // Previous pagination
  const pressPrev = () => {
    page - 1 >= 0
      ? fetchGetAllAnswersAndVotings(questionId, page - 1, limit)
      : null;
  };
  // Next pagination
  const pressNext = () => {
    page + 1 < Math.ceil(countAnswer / limit)
      ? fetchGetAllAnswersAndVotings(questionId, page + 1, limit)
      : null;
  };
  // Fetch Pick correct answer
  const fetchPickACorrectAnswer = async (answerId, status) => {
    const res = await pickACorrectAnswer(answerId, status);
    if (res.success == true) {
      fetchGetAllAnswersAndVotings(questionId, page, limit);
    } else {
      Alert.alert(
        "There is an error occurs. Please reload to proceed this action.",
      );
    }
  };