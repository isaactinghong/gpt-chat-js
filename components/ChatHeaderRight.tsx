// components/ChatHeaderRight.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { createConversation } from "../state/actions/chatActions";

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          // create new conversation, using action: createConversation
          dispatch(createConversation());
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
