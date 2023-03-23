/**
 * @format
 */

import { AppRegistry } from "react-native";
import {
  Colors,
  Spacings,
  ThemeManager,
  Typography,
} from "react-native-ui-lib";
import { MAIN_COLORS } from "~constants/colors";
import App from "./App";
import { name as appName } from "./app.json";
// with plain object
ThemeManager.setComponentTheme("Card", {
  borderRadius: 8,
});

// with a dynamic function
ThemeManager.setComponentTheme("Button", (props, context) => {
  // 'square' is not an original Button prop, but a custom prop that can
  // be used to create different variations of buttons in your app
  if (props.square) {
    return {
      borderRadius: 0,
    };
  }
});
Colors.loadColors(MAIN_COLORS);

Typography.loadTypographies({
  heading: { fontSize: 36, fontWeight: "600" },
  subheading: { fontSize: 28, fontWeight: "500" },
  body: { fontSize: 18, fontWeight: "400" },
});

Spacings.loadSpacings({
  page: 20,
  card: 12,
  gridGutter: 16,
});

AppRegistry.registerComponent(appName, () => App);
