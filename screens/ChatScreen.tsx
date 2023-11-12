import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install react-native-vector-icons
import ChatMessage from "../components/ChatMessage";
import {
  addImage,
  addMessage,
  updateConversation,
  updateMessage,
} from "../state/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "../state/types/message";
import { AppState } from "../state/states/app-state";
import { saveSettings } from "../state/actions/settingsActions";
import Toast from "react-native-toast-message";
import InputModal from "../components/InputModel";
import OpenAI from "../services/OpenAIService";
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";

const ChatScreen = () => {
  const dispatch = useDispatch();

  const model = useSelector((state: AppState) => state.settings.modelName);
  const images = useSelector((state: AppState) => state.chats.images);

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

  const messages = conversations[currentConversationId]?.messages ?? [];
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
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: Date.now(),
      // imageUrls can be added if images are attached
    };

    const messages: any[] = [
      ...conversations[currentConversationId].messages.map((msg) => ({
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
      // const chatCompletionResult = await OpenAI.api.chat.completions.create({
      //   messages: messages,
      //   model,
      // });
      // const firstChoice = chatCompletionResult.choices[0];

      let messageContent = "";

      const newMessageFromAI: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: messageContent,
        timestamp: Date.now(),
        isLoading: true,
      };

      dispatch(addMessage(currentConversationId, newMessageFromAI));

      const messageIndex = messages.length;

      const stream = await OpenAI.api.chat.completions.create({
        messages: messages,
        model,
        stream: true,
      });
      for await (const chunk of stream) {
        // process.stdout.write(chunk.choices[0]?.delta?.content || '');
        messageContent += chunk.choices[0]?.delta?.content || "";

        newMessageFromAI.content = messageContent;

        console.log("messageIndex", messageIndex);
        dispatch(
          updateMessage(currentConversationId, newMessageFromAI, messageIndex)
        );
      }
      // set loading to false
      newMessageFromAI.isLoading = false;
      dispatch(
        updateMessage(currentConversationId, newMessageFromAI, messageIndex)
      );

      // system message to ask openai to give a title
      const systemMessage: ChatCompletionMessageParam = {
        role: "system",
        content: `
          Please give a short title to this conversation.
          Keep it short, within 20 words.
          One sentence only.
          Do not include any punctuation.
          Do not include any special characters.
          Do not need to quote the title.
          Your result is used directly as the title.
          `,
      };

      // title messages
      const titleMessages = [systemMessage, ...messages];

      // get new conversation title from openai
      const titleResult = await OpenAI.api.chat.completions.create({
        messages: titleMessages,
        model,
      });

      let title = titleResult.choices[0]?.message?.content || "Untitled";

      // check if title is too long, more than 20 words, so about 100 characters
      // just trim it
      if (title.length > 100) {
        title = title.substring(0, 100);
      }

      // trim any new line in the title
      title = title.replace(/(\r\n|\n|\r)/gm, "");

      // update conversation title
      dispatch(updateConversation(currentConversationId, title));
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

  const attachImageGallery = async () => {
    console.log("attachImageGallery");

    // open image picker by expo-image-picker, launch image library
    const result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      }
    );

    // log result
    console.log("result", result);

    // check if cancelled
    if (result.canceled) {
      return;
    }

    // for each result.assets
    // add to messages
    result.assets.forEach((asset) => {
      // add to messages
      dispatch(addImage(asset.uri));
    });
  };

  const attachImageCamera = async () => {
    console.log("attachImageCamera");

    // open image picker by expo-image-picker, launch camera
    const result: ImagePickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    // log result
    console.log("result", result);

    // check if cancelled
    if (result.canceled) {
      return;
    }

    // for each result.assets
    // add to messages
    result.assets.forEach((asset) => {
      // add to messages
      dispatch(addImage(asset.uri));
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </ScrollView>
      <View style={styles.bottomInputBarContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            // enter to send
            // shift+enter to new line
            focusable={true}
            autoFocus={true}
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            multiline={true}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <Pressable onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="black" />
          </Pressable>
        </View>
        <View style={styles.attachButtonsContainer}>
          <Pressable
            onPress={attachImageGallery}
            style={styles.attachImageGalleryButton}
          >
            <Ionicons name="image" size={22} color="black" />
          </Pressable>
          <Pressable
            onPress={attachImageCamera}
            style={styles.attachImageCameraButton}
          >
            <Ionicons name="camera" size={22} color="black" />
          </Pressable>
        </View>
      </View>
      {/* Display image thumbnails on top of the bottom input bar if images are attached */}
      <View style={styles.imageThumbnailsContainer}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.image_url.url }}
            style={styles.imageThumbnail}
          />
        ))}
      </View>
      {/* Modal to enter OpenAI API Key */}
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
    display: "flex",
    flex: 1,
  },
  bottomInputBarContainer: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  inputContainer: {
    display: "flex",
    flexBasis: "auto",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    alignItems: "center",
    flexGrow: 1,
    // borderTopWidth: 1,
    // borderColor: "#ddd",
  },
  input: {
    flexGrow: 1,
    height: 50,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 20,
    paddingTop: 14,
    paddingLeft: 18,
    paddingRight: 45, // Make room for the send button
    marginLeft: 15,
    marginRight: 5,
    marginVertical: 10,
    fontSize: 14,
    overflow: "hidden",
  },
  sendButton: {
    position: "absolute",
    right: 38,
    bottom: 23,
  },
  attachButtonsContainer: {
    flexBasis: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  attachImageGalleryButton: {
    position: "absolute",
    left: 8,
    bottom: 23,
  },
  attachImageCameraButton: {
    position: "absolute",
    left: 48,
    bottom: 23,
  },
  imageThumbnailsContainer: {
    position: "absolute",
    bottom: 70,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
});

export default ChatScreen;
