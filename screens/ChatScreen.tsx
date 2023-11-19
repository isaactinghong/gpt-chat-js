import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Platform,
} from "react-native";
import {
  addImage,
  addMessage,
  clearImages,
  removeImage,
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
  Chat,
  ChatCompletionAssistantMessageParam,
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
// react-native-image-zoom-viewer
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
// browser-image-compression
import imageCompression from "browser-image-compression";
// idb
import * as idb from "idb";
import { getImage, storeImage } from "../idb/images-db";
import ChatMessage from "../components/ChatMessage";
import { Ionicons } from "@expo/vector-icons";
import RecordVoiceButton from "../components/RecordVoiceButton";

const ChatScreen = () => {
  const dispatch = useDispatch();

  const model = useSelector((state: AppState) => state.settings.modelName);
  const imagesToUpload = useSelector(
    (state: AppState) => state.chats.imagesToUpload
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [imageIndexsHovered, setImageIndexsHovered] = useState({}); // array of image indexes that are hovered

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imagesToPreview, setImagesToPreview] = useState([]); // array of images to preview in image viewer
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // index of selected image to preview in image viewer

  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  const openAiApiKey = useSelector(
    (state: AppState) => state.settings.openAiApiKey
  );
  const systemMessage = useSelector(
    (state: AppState) => state.settings.systemMessage
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
    // if inputText is empty and images is empty, do nothing
    if (!inputText && imagesToUpload?.length === 0) {
      return;
    }

    // check if settings store's openAiApiKey is set
    if (!openAiApiKey) {
      setModalVisible(true);
      return;
    }

    // if images are present, add them to messages
    let newMessage: Message & ChatCompletionMessageParam;

    let newMessageToStore: Message & ChatCompletionMessageParam;
    if (imagesToUpload && imagesToUpload.length > 0) {
      const content: Array<ChatCompletionContentPart> = [];

      // add text message
      content.push({
        type: "text",
        text: inputText,
      });

      for (const localImage of imagesToUpload) {
        // get the image from IndexedDB
        const imageFromDB = await getImage(localImage.id);

        const image_url: ChatCompletionContentPartImage.ImageURL = {
          url: imageFromDB.uri,
        };
        // add image message
        content.push({
          type: "image_url",
          image_url,
        });
      }

      newMessage = {
        role: "user",
        content,
        timestamp: Date.now(),
      };

      // newMessageToStore
      // - move the messages' image content to messages' images (LocalImage[])
      newMessageToStore = {
        ...newMessage,
        content: (
          content.filter(
            (contentPart) => contentPart.type === "text"
          )[0] as ChatCompletionContentPartText
        )?.text,
        images: imagesToUpload.map((localImage) => ({
          id: localImage.id,
          // base64: localImage.base64, // do not store base64 in redux store
        })),
      };
    }
    // else just add text message
    else {
      newMessage = {
        role: "user",
        content: inputText,
        timestamp: Date.now(),
      };
      newMessageToStore = newMessage;
    }

    const messages: (Message & ChatCompletionMessageParam)[] = [
      ...conversations[currentConversationId].messages,
      newMessage,
    ];

    // system message to ask openai to give a title
    const firstChatMessage: ChatCompletionMessageParam = {
      role: "system",
      content: systemMessage,
    };

    // chat messages for openai to generate response
    const chatMessages: (Message & ChatCompletionMessageParam)[] = [
      firstChatMessage,
      ...messages,
    ];

    dispatch(addMessage(currentConversationId, newMessageToStore));

    // clear input
    setInputText("");

    // clear images
    dispatch(clearImages());

    try {
      // const chatCompletionResult = await OpenAI.api.chat.completions.create({
      //   messages: messages,
      //   model,
      // });
      // const firstChoice = chatCompletionResult.choices[0];

      let messageContent = "";

      const newMessageFromAI: Message & ChatCompletionMessageParam = {
        role: "assistant",
        content: messageContent,
        timestamp: Date.now(),
        isLoading: true,
      };

      dispatch(addMessage(currentConversationId, newMessageFromAI));

      const messageIndex = messages.length;

      try {
        const chatMessagesToOpenAI: ChatCompletionMessageParam[] = [];
        for (const msg of chatMessages) {
          let openAIContent = msg.content;
          if (msg.images?.length > 0) {
            const indexedDBImages = await Promise.all(
              msg.images?.map(async (localImage) => {
                // fetch the base64 image from IndexedDB
                return await getImage(localImage.id);
              })
            );
            if (msg.images?.length > 0) {
              openAIContent = [
                // add text message
                // check if content is string
                // if not, get the first element of the array
                ...(typeof msg.content === "string"
                  ? [
                      {
                        type: "text",
                        text: msg.content,
                      },
                    ]
                  : [
                      {
                        type: "text",
                        text: (msg.content[0] as ChatCompletionContentPartText)
                          .text,
                      },
                    ]),

                // add image messages
                ...indexedDBImages.map((indexedDBImage) => {
                  const image_url: ChatCompletionContentPartImage.ImageURL = {
                    url: indexedDBImage.uri,
                  };

                  return {
                    type: "image_url",
                    image_url,
                  };
                }),
              ] as ChatCompletionContentPart[];
            }
          }
          chatMessagesToOpenAI.push({
            role: msg.role,
            content: openAIContent,
          } as ChatCompletionMessageParam);
        }

        const stream = await OpenAI.api.chat.completions.create({
          messages: chatMessagesToOpenAI,
          model,
          max_tokens: 4096,
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
      } catch (error) {
        console.log("Error", error);

        // show error toast message
        Toast.show({
          type: "error",
          text1: "Error calling OpenAI API",
          text2: error.message,
        });
      } finally {
        // set loading to false
        newMessageFromAI.isLoading = false;
        dispatch(
          updateMessage(currentConversationId, newMessageFromAI, messageIndex)
        );
      }

      // add the new message from AI to messages
      messages.push({
        role: "assistant",
        content: messageContent,
        timestamp: Date.now(),
      } as ChatCompletionAssistantMessageParam);

      // system message to ask openai to give a title
      const firstMessage: ChatCompletionMessageParam = {
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
      const titleMessages = [
        firstMessage,
        ...messages.map((msg) => {
          // if content type is array,
          // set content as the first element of the array
          if (Array.isArray(msg.content)) {
            return {
              ...msg,
              content: (msg.content[0] as ChatCompletionContentPartText).text,
            };
          }
          return msg;
        }),
      ];

      // get new conversation title from openai
      try {
        const titleResult = await OpenAI.api.chat.completions.create({
          messages: titleMessages.map(
            (msg) =>
              ({
                role: msg.role,
                content: msg.content,
              } as ChatCompletionMessageParam)
          ),
          model: "gpt-4-1106-preview",
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
          text1: "Error calling OpenAI API for conversation title",
          text2: error.message,
        });
      }
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
        allowsMultipleSelection: true,
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
    result.assets.forEach(async (asset) => {
      // compress the image
      const compressedImage = await compressImage(asset.uri);

      // use IndexedDB to store the compressed image
      const id = await storeImage(compressedImage, currentConversationId);

      const localImage = {
        id,
        base64: compressedImage,
      };

      // just add the original image
      dispatch(addImage(localImage));
    });
  };

  const compressImage = async (uri: string) => {
    // browser-image-compression

    const file = await imageCompression.getFilefromDataUrl(uri, "image");

    const options = {
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      maxIteration: 2,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      // return the compressed file
      return imageCompression.getDataUrlFromFile(compressedFile);
    } catch (error) {
      // show error toast message
      Toast.show({
        type: "error",
        text1: "Error compressing image",
        text2: error.message,
      });

      console.log(error);
    }

    return uri;
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
    result.assets.forEach(async (asset) => {
      // compress the image
      const compressedImage = await compressImage(asset.uri);

      // use IndexedDB to store the compressed image
      const id = await storeImage(compressedImage, currentConversationId);

      const localImage = {
        id,
        base64: compressedImage,
      };

      // add to messages
      dispatch(addImage(localImage));
    });
  };

  const handleImageHoverIn = (index) => {
    console.log("handleImageHoverIn", index);

    // set imageIndexsHovered[index] to true
    setImageIndexsHovered({ ...imageIndexsHovered, [index]: true });
  };

  const handleImageHoverOut = (index) => {
    console.log("handleImageHoverOut", index);

    // set imageIndexsHovered[index] to false
    setImageIndexsHovered({ ...imageIndexsHovered, [index]: false });
  };

  const handleImagePress = (index) => {
    console.log("handleImagePress", index);

    // delete from imagesHovered
    dispatch(removeImage(index));
  };

  const openImageViewer = (images: IImageInfo[], selectedIndex: number) => {
    console.log("openImageViewer", images, selectedIndex);

    // set selectedImageIndex
    setSelectedImageIndex(selectedIndex);

    // set imagesToPreview
    setImagesToPreview(images);

    // open image viewer
    setImageViewerVisible(true);
  };

  const handleMessageKeyPress = (event) => {
    // Check if we're on a device that traditionally has a hardware keyboard
    const isHardwareKeyboard = !/iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    );

    if (Platform.OS === "web" && isHardwareKeyboard) {
      // Traditional desktop handling
      if (event.nativeEvent.key === "Enter" && !event.nativeEvent.shiftKey) {
        console.log("handleMessageKeyPress enter", inputText);
        sendMessage();
        event.preventDefault(); // stop event propagation
      } else if (
        event.nativeEvent.key === "Enter" &&
        event.nativeEvent.shiftKey
      ) {
        console.log("handleMessageKeyPress shift+enter", inputText);
        setInputText(inputText + "\n"); // Add a line break
        event.preventDefault(); // stop event propagation
      }
    } else if (Platform.OS === "web" && !isHardwareKeyboard) {
      // Mobile browser handling (where we treat Enter as newline)
      if (event.nativeEvent.key === "Enter") {
        console.log(
          "handleMessageKeyPress return key on mobile browser",
          inputText
        );
        setInputText(inputText + "\n"); // Add a line break
        event.preventDefault(); // stop event propagation
      }
    }
  };

  const processWhisperResult = (result: string) => {
    console.log("processWhisperResult", result);

    // append to inputText, with newline if inputText is not empty
    setInputText(inputText + (inputText ? "\n" + result : result));

    // focus on the input
    document.getElementById("input")?.focus();
  };

  // catch CREATE_CONVERSATION action event in affect
  // to focus on the input
  useEffect(() => {
    // focus on the input
    document.getElementById("input")?.focus();
  }, [currentConversationId]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            openImageViewer={openImageViewer}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomInputBarContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            // enter to send
            // shift+enter to new line
            id="input"
            focusable={true}
            autoFocus={true}
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            multiline={true}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            onKeyPress={handleMessageKeyPress}
            blurOnSubmit
          />
          <RecordVoiceButton onWhisperResult={processWhisperResult} />
          <Pressable
            disabled={!inputText && imagesToUpload?.length === 0}
            onPress={sendMessage}
            style={styles.sendButton}
          >
            <Ionicons
              name="send"
              size={22}
              color={
                !inputText && imagesToUpload?.length === 0 ? "grey" : "black"
              }
            />
          </Pressable>
        </View>
        <View style={styles.attachButtonsContainer}>
          <Pressable
            onPress={attachImageGallery}
            style={styles.attachImageGalleryButton}
          >
            <Ionicons name="image" size={22} color="black" />
          </Pressable>
          {/* <Pressable
            onPress={attachImageCamera}
            style={styles.attachImageCameraButton}
          >
            <Ionicons name="camera" size={22} color="black" />
          </Pressable> */}
        </View>
      </View>
      {/* Display image thumbnails on top of the bottom input bar if images are attached */}
      {imagesToUpload != null && (
        <View style={styles.imageThumbnailsContainer}>
          {imagesToUpload.map((image, index) => (
            <Pressable
              key={index}
              onHoverIn={() => handleImageHoverIn(index)}
              onHoverOut={() => handleImageHoverOut(index)}
              onPress={() => handleImagePress(index)}
            >
              <View>
                <Image
                  key={index}
                  source={{ uri: image.base64 }}
                  style={styles.imageThumbnail}
                />
                {/* show delete icon if hovered */}
                {imageIndexsHovered[index] && (
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color="black"
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      zIndex: 1,
                    }}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}
      {/* Modal to enter OpenAI API Key */}
      <InputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmApiKey}
        title="Enter your OpenAI API Key:"
      />
      {/* Modal to show image viewer */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <ImageViewer
          imageUrls={imagesToPreview}
          index={selectedImageIndex}
          onSwipeDown={() => setImageViewerVisible(false)}
          enableSwipeDown={true}
          enableImageZoom={true}
        />
      </Modal>
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
    paddingHorizontal: 0,
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
    paddingRight: 70, // Make room for the send button
    marginLeft: 5,
    marginRight: 0,
    marginVertical: 10,
    fontSize: 14,
    overflow: "hidden",
  },
  // recordVoiceButton: {
  //   position: "absolute",
  //   right: 78,
  //   bottom: 23,
  //   flexDirection: "row",
  // },
  sendButton: {
    position: "absolute",
    right: 18,
    bottom: 23,
  },
  attachButtonsContainer: {
    flexBasis: 40,
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
  // attachImageCameraButton: {
  //   position: "absolute",
  //   left: 48,
  //   bottom: 23,
  // },
  imageThumbnailsContainer: {
    position: "absolute",
    bottom: 70,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5,
    gap: 5,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default ChatScreen;
