import React from "react";
import { Card, Text, View } from "react-native-ui-lib";

const HomeMainWelcome = ({ name }) => {
  return (
    <Card height={100} center padding-card marginB-s4>
      <Text body>
        Hi <Text text60>{name}</Text>
      </Text>

      <View flex row centerV>
        <View flex center>
          <Text>sds</Text>
        </View>
        <View flex center>
          <Text>sds</Text>
        </View>
      </View>
    </Card>
  );
};

export default HomeMainWelcome;
