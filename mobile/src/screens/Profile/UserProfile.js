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

  const { userData, setUserData, fetchUserInformation } =
    useContext(UserContext);

  const [pendingData, setPendingData] = useState(userData);

  const [anotherUserData, setAnotherUserData] = useState({});

  const [myQuestionsData, setMyQuestionsData] = useState([]);
  const [maxLength, setMaxLength] = useState(0);
  const [page, setPage] = useState(0);
  const [refetch, setRefetch] = useState(false);
  const fetchUserProfile = async (userId) => {
    let data;
    if (userId != null) {
      data = await getUserProfile(userId);
    }
    if (data) setAnotherUserData(data);
  };

  const limit = 5;
  const fetchMyQuestions = async (page, limit) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getMyQuestions(token, page, limit);

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
  const saveInformation = async () => {
    if (is_empty(pendingData.name)) {
      Alert.alert("Account name can't be empty");
      return;
    }
    if (is_empty(pendingData.profilepictureurl)) {
      Alert.alert("Profile picture url can't be empty");
      return;
    }
    if (!is_URL(pendingData.profilepictureurl)) {
      Alert.alert("Profile picture must be an url");
      return;
    }
    let token = await AsyncStorage.getItem("UserToken");
    let data = await updateUserInformation(token, {
      name: pendingData.name,
      profilepictureurl: pendingData.profilepictureurl,
    });
    if (data.username) {
      Alert.alert("Update account successfully.");
    } else {
      Alert.alert("Update account failure.");
    }

    fetchUserInformation();
  };
  useEffect(() => {
    fetchUserProfile(userId);
  }, []);
  useEffect(() => {
    fetchMyQuestions(0, 5);
    // Reload
    return () => {
      setPage(0);
      setRefetch(false);
      setMyQuestionsData([]);
      setMaxLength(0);
    };
  }, []);
  const [tab, setTab] = useState("Personal info");
  const personalInfoTab = () => {
    setTab("Personal info");
  };
  const myQuestionsTab = () => {
    setTab("My questions");
  };
  const editProfile = () => {
    setTab("Edit Profile");
  };
  let role;
  if (anotherUserData.name) role = anotherUserData.role;
  else role = userData.role;
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
        <Text style={styles.header}>Profile</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoSection}>
          <Avatar
            rounded
            source={{
              uri: anotherUserData.profilepictureurl
                ? anotherUserData.profilepictureurl
                : userData.profilepictureurl,
            }}
            size={70}
          />
          <View marginLeft={10}>
            <Text style={styles.title}>
              {anotherUserData.username
                ? anotherUserData.username
                : userData.username}
            </Text>
            <Text>
              <Icon size={10} name="ellipse" color="blue" />
              {role == 0 ? "Admin" : role == 1 ? "Moderator" : "User"}
            </Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Card style={styles.QA_card}>
            <Text text10 center black>
              {anotherUserData.numOfQuestions
                ? anotherUserData.numOfQuestions
                : userData.numOfQuestions}
            </Text>
            <Text text60 center black>
              Questions
            </Text>
          </Card>
          <Card style={styles.QA_card}>
            <Text text10 center black>
              {anotherUserData.numOfAnswers
                ? anotherUserData.numOfAnswers
                : userData.numOfAnswers}
            </Text>
            <Text text60 center black>
              Answers
            </Text>
          </Card>
        </View>

        <View style={styles.infoSection}>
          <TouchableOpacity style={{ flex: 1 }} onPress={personalInfoTab}>
            <Card
              style={styles.menu}
              {...(tab == "Personal info"
                ? { backgroundColor: Colors.blue60 }
                : {})}
            >
              <Text
                black
                style={{
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                Personal info
              </Text>
            </Card>
          </TouchableOpacity>
          {anotherUserData.name ? null : (
            <TouchableOpacity style={{ flex: 1 }} onPress={myQuestionsTab}>
              <Card
                style={styles.menu}
                {...(tab == "My questions"
                  ? { backgroundColor: Colors.blue60 }
                  : {})}
              >
                <Text
                  black
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  My questions
                </Text>
              </Card>
            </TouchableOpacity>
          )}
          {anotherUserData.name ? null : (
            <TouchableOpacity style={{ flex: 1 }} onPress={editProfile}>
              <Card
                style={styles.menu}
                {...(tab == "Edit Profile"
                  ? { backgroundColor: Colors.blue60 }
                  : {})}
              >
                <Text
                  black
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  Edit Profile
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        </View>
        {tab == "Personal info" ? (
          <View
            style={{
              margin: 10,
            }}
          >
            <PersonalInfo
              userData={anotherUserData.name ? anotherUserData : userData}
            />
          </View>
        ) : tab == "My questions" ? (
          <View
            style={{
              margin: 10,
            }}
          >
            <ScrollView
              onScroll={({ nativeEvent }) => {
                if (
                  !refetch &&
                  isCloseToBottom(nativeEvent) &&
                  myQuestionsData.length < maxLength
                ) {
                  console.log("scrolled to bottom of the list");
                  setRefetch(true);
                  fetchMyQuestions(page, limit);
                }
              }}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              scrollEventThrottle={400}
              showsVerticalScrollIndicator={false}
            >
              {myQuestionsData.map((record, index) => (
                <Post
                  key={index}
                  dateText={formatDistance(
                    new Date(record.updated_at),
                    Date.now(),
                    {
                      addSuffix: true,
                    },
                  )}
                  content={record.content}
                  title={record.title}
                  questionStatus={record.status}
                  userData={userData}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          tab == "Edit Profile" && (
            <View
              style={{
                backgroundColor: Colors.white,
                padding: 10,
                borderRadius: 5,
                margin: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  Full Name:
                </Text>
                <TextInput
                  value={pendingData.name}
                  onChangeText={(value) => {
                    pendingData.name = value;
                    setPendingData({ ...pendingData });
                  }}
                  style={{
                    flex: 1,
                    height: 40,
                    marginLeft: 5,
                    borderRadius: 5,
                    backgroundColor: Colors.cyan80,
                    paddingHorizontal: 5,
                    fontSize: 16,
                  }}
                />
              </View>
              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  Profile Picturl URL:
                </Text>
                <TextInput
                  value={pendingData.profilepictureurl}
                  onChangeText={(value) => {
                    pendingData.profilepictureurl = value;
                    setPendingData({ ...pendingData });
                  }}
                  style={{
                    flex: 1,
                    height: 40,
                    marginLeft: 5,
                    borderRadius: 5,
                    backgroundColor: Colors.cyan80,
                    paddingHorizontal: 5,
                    fontSize: 16,
                  }}
                />
              </View> */}

              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  width: 100,
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.red30,
                  borderRadius: 5,
                  marginTop: 15,
                }}
                onPress={saveInformation}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerContainer: {
    height: 50,
    backgroundColor: Colors.white,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
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
    height: 120,
    width: "45%",
    padding: 5,
    marginLeft: 10,
  },
  menu: {
    borderRadius: 0,
  },
});
