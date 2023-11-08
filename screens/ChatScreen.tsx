import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install react-native-vector-icons
import ChatWindow from "../components/ChatWindow";
import GlobalStyles from "../theme/GlobalStyles";

const ChatScreen = () => {
  return <ChatWindow />;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    left: 10,
  },
  actionButton: {
    padding: 8,
  },
});

export default ChatScreen;
