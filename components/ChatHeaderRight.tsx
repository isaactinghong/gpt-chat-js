// components/ChatHeaderRight.js
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import {
  createConversation,
  deleteConversation,
} from "../state/actions/chatActions";
import { useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  const currentConversationId = useSelector(
    (state: AppState) => state.chats.currentConversationId
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          // create new conversation, using action: createConversation
          dispatch(createConversation());
        }}
      >
        <Ionicons name="add" size={24} color="black" />
      </Pressable>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          /* handle trash */
          dispatch(deleteConversation(currentConversationId));
        }}
      >
        <Ionicons name="trash-outline" size={20} color="black" />
      </Pressable>
      {/* <Pressable style={styles.actionButton} onPress={() => {}}>
        <Ionicons name="ellipsis-vertical" size={20} color="black" />
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginRight: 10,
    gap: 0,
  },
  actionButton: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default ChatHeaderRight;
