import { StyleSheet, Platform } from "react-native";
export default StyleSheet.create({
  primaryButton: {
    backgroundColor: "#1498db",
    padding: 10,
  },
  droidSafeArea: {
    flex: 1,
    // backgroundColor: npLBlue,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
