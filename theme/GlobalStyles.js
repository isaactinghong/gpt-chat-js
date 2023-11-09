import { StyleSheet, Platform } from "react-native";
export default StyleSheet.create({
  primaryButton: {
    backgroundColor: "#000",
    padding: 10,
  },
  primaryButtonText: {
    color: "#fff",
    alignSelf: "center",
  },
  droidSafeArea: {
    flex: 1,
    // backgroundColor: npLBlue,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
