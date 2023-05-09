import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, Card } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";
import Post from "~components/Common/Post";

const PendingQuestion = ({
  onPressApprove,
  onPressDisapprove,
  content,
  title,
  userData,
  dateText,
  image,
}) => {
  return (
    <View>
      <Post
        content={content}
        title={title}
        userData={userData}
        dateText={dateText}
        image={image}
      />
      <View style={styles.questionFooterContainer}>
        <Card style={styles.verifyCard}>
          <TouchableOpacity flexDirection={"row"} onPress={onPressApprove}>
            <View flexDirection={"row"} alignItems={"center"}>
              <Icon
                name="checkmark-outline"
                style={styles.verifyIcon}
                color={Colors.green10}
              />
              <Text style={styles.approve}>Approve</Text>
            </View>
          </TouchableOpacity>
        </Card>
        <Card style={styles.verifyCard}>
          <TouchableOpacity onPress={onPressDisapprove}>
            <View flexDirection={"row"} alignItems={"center"}>
              <Icon
                name="close-outline"
                style={styles.verifyIcon}
                color={Colors.red10}
              />
              <Text style={styles.disapprove} red>
                Disapprove
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.white,
    marginTop: 20,
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
    marginTop: 0,
    alignItems: "center",
  },
  verifyCard: {
    flexDirection: "row",
    width: "50%",
    //alignContent:'center',
    justifyContent: "center",
  },
  verifyIcon: {
    fontSize: 25,
  },
  approve: {
    marginLeft: 5,
    fontWeight: "bold",
    color: Colors.green10,
  },
  disapprove: {
    marginLeft: 5,
    fontWeight: "bold",
    color: Colors.red10,
  },
});
export default PendingQuestion;
