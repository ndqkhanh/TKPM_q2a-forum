import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { controllsSearchQuestion } from "~controller/controllQuestion";
import Q2APagination from "~components/Q2A/Pagination";
import Post from "~components/Common/Post";
import SearchBar from "~components/SearchBar/SearchBar";
import { formatDistance } from "date-fns";
import { ConfigContext } from "~provider/ConfigProvider";
import { is_empty } from "~utils/string";
const SearchScreen = ({ navigation }) => {
  const { configData } = React.useContext(ConfigContext);
  const [titleSearch, setTitleSearch] = React.useState("");
  const [countRes, setCountRes] = React.useState(null);
  const [searchData, setSearchData] = React.useState([]);
  const limit = 5;
  const [page, setPage] = React.useState(1);
  const pressNext = () => {
    if (page < Math.ceil(countRes / limit)) {
      let newPage = page + 1;
      setPage(newPage);
      if (Math.ceil(searchData.length / limit) < newPage)
        getData(false, newPage - 1, limit);
    }
  };
  const pressPrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const getData = async (newSearch, page, limit) => {
    try {
      let res = await controllsSearchQuestion(titleSearch, page, limit);
      setSearchData([]);
      if (res != null) {
        setCountRes(parseInt(res.count));
        if (newSearch == true) setSearchData([...res.questions]);
        else setSearchData([...searchData, ...res.questions]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.backgroundView}>
      {/* <Text style={{ fontSize: 30, alignSelf: 'center', color: Colors.blue40 }}>Find question</Text> */}
      <View style={styles.headerContainer}>
        <View
          style={{
            height: 50,
            marginHorizontal: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.header}>
            {configData.find((item) => item.slug === "FORUM_NAME")?.value || ""}
          </Text>
          <Icon
            name="log-out-outline"
            style={{
              fontSize: 30,
              color: Colors.cyan10,
            }}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <SearchBar
          textChange={setTitleSearch}
          onPressSearch={() => {
            setPage(1);
            setCountRes(null);
            getData(true, 0, limit);
          }}
        ></SearchBar>
        {countRes > 0 ? (
          <Text style={styles.resultTxt}>Found {countRes} results</Text>
        ) : null}
        {searchData.length !== 0 ? (
          <Q2APagination
            page={page}
            maxPage={Math.ceil(countRes / limit)}
            pressPrev={() => pressPrev()}
            pressNext={() => pressNext()}
          />
        ) : null}
      </View>
      {countRes == 0 ? (
        <Image
          source={require("~assets/img/no-result-found.png")}
          style={styles.imgNotFound}
        />
      ) : (
        <ScrollView style={styles.body}>
          {searchData
            .filter(
              (item, index) =>
                index >= (page - 1) * limit && index < page * limit,
            )
            .map((record, index) => (
              <Post
                key={index}
                dateText={formatDistance(
                  new Date(record.questionData.updated_at),
                  Date.now(),
                  {
                    addSuffix: true,
                  },
                )}
                title={record.questionData.title}
                content={record.questionData.content}
                numOfAnswers={record.numOfAnswers}
                userData={{
                  name: record.userData.name,
                  avatarUrl: record.userData.profilepictureurl,
                }}
                onPressQ2A={() => {
                  navigation.navigate("Q2A", {
                    questionId: record.questionData.id,
                  });
                }}
                correctAnswer={record.correctAnswerExists}
                onPressAnswer={() => {
                  navigation.navigate("Post answer", {
                    qid: record.questionData.id,
                  });
                }}
              />
            ))}
        </ScrollView>
      )}
      {/* <View style={{ flex: 1 }}>
      <Image
          source={require("~assets/img/bloodbros-search.gif")}
          style={styles.imgIntro}
        />
      </View> */}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  imgNotFound: {
    marginTop: 40,
    alignSelf: "center",
  },
  imgIntro: {
    marginTop: 40,
    alignSelf: "center",
    width: 300,
    height: 300,
  },
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.cyan70,
  },
  body: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.cyan70,
  },
  headerContainer: {
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  resultTxt: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
});
