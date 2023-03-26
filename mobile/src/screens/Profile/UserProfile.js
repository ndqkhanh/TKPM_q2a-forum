import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { formatDistance } from "date-fns";
import { Avatar, Card, Colors, Text, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import PersonalInfo from "~components/Profile/personalInfo";
import { getMyProfile, getUserProfile } from "~services/getProfile";
import { updateUserInformation, getMyQuestions } from "~services/user";
import { UserContext } from "~provider/UserProvider";
import { is_empty, is_URL } from "~utils/string";
import Post from "~components/Common/Post";


