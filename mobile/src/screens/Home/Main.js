import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistance } from "date-fns";
import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "~components/Common/Post";
import HomeMainPosting from "~components/Home/Main/Posting";
import { controllPostQuestion } from "~controller/controllQuestion";
import { ConfigContext } from "~provider/ConfigProvider";
import { UserContext } from "~provider/UserProvider";
import { getFeedController } from "~controller/controllQuestion";

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 100;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const ScreensHomeMain = ({ navigation, route }) => {
  const { configData } = useContext(ConfigContext);
  const { userData } = useContext(UserContext);
  const [maxLength, setMaxLength] = useState(0);
  const [page, setPage] = useState(0);
  const { setAuth } = useContext(UserContext);

  const [feedData, setFeedData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const fetchFeedInformation = async (page) => {
    let token = await AsyncStorage.getItem("UserToken");
    const data = await getFeedController(token, page);
    var maxLength = 5;
    try {
      maxLength = parseInt(data.count);
    } catch (error) {
      console.error("error", error);
    }
    setMaxLength(maxLength);
    setFeedData((feedData) => [...feedData, ...data.data]);
    setPage((page) => page + 1);
    setRefetch(false);
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setPage(0);
      setRefetch(false);
      setFeedData([]);
      setMaxLength(0);

      setRefetch(false);
      fetchFeedInformation(0);
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {
      unsubscribe();
      setPage(0);
      setRefetch(false);
      setFeedData([]);
      setMaxLength(0);

      setRefetch(false);
    };
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {configData.find((item) => item.slug === "FORUM_NAME")?.value || ""}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            await AsyncStorage.clear();

            setAuth(false);
          }}
        >
          <Icon
            name="log-out-outline"
            style={{
              fontSize: 30,
              color: Colors.cyan10,
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.body}
        onScroll={({ nativeEvent }) => {
          if (
            !refetch &&
            isCloseToBottom(nativeEvent) &&
            feedData.length < maxLength
          ) {
            console.log("scrolled to bottom of feed");
            setRefetch(true);
            fetchFeedInformation(page);
          }
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
          }}
        >
          <TouchableHighlight
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.white,
              borderRadius: 5,
              padding: 5,
              marginRight: userData.role === 2 ? 0 : 10,
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("Profile")}
            underlayColor={Colors.cyan50}
          >
            <>
              <Icon
                name="person-outline"
                style={{
                  fontSize: 30,
                  color: Colors.cyan20,
                }}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 18,
                  fontWeight: "bold",
                  color: Colors.cyan20,
                }}
              >
                Profile
              </Text>
            </>
          </TouchableHighlight>
          {(userData.role == 1 || userData.role == 0) && (
            <TouchableHighlight
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.white,
                borderRadius: 5,
                padding: 5,
                marginLeft: 10,
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Admin")}
              underlayColor={Colors.cyan50}
            >
              <>
                <Icon
                  name="flame-outline"
                  style={{
                    fontSize: 30,
                    color: Colors.cyan20,
                  }}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.cyan20,
                  }}
                >
                  {(userData.role == 1)? "Moderator": "Admin"}
                </Text>
              </>
            </TouchableHighlight>
          )}
        </View>
        <HomeMainPosting
          onPress={() => navigation.navigate("Editor")}
          content={route.params?.Content}
          onPressPost={() => {
            controllPostQuestion(route.params?.Title, route.params?.Content);
            navigation.setParams({ Title: null, Content: null });
          }}
        />
        {feedData.map((record, index) => (
          <Post
            key={index}
            dateText={formatDistance(new Date(record.updated_at), Date.now(), {
              addSuffix: true,
            })}
            title={record.title}
            content={record.content}
            numOfAnswers={record.numOfAnswers}
            userData={{
              name: record.userData.name,
              avatarUrl: record.userData.profilepictureurl,
            }}
            correctAnswer={record.correctAnswerExists}
            onPressQ2A={() => {
              navigation.navigate("Q2A", { questionId: record.id });
            }}
            onPressAnswer={() => {
              navigation.navigate("Post answer", { qid: record.id });
            }}
            goProfile={() => {
              navigation.navigate("Profile", { uid: record.uid });
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: Colors.white,
    // justifyContent: "center",
    marginHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.cyan70,
  },
  postContainer: {
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  votingContainer: {
    backgroundColor: Colors.grey60,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  votingUp: {
    fontSize: 35,
    color: Colors.yellow10,
  },
  votingDown: {
    fontSize: 35,
    color: Colors.red50,
  },
  votingScore: {
    color: Colors.blue10,
    fontSize: 17,
    fontWeight: "bold",
  },
  postContentContainer: {
    padding: 10,
  },
  infoUserContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.green5,
  },
  nameAndDate: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    color: Colors.grey30,
    fontSize: 15,
    fontWeight: "bold",
  },
  createdAt: {
    color: Colors.grey40,
    fontSize: 15,
  },
  questionTitle: {
    color: Colors.grey10,
    fontSize: 25,
    fontWeight: "bold",
  },
  questionContent: {
    color: Colors.grey30,
    fontSize: 15,
    marginTop: 5,
  },
  questionFooterContainer: {
    backgroundColor: Colors.white,
    height: 35,
    flexDirection: "row",
    borderTopColor: Colors.blue80,
    borderTopWidth: 2,
    marginHorizontal: 8,
    marginTop: 5,
    alignItems: "center",
  },
  commentIcon: {
    fontSize: 25,
    color: Colors.cyan10,
  },
  numOfAnswers: {
    marginLeft: 5,
    color: Colors.cyan30,
    fontWeight: "bold",
  },
});
export default ScreensHomeMain;
