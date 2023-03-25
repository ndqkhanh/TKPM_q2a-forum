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
}