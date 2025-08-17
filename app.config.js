export default {
  expo: {
    name: "Pandiary",
    slug: "pandiary",
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
      edgeToEdgeEnabled: true,
      package: "com.pandiary.app",
      versionCode: 1,
      kotlinVersion: "1.8.0",
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
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      eas: {
        projectId: "4bad6624-1550-48e4-a56a-e8c849eb9229"
      }
    }
  }
};
