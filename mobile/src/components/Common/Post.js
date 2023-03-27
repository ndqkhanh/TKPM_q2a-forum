import React from "react";
import { Image, StyleSheet, Text, View, Button } from "react-native";
import {
  TouchableOpacity,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { Colors, Card } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
//import { useNavigation } from '@react-navigation/native';

const Post = ({
  uid,
  voting,
  votingStatus,
  questionStatus,
  content,
  title,
  userData,// = { name: "", avatarUrl: "" },
  dateText,
  image,
  numOfAnswers,
  correctAnswer = false,
  onPressAnswer,
  onDelete = null,
  onPickCorrectAnswer = null,
  onPressQ2A = null,
  onUpdate = null,
  onUpVote = null,
  onUnVote = null,
  onDownVote = null,
  goProfile = null,
}) => {
  //const navigation = useNavigation();

  const { width } = useWindowDimensions();

  const initContent = content.split("&lt;").join("<");

  const source = {
    html: `${initContent}`,
  };
  return (
    <TouchableHighlight
      onPress={onPressQ2A}
      underlayColor={Colors.cyan50}
      style={styles.postContainer}
    >
      <>
        {typeof voting == "number" && (
          <View style={styles.votingContainer}>
            <TouchableOpacity
              onPress={votingStatus === true ? onUnVote : onUpVote}
            >
              <Icon
                name="caret-up-outline"
                style={[
                  styles.votingUp,
                  votingStatus === true && { color: Colors.yellow10 },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={votingStatus === false ? onUnVote : onDownVote}
            >
              <Icon
                name="caret-down-outline"
                style={[
                  styles.votingDown,
                  votingStatus === false && { color: Colors.yellow10 },
                ]}
              />
            </TouchableOpacity>

            <Text style={styles.votingScore}>
              {voting >= 0 ? "+" + voting : voting}
            </Text>
          </View>
        )}
        {/* pending card notification */}
        {questionStatus == 0 ?
        <Card style={styles.verifyCard}>
          <Text style={styles.questionStatus}>Pending</Text>
        </Card>
        : null}

        <View style={styles.postContentContainer}>
          <View style={styles.infoUserContainer}>
            {userData.avatarUrl && userData.avatarUrl.indexOf("http") >= 0 && (
              <TouchableOpacity
                onPress={goProfile}  
              >
                <Image
                  source={{
                    uri: userData.avatarUrl,
                  }}
                  style={styles.avatar}
                ></Image>
              </TouchableOpacity>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={styles.nameAndDate}>
                {userData.name && (
                  <Text style={styles.name}>{userData.name}</Text>
                )}
                {dateText && <Text style={styles.createdAt}>{dateText}</Text>}
              </View>

              {correctAnswer && (
                <View
                  style={{
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="checkmark-circle"
                    style={{
                      color: Colors.yellow10,
                      fontSize: 40,
                    }}
                  />
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
            }}
          >
            {title && <Text style={styles.questionTitle}>{title}</Text>}

            {content && (
              <Text style={styles.questionContent}>
                {<RenderHtml contentWidth={width} source={source} />}
              </Text>
            )}

            {image && (
              <Image
                source={{
                  uri: image,
                }}
                style={{
                  alignSelf: "stretch",
                  height: 400,
                  marginVertical: 10,
                }}
              />
            )}
          </View>
        </View>

        {typeof numOfAnswers == "number" && (
          <View style={styles.questionFooterContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={onPressAnswer}>
              <Icon name="chatbubble-ellipses" style={styles.commentIcon} />
            </TouchableOpacity>
            <Text style={styles.numOfAnswers}>{numOfAnswers}</Text>
          </View>
        )}

        {(onDelete || onPickCorrectAnswer) && (
          <View style={styles.questionFooterContainer}>
            {onDelete && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={onDelete}>
                  <Text
                    style={{
                      color: Colors.cyan30,
                      fontWeight: "700",
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {onUpdate && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={onUpdate}>
                  <Text
                    style={{
                      color: Colors.cyan30,
                      fontWeight: "700",
                    }}
                  >
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {onPickCorrectAnswer && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={onPickCorrectAnswer}>
                  <Text
                    style={{
                      color: Colors.cyan30,
                      fontWeight: "700",
                    }}
                  >
                    Pick
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
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
    color: Colors.red50,
  },
  votingDown: {
    fontSize: 35,
    color: Colors.red50,
  },
  votingScore: {
    color: Colors.blue30,
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
    color: Colors.blue40,
    fontSize: 25,
    fontWeight: "bold",
  },
  questionContent: {
    color: Colors.grey30,
    fontSize: 15,
    marginTop: 5,
  },
  questionFooterContainer: {
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
  verifyCard: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    backgroundColor: Colors.yellow20,
  },
  questionStatus: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.black,
  },
});
export default Post;
