export default {
  expo: {
    name: "GPT Chat JS",
    slug: "gpt-chat-js",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      icon: "./assets/icon.png",
      supportsTablet: true,
      bundleIdentifier: "com.isaactinghong.gptchatjs",
    },
    android: {
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.isaactinghong.gptchatjs",
    },
    web: {
      favicon: "./assets/favicon.png",
      themeColor: "#000000",
      backgroundColor: "#ffffff",
      name: "GPT Chat JS",
      description: "GPT Chat JS using OpenAI API",
      shortName: "GPT Chat JS",
      display: "standalone",
      orientation: "portrait",
      lang: "en-US",
      startUrl: "/",
      scope: "/",
    },
    extra: {
      eas: {
        projectId: "4470da89-f368-4fb2-98fa-c1aef4f28d28",
      },
    },
    sdkVersion: "49.0.0",
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to share images with GPT Vision.",
          cameraPermission:
            "The app accesses your camera to share images with GPT Vision.",
        },
      ],
    ],
  },
  name: "gpt-chat-js",
};
