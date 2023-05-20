import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "~provider/UserProvider";

const ScreensSignInMain = ({ navigation }) => {
  const onSignUp = () => {
    navigation.navigate("signup_screen");
  };
  const { fetchUserInformation } = useContext(UserContext);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const fetchSignin = async (username, password) => {
    try {
      let responseLogin = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer",
        },
        body: JSON.stringify({
          username: `${username}`,
          password: `${password}`,
        }),
      });
      const mjson = await responseLogin.json();

      if (mjson.hasOwnProperty("tokens")) {
        await AsyncStorage.setItem(
          "UserToken",
          mjson["tokens"]["access"]["token"],
        );
        fetchUserInformation();
        navigation.navigate("Home");
      } else {
        Alert.alert("Invalid", mjson["message"]);
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.mainIntro}>
          <Image
            source={require("~assets/img/login.gif")}
            style={styles.imgIntro}
          />
          <Text style={styles.title}>Create better together.</Text>
          <Text style={styles.subTitle}>Join our community</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.signInText}>Sign in</Text>

          <View style={styles.fieldContainer}>
            <Icon name="person-outline" style={styles.fieldIcon} />

            <TextInput
              style={styles.fieldInput}
              placeholder="Username"
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Icon name="lock-closed-outline" style={styles.fieldIcon} />

            <TextInput
              style={styles.fieldInput}
              placeholder="Password"
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => fetchSignin(username, password)}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.signUpText}>
          <Text style={styles.newForum}>
            New to Forum?{" "}
            <Text
              style={{
                color: Colors.blue40,
                fontWeight: "bold",
              }}
              onPress={onSignUp}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainIntro: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imgIntro: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 25,
    color: Colors.blue20,
    fontWeight: "bold",
    marginTop: 5,
  },
  subTitle: {
    fontSize: 18,
    color: Colors.cyan10,
    marginTop: 10,
  },
  inputContainer: {
    marginHorizontal: 20,
    paddingTop: 20,
  },
  signInText: {
    fontSize: 30,
    color: Colors.blue40,
    fontWeight: "bold",
  },
  fieldContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  fieldIcon: {
    fontSize: 28,
    color: Colors.cyan20,
  },
  fieldInput: {
    flex: 1,
    borderBottomColor: Colors.cyan70,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.blue40,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.white,
  },
  signUpText: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: Colors.grey70,

    borderTopWidth: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  newForum: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.cyan10,
  },
});

export default ScreensSignInMain;
