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
  return (
    // <SafeAreaView style={GlobalStyles.droidSafeArea}>
    //   <View style={styles.topBar}>
    // <Text style={styles.title}>This is a sample image message </Text>
    // <TouchableOpacity style={styles.actionButton} onPress={() => {/* handle new conversation */}}>
    //   <Ionicons name="add" size={24} color="black" />
    // </TouchableOpacity>
    // <TouchableOpacity style={styles.actionButton} onPress={() => {/* handle more options */}}>
    //   <Ionicons name="ellipsis-vertical" size={24} color="black" />
    // </TouchableOpacity>
    //   </View>
    // </SafeAreaView>
    <ChatWindow />
  );
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
