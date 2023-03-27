import React from "react";
import StyleSheet from "react-native";
import { View, Text, Card } from "react-native-ui-lib";
const PersonalInfo = ({ userData }) => {
  return (
    <View>
      <Card
        style={{
          width: "100%",
          padding: 10,
          justifyContent: "space-around",
        }}
      >
        <Text
          black
          style={{
            fontWeight: "500",
            fontSize: 17,
          }}
        >
          Full name:{" "}
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {userData.name}
          </Text>
        </Text>
      </Card>
    </View>
  );
};

export default PersonalInfo;
