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
  ToastAndroid,
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
              fetchGetAllAnswersAndVotings(questionId, page, limit);
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

  if (!question || !userData) return <></>;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <View style={styles.headerContainer}>
        <TouchableHighlight
          onPress={() => navigation.pop()}
          style={{
            position: "absolute",
            alignSelf: "center",
            left: 0,
          }}
          underlayColor={"transparent"}
        >
          <Icon name="arrow-back-outline" style={styles.back} />
        </TouchableHighlight>

        <Text style={styles.header}>{question.questionInfo.title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        style={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Post
          dateText={formatDistance(
            new Date(question.questionInfo.updated_at),
            Date.now(),
            { addSuffix: true },
          )}
          content={question.questionInfo.content}
          userData={{
            name: question.name,
            avatarUrl: question.avatarUrl,
          }}
          onDelete={
            userData.id == question.questionInfo.uid
              ? fetchDeleteQuestion
              : null
          }
          onUpdate={
            userData.id == question.questionInfo.uid
              ? () =>
                  navigation.navigate("Editor", {
                    update: true,
                    qid: questionId,
                    Content: question.questionInfo.content,
                    Title: question.questionInfo.title,
                  })
              : null
          }
        />

        <View style={styles.answerContainer}>
          <Text style={styles.numOfAnswers}>{countAnswer} answers</Text>
        </View>

        <Q2APagination
          page={page + 1}
          maxPage={Math.ceil(countAnswer / limit)}
          pressPrev={() => pressPrev()}
          pressNext={() => pressNext()}
        />
        {answersAndVotes.map((item, index) => (
          <Post
            voting={item.minus_upvote_downvote}
            key={index}
            correctAnswer={item.answer.correct}
            dateText={formatDistance(
              new Date(item.answer.updated_at),
              Date.now(),
              { addSuffix: true },
            )}
            content={item.answer.content}
            userData={{
              name: item.name,
              avatarUrl: item.profilepictureurl,
            }}
            votingStatus={item.voting_status}
            onPickCorrectAnswer={
              userData.id == question.questionInfo.uid
                ? () => {
                    if (item.answer.correct != true) {
                      fetchPickACorrectAnswer(item.answer.id, true);
                    } else {
                      fetchPickACorrectAnswer(item.answer.id, false);
                    }
                    ToastAndroid.show(
                      "Picked successfully",
                      ToastAndroid.SHORT,
                    );
                  }
                : null
            }
            onUpVote={() => fetchVoteAndUnvoteAnswer(0, item.answer.id)}
            onDownVote={() => fetchVoteAndUnvoteAnswer(1, item.answer.id)}
            onUnVote={() => fetchVoteAndUnvoteAnswer(2, item.answer.id)}
            onDelete={
              userData.id == item.answer.uid
                ? () => {
                    setAnswerId(item.answer.id);
                    fetchDeleteAnswer(item.answer.id);
                  }
                : null
            }
            onUpdate={
              userData.id == item.answer.uid
                ? () =>
                    navigation.navigate("Post answer", {
                      update: true,
                      aid: item.answer.id,
                      Content: item.answer.content,
                    })
                : null
            }
          />
        ))}
      </ScrollView>
      <View style={{ backgroundColor: Colors.cyan70 }}>
        <TouchableOpacity
          style={styles.newAnswer}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("Post answer", { qid: questionId });
          }}
        >
          <View style={styles.btnPage}>
            <Text style={styles.btnTextPage}>Write answer</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 5,
    justifyContent: "flex-start",
    position: "relative",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blue40,
    marginStart: 40,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.cyan70,
  },
  back: {
    fontSize: 30,
    color: Colors.cyan10,
  },
  answerContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    marginTop: 20,
  },
  numOfAnswers: {
    fontWeight: "bold",
    fontSize: 23,
    color: Colors.blue40,
  },
  btnPage: {
    backgroundColor: Colors.blue40,
    paddingVertical: 5,
    width: 150,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnTextPage: {
    fontWeight: "bold",
    fontSize: 15,
    color: Colors.white,
  },
  newAnswer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
export default ScreensQ2AMain;
