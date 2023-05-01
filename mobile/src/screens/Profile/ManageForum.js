import React, { useState, useContext, useEffect } from "react";
import { View, Text, Avatar, Card, Colors } from "react-native-ui-lib";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Touchable,
  TouchableHighlight,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "~provider/UserProvider";
import PendingQuestion from "~components/Common/PendingQuestionList";
import User from "~components/Common/UserList";
import { formatDistance } from "date-fns";
import {
  approveDeclineQuestionController,
  getListConfigurationsController,
  getMetricsController,
  getPendingQuestionsController,
  getUsersController,
  updateConfigurationController,
  banUserController,
} from "~controller/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { is_empty } from "~utils/string";
import { ConfigContext } from "~provider/ConfigProvider";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 280;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const getUnique = (arr, index) => {
  const unique = arr
    .map((e) => e[index])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
};

const ManageForumScreen = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const { fetchConfigInformation } = useContext(ConfigContext);
  const [isPressed, setIsPressed] = useState([true, false, false]);
  const questionsPressed = () => {
    setIsPressed([true, false, false]);
  };
  const usersPressed = () => {
    setIsPressed([false, true, false]);
  };
  const configPressed = () => {
    setIsPressed([false, false, true]);
  };
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [numOfUsers, setNumOfUsers] = useState(0);
  const [numOfAnswers, setNumOfAnswers] = useState("0");
  const [configNumOfQuestionInFeed, setConfigNumOfQuestionInFeed] =
    useState("0");
  const [configForumName, setConfigForumName] = useState("");

  const fetchMetricsInformation = async () => {
    let token = await AsyncStorage.getItem("UserToken");
    const metricsData = await getMetricsController(token);
    setNumOfQuestions(metricsData.numOfQuestions);
    setNumOfUsers(metricsData.numOfUsers);
    setNumOfAnswers(metricsData.numOfAnswers);
  };

  const [maxPendingQuestionsLength, setMaxPendingQuestionsLength] = useState(0);
  const [pendingQuestionsPage, setPendingQuestionsPage] = useState(0);
  const [pendingQuestionsData, setPendingQuestionsData] = useState([]);
  const [configuration, setConfiguration] = useState({});
  const fetchConfigurations = async () => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getListConfigurationsController(token);
    let obj = {};
    data.forEach((config) => {
      obj[config.slug] = config.value;
    });

    setConfigNumOfQuestionInFeed(obj.NUM_OF_QUESTIONS_IN_FEED);
    setConfigForumName(obj.FORUM_NAME);
    setConfiguration(obj);
  };
  const fetchPendingQuestions = async (page, limit) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getPendingQuestionsController(token, page, limit);
    let maxLength = parseInt(data.count);
    setMaxPendingQuestionsLength(maxLength);
    let tmp = [...pendingQuestionsData, ...data.data];
    let uniqueData = await getUnique(tmp, "id").filter((e) => e.status === 0);
    setPendingQuestionsData(uniqueData);
    setPendingQuestionsPage((pendingQuestionsPage) => pendingQuestionsPage + 1);
    setRefetch(false);
  };

  const [maxUsersLength, setMaxUsersLength] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const fetchUsers = async (page, limit) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getUsersController(token, page, limit);
    var maxLength = 5;
    try {
      maxLength = parseInt(data.count);
    } catch (e) {
      console.log(e);
    }
    setMaxUsersLength(maxLength);
    setUsersData((usersData) => [...usersData, ...data.data]);
    setUsersPage((usersPage) => usersPage + 1);
    setRefetch(false);
  };

  const onUpdateConfiguration = async () => {
    if (is_empty(configForumName)) {
      Alert.alert("Forum name can't be empty");
      return;
    }
    if (is_empty(configNumOfQuestionInFeed)) {
      Alert.alert("Number of question can't be empty");
      return;
    }
    if (isNaN(parseInt(configNumOfQuestionInFeed))) {
      Alert.alert("Number of question must be a number");
      return;
    }
    let token = await AsyncStorage.getItem("UserToken");
    let data;
    if (configuration.FORUM_NAME != configForumName) {
      data = await updateConfigurationController(token, "FORUM_NAME", configForumName);
    }
    if (data && !data.success) {
      Alert.alert("Update forum name in feed failure");
    }
    if (configuration.NUM_OF_QUESTIONS_IN_FEED != configNumOfQuestionInFeed) {
      data = await updateConfigurationController(
        token,
        "NUM_OF_QUESTIONS_IN_FEED",
        configNumOfQuestionInFeed,
      );
    }
    if (data && !data.success) {
      Alert.alert("Update number of questions in feed failure");
    } else {
      fetchConfigInformation();
      Alert.alert("Update configuration successfully");
    }
  };

  const fetchApproveDeclineQuestions = async (questionId, status) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await approveDeclineQuestionController(token, questionId, status);
    if (data.success === true) {
      if (status === 0) {
        Alert.alert("Question approved successfully");
      }
      if (status === 1) {
        Alert.alert("Question declined successfully");
      }
      setPendingQuestionsData((pendingQuestionsData) =>
        pendingQuestionsData.filter((item) => item.id !== questionId),
      );
    } else {
      Alert.alert("Question already approved or declined");
    }
  };

  const fetchBanUser = async (userId, status) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await banUserController(token, userId, status);
    if (data.success === true) {
      if (status === false) {
        Alert.alert("User is unbanned successfully");
      }
      if (status === true) {
        Alert.alert("User is banned successfully");
      }
    } else {
      Alert.alert("User already banned or unbanned");
    }
  };

  useEffect(() => {
    if (pendingQuestionsData.length <= 0) {
      fetchPendingQuestions(0, 5);
    }
  }, [pendingQuestionsData]);

  useEffect(() => {
    if (userData.role == 1 || userData.role == 0) {
      fetchPendingQuestions(0, 5);
      fetchUsers(0, 10);
      fetchMetricsInformation();
      userData.role === 0 && fetchConfigurations();
    }

    return () => {
      setNumOfQuestions(0);
      setNumOfAnswers(0);
      setNumOfUsers(0);

      setMaxPendingQuestionsLength(0);
      setPendingQuestionsPage(0);
      setPendingQuestionsData([]);

      setMaxUsersLength(0);
      setUsersPage(0);
      setUsersData([]);

      setIsPressed([true, false, false]);
      setRefetch(false);
    };
  }, []);

  const [refetch, setRefetch] = useState(false);
  if (userData.role == 2)
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text>This screen is only for Moderator or Admin</Text>
        <TouchableHighlight
          onPress={() => navigation.pop()}
          style={{
            width: 100,
            height: 30,
            backgroundColor: Colors.cyan50,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text>Back</Text>
        </TouchableHighlight>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon
            name="arrow-back-outline"
            style={{
              fontSize: 30,
              color: Colors.cyan10,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Manage Forum</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoSection}>
          <Card style={styles.QA_card}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }} center black>
              {numOfQuestions}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }} center black>
              Questions
            </Text>
          </Card>
          <Card style={styles.QA_card}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }} center black>
              {numOfUsers}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }} center black>
              Users
            </Text>
          </Card>
          <Card style={styles.QA_card}>
            <Text style={{ fontWeight: "bold", fontSize: 30 }} center black>
              {numOfAnswers}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }} center black>
              Answers
            </Text>
          </Card>
        </View>
        <View style={styles.infoSection}>
          <TouchableOpacity onPress={questionsPressed}>
            <Card
              style={styles.menu}
              {...(isPressed[0] ? { backgroundColor: Colors.blue60 } : {})}
            >
              <Text black>Pending questions</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity onPress={usersPressed}>
            <Card
              style={styles.menu}
              {...(isPressed[1] ? { backgroundColor: Colors.blue60 } : {})}
            >
              <Text black>Users</Text>
            </Card>
          </TouchableOpacity>
          {userData.role === 0 && (
            <TouchableOpacity onPress={configPressed}>
              <Card
                style={styles.menu}
                {...(isPressed[2] ? { backgroundColor: Colors.blue60 } : {})}
              >
                <Text black>Config</Text>
              </Card>
            </TouchableOpacity>
          )}
        </View>
        {isPressed[0] ? (
          <ScrollView
            key={1}
            style={styles.body}
            onScroll={({ nativeEvent }) => {
              if (
                !refetch &&
                isCloseToBottom(nativeEvent) &&
                pendingQuestionsData.length < maxPendingQuestionsLength
              ) {
                console.log("scrolled to bottom of pending questions");
                setRefetch(true);

                fetchPendingQuestions(pendingQuestionsPage, 5);
              }
            }}
            contentContainerStyle={{
              paddingBottom: 280,
            }}
            showsVerticalScrollIndicator={false}
          >
            {pendingQuestionsData.map((record) => (
              <PendingQuestion
                key={record.id}
                onPressApprove={() => {
                  fetchApproveDeclineQuestions(record.id, 0);
                }}
                onPressDisapprove={() => {
                  fetchApproveDeclineQuestions(record.id, 1);
                }}
                dateText={formatDistance(
                  new Date(record.updated_at),
                  Date.now(),
                  {
                    addSuffix: true,
                  },
                )}
                title={record.title}
                content={record.content}
                userData={{
                  name: record.userData.name,
                  avatarUrl: record.userData.profilepictureurl,
                }}
              />
            ))}
          </ScrollView>
        ) : isPressed[1] ? (
          <ScrollView
            key={2}
            style={styles.body}
            onScroll={({ nativeEvent: event2 }) => {
              if (
                !refetch &&
                isCloseToBottom(event2) &&
                usersData.length < maxUsersLength
              ) {
                console.log("scrolled to bottom users");
                setRefetch(true);
                fetchUsers(usersPage, 10);
              }
            }}
            contentContainerStyle={{
              paddingBottom: 280,
            }}
            showsVerticalScrollIndicator={false}
          >
            {usersData.map((record) => (
              <User
                key={record.id}
                userData={{
                  name: record.name,
                  avatarUrl: record.profilepictureurl,
                }}
                Status={record.disabled}
                pressBan={() => {
                  if (record.disabled === true) {
                    fetchBanUser(record.id, false);
                    record.disabled = false;
                  } else {
                    fetchBanUser(record.id, true);
                    record.disabled = true;
                  }
                }}
              />
            ))}
          </ScrollView>
        ) : (
          isPressed[2] &&
          userData.role === 0 && (
            <View
              style={{
                paddingTop: 10,
              }}
            >
              <View style={styles.config}>
                <Text style={styles.configText}>
                  Number of questions in feed:
                </Text>
                <Card style={styles.inputCard}>
                  <TextInput
                    maxLength={2}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    value={configNumOfQuestionInFeed}
                    onChangeText={setConfigNumOfQuestionInFeed}
                  ></TextInput>
                </Card>
              </View>
              <View style={styles.config}>
                <Text style={styles.configText}>Forum name:</Text>
                <Card style={styles.inputCard}>
                  <TextInput
                    placeholder="Max 20 letters"
                    maxLength={20}
                    style={styles.inputText}
                    value={configForumName}
                    onChangeText={setConfigForumName}
                  ></TextInput>
                </Card>
              </View>
              <TouchableOpacity
                onPress={onUpdateConfiguration}
                style={{
                  width: 130,
                  height: 40,
                  backgroundColor: Colors.blue30,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  UPDATE
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default ManageForumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   marginLeft: 10,
    //   marginRight: 10
  },
  body: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerContainer: {
    height: 50,
    backgroundColor: Colors.white,
    // justifyContent: "center",
    //marginHorizontal: 20,
    padding: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoSection: {
    margin: 10,
    flexDirection: "row",
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  QA_card: {
    height: 80,
    width: "30%",
    padding: 5,
    marginLeft: 10,
  },
  menu: {
    borderRadius: 0,
    paddingLeft: 20,
    paddingRight: 30,
    marginRight: 2,
  },
  config: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.grey50,
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  configText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  inputCard: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    height: 40,
    padding: 4,
    fontSize: 17,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.grey60,
  },
});
