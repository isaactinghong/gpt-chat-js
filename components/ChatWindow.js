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

const ChatWindow = ({ messages }) => {
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim()) {
      // Handle the message sending logic here
      console.log(inputText);
      setInputText("");
    }
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
