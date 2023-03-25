import React from "react";
import { View, Text, Card, Colors } from "react-native-ui-lib";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
  controllPostAnswer,
  controllUpdateQuestion,
} from "~controller/controllAnswer";

const PostAnswerScreen = ({ navigation, route }) => {
  const initContent = route?.params?.Content?.split("&lt;").join("<") || "";
  const richText = React.useRef();
  const [content, setContent] = React.useState(initContent);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your answer</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.textTitle}>Content</Text>
        <RichToolbar
          editor={richText}
          actions={[actions.setBold, actions.setItalic, actions.setUnderline]}
        />
        <Card style={styles.typingContent}>
          <RichEditor
            useContainer={false}
            ref={richText}
            initialContentHTML={initContent}
            onChange={(descriptionText) => {
              setContent(descriptionText);
              //console.log("descriptionText:", descriptionText);
            }}
          />
        </Card>
      </View>
