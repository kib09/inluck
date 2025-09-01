/**
 * Expo 앱 설정 파일
 * 환경 변수를 안전하게 관리합니다.
 */

export default {
  expo: {
    name: "inluck",
    slug: "inluck",
    version: "13.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.inluck",
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      versionCode: 14,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.inluck"
    },
    scheme: "inluck",
    platforms: [
      "ios",
      "android",
      "web"
    ],
    extra: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: "fe36d876-390c-4256-a216-5a5d4eea07d7"
      }
    },
    owner: "kiminbae",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/fe36d876-390c-4256-a216-5a5d4eea07d7"
    },
    plugins: [
      "expo-web-browser"
    ]
  }
};
