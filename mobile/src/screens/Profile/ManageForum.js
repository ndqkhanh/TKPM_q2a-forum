import React, { useState, useContext, useEffect } from "react";
import { View, Text, Avatar, Card, Colors } from "react-native-ui-lib";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Touchable,
  TouchableHighlight,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "~provider/UserProvider";
import PendingQuestion from "~components/Common/PendingQuestionList";
import User from "~components/Common/UserList";
import { formatDistance } from "date-fns";
import {
  approveDeclineQuestion,
  getListConfigurations,
  getMetrics,
  getPendingQuestions,
  getUsers,
  updateConfiguration,
  banUser,
} from "~services/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { is_empty } from "~utils/string";
import { ConfigContext } from "~provider/ConfigProvider";


