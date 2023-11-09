import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install react-native-vector-icons
import ChatMessage from "./ChatMessage";
import { addMessage } from "../state/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "../state/types/message";
import { AppState } from "../state/states/app-state";
import { saveSettings } from "../state/actions/settingsActions";
import Toast from "react-native-toast-message";
import InputModal from "./InputModel";
import OpenAI from "../services/OpenAIService";
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";

const ChatWindow = () => {
  const dispatch = useDispatch();

  const model = useSelector((state: AppState) => state.settings.modelName);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  const openAiApiKey = useSelector(
    (state: AppState) => state.settings.openAiApiKey
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

  const sendMessage = async () => {
    // check if settings store's openAiApiKey is set
    if (!openAiApiKey) {
      setModalVisible(true);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: Date.now(),
      // imageUrls can be added if images are attached
    };

    const messages: ChatCompletionMessageParam[] = [
      ...currentConversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: newMessage.role,
        content: newMessage.content,
      },
    ];

    dispatch(addMessage(currentConversationId, newMessage));

    // clear input
    setInputText("");

    try {
      const chatCompletionResult = await OpenAI.api.chat.completions.create({
        messages: messages,
        model,
      });

      const firstChoice = chatCompletionResult.choices[0];

      const newMessageFromAI: Message = {
        id: Date.now().toString(),
        ...firstChoice.message,
        timestamp: Date.now(),
      };

      dispatch(addMessage(currentConversationId, newMessageFromAI));
    } catch (error) {
      console.log("Error", error);

      // show error toast message
      Toast.show({
        type: "error",
        text1: "Error calling OpenAI API",
        text2: error.message,
      });
    }
  };

  const handleConfirmApiKey = (inputValue) => {
    console.log("OpenAI API Key", inputValue);
    // save settings
    dispatch(
      saveSettings({
        openAiApiKey: inputValue,
      })
    );

    // show success toast message
    Toast.show({
      type: "success",
      text1: "OpenAI API key saved",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
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
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="black" />
        </Pressable>
      </View>
      <InputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmApiKey}
        title="Enter your OpenAI API Key:"
      />
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
    paddingTop: 5,
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
