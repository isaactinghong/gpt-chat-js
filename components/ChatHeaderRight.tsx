// components/ChatHeaderRight.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatHeaderRight = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          /* handle new conversation */
        }}
      >
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          /* handle more options */
        }}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginRight: 10,
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default ChatHeaderRight;
