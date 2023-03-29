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

  // Fetch Delete Answer
  const fetchDeleteAnswer = async (answerId) => {
    Alert.alert(
      "Delete Answer",
      "Are you sure to delete this answer?",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await deleteAnswer(answerId);
            if (response.success == true) {
              setAnswersAndVotes((item) =>
                item.filter((answer) => answer.answer.id != answerId),
              );
              Alert.alert("Delete answer successfully.");
            } else {
              Alert.alert("Delete answer failure.");
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog.",
          ),
      },
    );
  };

  // Fetch Delete Question
  const fetchDeleteQuestion = async () => {
    Alert.alert(
      "Delete Question",
      "Are you sure to delete this question?",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            let token = await AsyncStorage.getItem("UserToken");
            const response = await deleteQuestion(token, questionId);
            if (response.success == true) {
              navigation.navigate("Home");
            } else {
              Alert.alert("Delete question failure.");
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog.",
          ),
      },
    );
  };

  const fetchVoteAndUnvoteAnswer = async (status, answerId) => {
    let token = await AsyncStorage.getItem("UserToken");

    const response = await voteAndUnvoteAnswer(token, answerId, status);
    if (response.success == true) {
      fetchGetAllAnswersAndVotings(questionId, page, 5);
      // setAnswersAndVotes((answersAndVotes) => {
      //   return answersAndVotes.map((item) => {
      //     if (item.answer.id === answerId) {
      //       let t = status == 0 ? 1 : status == 1 ? -1 : 0
      //       return {
      //         ...item,
      //         minus_upvote_downvote: item.minus_upvote_downvote + status ,
      //       };
      //     }
      //   });
      // });
    } else {
      Alert.alert(
        "There is an error occurs. Please reload to proceed this action.",
      );
    }
  };

  // Fetch get all answer and voting
  const fetchGetAllAnswersAndVotings = async (questionId, page, limit) => {
    const data = await getAllAnswersAndVotings(questionId, page, limit);
    if (data.question) {
      setQuestion(data.question);
      setCountAnswer(data.answers.count);
      setAnswersAndVotes(data.answers.data);
      setPage(page);
      setLimit(limit);
      return true;
    } else return false;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let res = await fetchGetAllAnswersAndVotings(questionId, 0, 5);
      if (res == false) navigation.pop();
    });

    return () => {
      unsubscribe();
      setQuestion(null);
      setCountAnswer(0);
      setAnswersAndVotes([]);
      setPage(0);
      setLimit(0);
    };
  }, []);

  if (!question || !userData) return null;
