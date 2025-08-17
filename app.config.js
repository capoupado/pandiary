export default {
  expo: {
    name: "my-feelings-app",
    slug: "my-feelings-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    fonts: [
      "./assets/fonts/CircularStd-Book.otf",
      "./assets/fonts/CircularStd-Medium.otf", 
      "./assets/fonts/CircularStd-Bold.otf"
    ],
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY
    }
  }
};
