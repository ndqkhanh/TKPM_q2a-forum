import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { controllsSearchQuestion } from "~controller/controllQuestion";
import Q2APagination from "~components/Q2A/Pagination";
import Post from "~components/Common/Post";
import SearchBar from "~components/SearchBar/SearchBar";
import { formatDistance } from "date-fns";
import { ConfigContext } from "~provider/ConfigProvider";
import { is_empty } from "~utils/string";
const SearchScreen = ({ navigation }) => {
  const { configData } = React.useContext(ConfigContext);
  const [titleSearch, setTitleSearch] = React.useState("");
  const [countRes, setCountRes] = React.useState(null);
  const [searchData, setSearchData] = React.useState([]);
  const limit = 5;
  const [page, setPage] = React.useState(1);
  const pressNext = () => {
    if (page < Math.ceil(countRes / limit)) {
      let newPage = page + 1;
      setPage(newPage);
      if (Math.ceil(searchData.length / limit) < newPage)
        getData(false, newPage - 1, limit);
    }
  };
  const pressPrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const getData = async (newSearch, page, limit) => {
    try {
      let res = await controllsSearchQuestion(titleSearch, page, limit);
      setSearchData([]);
      if (res != null) {
        setCountRes(parseInt(res.count));
        if (newSearch == true) setSearchData([...res.questions]);
        else setSearchData([...searchData, ...res.questions]);
      }
    } catch (error) {
      console.log(error);
    }
  };


