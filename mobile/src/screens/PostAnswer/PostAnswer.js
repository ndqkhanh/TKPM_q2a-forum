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

