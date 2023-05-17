/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { Text, TextInput, TouchableOpacity, View, LogBox } from "react-native";
import { Colors } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext, UserProvider } from "~provider/UserProvider";
import { ConfigContext, ConfigProvider } from "~provider/ConfigProvider";
import ScreensHomeMain from "~screens/Home/Main";
import PostAnswerScreen from "~screens/PostAnswer/PostAnswer";
import PostQuestionScreen from "~screens/PostNewQuestion";
import ManageForumScreen from "~screens/Profile/ManageForum";
import ProfileScreen from "~screens/Profile/UserProfile";
import ScreensQ2AMain from "~screens/Q2A/Main";
import SearchScreen from "~screens/Search/Search";
// import SignupAndLogin from "~SignupAndLogin/signupAndLogin";
import ScreensSignInMain from "~screens/SignIn/Main";
import ScreensSignUpMain from "~screens/SignUp/Main";

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}
const BottomTab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();
const BottomTabNavigator = ({ navigation }) => {
  return (
    <BottomTab.Navigator
      initialRouteName="Home" // What tab do we want to default to
      screenOptions={{
        // This gives us the ability to add addtional
        headerShown: false,
        tabBarShowLabel: false, // options when we create the bottom tab
        tabBarStyle: [
          {
            // most importantly the style component
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            backgroundColor: "#ffffff",
            borderRadius: 15,
            shadowColor: "#7F5DF0",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
            paddingBottom: 5,
          },
        ],
      }}
    >
      <BottomTab.Screen
        name="Your Feed"
        component={ScreensHomeMain}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Add"
        component={ScreensHomeMain}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("Editor");
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabBarIcon name="add-circle" size={40} color={Colors.blue10} />
            </TouchableOpacity>
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

function TabBarIcon(props) {
  return <Icon size={30} style={{ marginBottom: -3 }} {...props} />;
}

const EmptyScreen = () => {
  return <View></View>;
};
const Stack = createStackNavigator();

const SignupAndLogin = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login_screen"
        component={ScreensSignInMain}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="signup_screen"
        component={ScreensSignUpMain}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

const Navigation2 = () => {
  const { userData, auth } = useContext(UserContext);
  const { configData } = useContext(ConfigContext);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* PLEASE DO NOT CHANGE HERE. IF ANY, RETURN BACK TO THE ORIGINAL ONE ONCE PUSH CODE */}
        {/* console.log(auth.toString()) */}
        {auth && userData && configData ? (
          <>
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="Editor" component={PostQuestionScreen} />
            <Stack.Screen name="Post answer" component={PostAnswerScreen} />
            <Stack.Screen name="Q2A" component={ScreensQ2AMain} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Admin" component={ManageForumScreen} />
          </>
        ) : auth === false ? (
          <Stack.Screen name="Login" component={SignupAndLogin} />
        ) : (
          <Stack.Screen name="EmptyScreen" component={EmptyScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const App = () => {
  return (
    <UserProvider>
      <ConfigProvider>
        <Navigation2 />
      </ConfigProvider>
    </UserProvider>
  );
};

export default App;
