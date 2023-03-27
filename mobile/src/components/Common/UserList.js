import React, { useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, Card } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";

const User = ({ userData, Status, pressBan }) => {
  const [Banned, setBanned] = useState(Status);
  const pressBanCombined = () => {
    pressBan();
    if (Banned) setBanned(false);
    else setBanned(true);
  };
  return (
    <View style={styles.postContainer}>
      <View style={styles.postContentContainer}>
        <View style={styles.infoUserContainer}>
          <Image
            source={{
              uri: userData.avatarUrl,
            }}
            style={styles.avatar}
          ></Image>

          <View style={styles.nameAndDate}>
            <Text style={styles.name}>{userData.name}</Text>
          </View>
          <TouchableOpacity onPress={pressBanCombined}>
            <View flexDirection={"row"} alignItems={"center"}>
              <Icon
                {...(Banned
                  ? {
                      name: "checkbox-outline",
                      color: Colors.green10,
                      style: styles.icon,
                    }
                  : {
                      name: "remove-circle",
                      color: Colors.red10,
                      style: styles.icon,
                    })}
              />
              {Banned ? (
                <Text style={styles.unban}>Unban</Text>
              ) : (
                <Text style={styles.ban}>Ban</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
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
  icon: {
    fontSize: 25,
  },
  ban: {
    marginLeft: 5,
    fontWeight: "bold",
    color: Colors.red10,
  },
  unban: {
    marginLeft: 5,
    fontWeight: "bold",
    color: Colors.green10,
  },
});
export default User;
