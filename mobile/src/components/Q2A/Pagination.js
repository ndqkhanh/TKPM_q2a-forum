import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "react-native-ui-lib";

const Q2APagination = ({ page, maxPage, pressPrev, pressNext }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={pressPrev}>
        <View style={styles.btnPage}>
          <Text style={styles.btnTextPage}>Previous</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.pageContainer}>
        <Text style={styles.pageNumber}>
          {page}
          {maxPage > 0 && `/${maxPage}`}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={pressNext}>
        <View style={styles.btnPage}>
          <Text style={styles.btnTextPage}>Next</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    btnPage: {
        backgroundColor: Colors.blue40,
        paddingVertical: 5,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    btnTextPage: {
        fontWeight: "bold",
        fontSize: 15,
        color: Colors.white,
    },
    pageContainer: {
        backgroundColor: Colors.blue20,
        borderRadius: 5,
        paddingVertical: 5,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    pageNumber: {
        fontWeight: "bold",
        fontSize: 15,
        color: Colors.white,
    },
});

export default Q2APagination;
