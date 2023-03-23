module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        rootPathPrefix: "~",
        rootPathSuffix: "src",
      },
    ],
    [
      "module:react-native-dotenv",
      {
        safe: true,
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
