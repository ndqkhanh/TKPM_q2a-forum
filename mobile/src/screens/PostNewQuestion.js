import React from "react";
import { View, Text, Card, Colors } from "react-native-ui-lib";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { controllUpdateQuestion } from "~controller/controllQuestion";
import { is_empty } from "~utils/string";

const PostQuestionScreen = ({ navigation, route }) => {
  const initTitle = route.params?.Title || "";
  const initContent = route.params?.Content?.split("&lt;")?.join("<") || "";
  const richText = React.useRef();
  const [title, setTitle] = React.useState(initTitle);
  const [content, setContent] = React.useState(initContent);
  const postQuestion = async (passTitle, passContent) => {
    if (is_empty(passTitle) || is_empty(passContent)) {
      Alert.alert("Require", "Title and content must contain something!");
    } else {
      if (route.params?.update) {
        await controllUpdateQuestion(route.params?.qid, passTitle, passContent);
        navigation.goBack();
      } else {
        var question = {
          Title: passTitle,
          Content: passContent,
        };
        navigation.navigate("Your Feed", question);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon
            name="arrow-back-outline"
            style={{
              fontSize: 30,
              color: Colors.cyan10,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Post a question</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.textTitle}>Title</Text>
        <Card style={styles.typingTitle}>
          <TextInput
            style={{ height: 45, paddingHorizontal: 10 }}
            defaultValue={initTitle}
            onChangeText={(tilteText) => setTitle(tilteText)}
          />
        </Card>
        <Text
          style={[
            styles.textTitle,
            {
              marginTop: 30,
            },
          ]}
        >
          Content
        </Text>

        <Card style={styles.typingContent}>
          <RichEditor
            useContainer={false}
            ref={richText}
            initialContentHTML={initContent}
            onChange={(descriptionText) => {
              setContent(descriptionText);
            }}
          />
        </Card>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.removeFormat,
          ]}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.red30,
            borderRadius: 5,
            paddingHorizontal: 20,
          }}
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.submitText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.blue40,
            borderRadius: 5,
            paddingHorizontal: 20,
          }}
          activeOpacity={0.7}
          onPress={() => postQuestion(title, content)}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostQuestionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 120,
  },
  headerContainer: {
    height: 50,
    backgroundColor: Colors.white,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    margin: 10,
    marginTop: 30,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: Colors.black,
  },
  typingTitle: {
    marginLeft: 10,
    marginTop: 10,
    width: "95%",
  },
  typingContent: {
    marginLeft: 10,
    marginTop: 10,
    width: "95%",
    height: "50%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitText: {
    fontSize: 20,
    margin: 7,
    color: "white",
    fontWeight: "bold",
  },
});
