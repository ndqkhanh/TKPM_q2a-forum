import * as React from "react";

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";

const SearchBar = (props) => {
  const textChange = (value) => {
    props.textChange ? props.textChange(value) : null;
  };
  //const [ha,setha] = React.useState('123')
  return (
    <View style={[styles.searchBarView, { ...props.style }]}>
      <TouchableOpacity onPress={props?.onPressSearch}>
        <Icon
          style={styles.searchIcon}
          name="ios-search"
          size={20}
          color="#000"
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 30,
          paddingBottom: 5,
          paddingRight: 5,
          color: Colors.cyan30,
        }}
      >
        |
      </Text>
      <TextInput
        placeholder="Type here"
        style={styles.inputStyle}
        onChangeText={(value) => textChange(value)}
        onKeyPress={({ nativeEvent: { key: keyValue } }) =>
          keyValue == "Enter" ? props?.onPressSearch : null
        }
      />
    </View>
  );
};
export default SearchBar;
const wid = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  searchIcon: {
    padding: 10,
  },
  inputStyle: {
    textAlign: "left",
    fontSize: 20,
    width: wid * 0.8,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 0,
    //borderColor: Colors.red1,
    //borderWidth: 3,
    color: "#424242",
  },
  searchBarView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
