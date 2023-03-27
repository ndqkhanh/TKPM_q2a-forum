import { prop } from "cheerio/lib/api/attributes";
import React, { useContext } from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { Colors } from "react-native-ui-lib";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { UserContext } from "~provider/UserProvider";

const HomeMainPosting = (props) => {
  const { width } = useWindowDimensions();
  const { userData, setUserData, fetchUserInformation } = useContext(UserContext);
  let initContent = null;
  if (props.content) {
    initContent = props?.content.split("&lt;").join("<");
  }

  const source = {
    html: `${initContent}`,
  };

  return (
    <TouchableHighlight
      style={{
        backgroundColor: "#fff",
        flex: 1,
        padding: 10,
        marginTop: 10,
      }}
      onPress={props?.onPress}
      underlayColor={Colors.cyan50}
    >
      <>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: userData.profilepictureurl,
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: Colors.green5,
            }}
          ></Image>

          <View
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                color: Colors.grey40,
                fontSize: 15,
              }}
            >
              {(props.content && (
                <RenderHtml contentWidth={width} source={source} />
              )) ||
                "Write something..."}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderTopColor: Colors.grey70,
            borderTopWidth: 2,
            alignItems: "flex-end",
            marginTop: 10,
          }}
        >
          <TouchableHighlight
            onPress={props?.onPressPost}
            style={{
              backgroundColor: Colors.blue30,
              width: 70,
              height: 30,
              borderRadius: 5,
              marginTop: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontWeight: "bold",
              }}
            >
              Post
            </Text>
          </TouchableHighlight>
        </View>
      </>
    </TouchableHighlight>
  );
};

export default HomeMainPosting;
