import MDEditor from "@uiw/react-md-editor";
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
  primaryClearButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
  },
  primaryClearButtonText: {
    color: "#000",
    alignSelf: "center",
  },
  droidSafeArea: {
    flex: 1,
    // backgroundColor: npLBlue,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
