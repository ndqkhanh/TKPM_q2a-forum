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
import { getFeed } from "~services/feed";
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
        const data = await getFeed(token, page);
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
                                    Admin
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
                            console.log("navigate to Q2A");
                            navigation.navigate("Q2A", { questionId: record.id });
                        }}
                        onPressAnswer={() => {
                            navigation.navigate("Post answer", { qid: record.id });
                        }}
                        goProfile={() => {
                            navigation.navigate("Profile", { uid: record.uid })
                        }}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}