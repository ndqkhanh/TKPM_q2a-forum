import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistance } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "~components/Common/Post";
import Q2APagination from "~components/Q2A/Pagination";
import { UserContext } from "~provider/UserProvider";
import {
  deleteAnswer,
  getAllAnswersAndVotings,
  pickACorrectAnswer,
} from "~services/answer";
import { voteAndUnvoteAnswer } from "~services/voting";
import { deleteQuestion } from "~services/Question";

