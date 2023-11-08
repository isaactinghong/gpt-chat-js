import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install react-native-vector-icons
import ChatMessage from "./ChatMessage";
import { addMessage } from "../state/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "../state/types/message";
import { AppState } from "../state/types/app-state";

const ChatWindow = () => {
  const [inputText, setInputText] = useState("");
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  const currentConversation = conversations[currentConversationId];
  const messages = currentConversation?.messages ?? [];
  // Sample data
  // const messages = [
  //   {
  //     text: "Hello!",
  //     images: [],
  //   },
  //   {
  //     text: "This is a sample image message",
  //     images: ["https://via.placeholder.com/150"],
  //   },
  // ];

  const sendMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: Date.now(),
      senderId: "currentUserId",
      // imageUrls can be added if images are attached
    };
    dispatch(addMessage(currentConversationId, newMessage));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} images={msg.images} />
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          // enter to send
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Make sure to set a background color
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    // borderTopWidth: 1,
    // borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 45, // Make room for the send button
    marginVertical: 10,
  },
  sendButton: {
    position: "absolute",
    right: 22,
    bottom: 23,
  },
});

export default ChatWindow;
