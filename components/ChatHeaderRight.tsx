// components/ChatHeaderRight.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  Text,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import {
  addMessage,
  createConversation,
  deleteConversation,
  updateMessage,
} from "../state/actions/chatActions";
import { useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";
import OpenAI from "../services/OpenAIService";
import { Message } from "../state/types/message";
import { ChatCompletionMessageParam } from "openai/resources";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { storeImage } from "../idb/images-db";
import Toast from 'react-native-toast-message';

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  // add brush to awesome font

  const [dialogVisible, setDialogVisible] = useState(false);
  /*
  prompt: string,
  size: "1024x1024" | "1792x1024" | "1024x1792",
  numOfImages: number
  */
  const [prompt, setPrompt] = useState("");

  const [sizeOpen, setSizeOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("1024x1024");
  const [sizes, setSizes] = useState([
    { label: "1024x1024", value: "1024x1024" },
    { label: "1792x1024", value: "1792x1024" },
    { label: "1024x1792", value: "1024x1792" },
  ]);
  const [numOfImages, setNumOfImages] = useState(1);

  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  // test generate image
  const onPressGenerateImage = async (event) => {
    // log entry
    console.log("onPressGenerateImage start");

    // fill the prompt with any cursor selected text
    const prompt = window.getSelection().toString();

    console.log("prefill prompt:", prompt);

    // if prompt is not empty, set it
    if (prompt) {
      setPrompt(prompt);
    }

    // show dialog
    setDialogVisible(true);
  };

  // handle image generation confirm
  const handleImageGenerationConfirm = () => {
    // log entry
    console.log("handleImageGenerationConfirm start");

    // hide dialog
    setDialogVisible(false);

    // call API to generate Dall-e-3 image
    callAPIToGenerateDalle3Image(
      prompt,
      size as "1024x1024" | "1792x1024" | "1024x1792",
      numOfImages
    );
  };

  // handle image generation cancel
  const handleImageGenerationCancel = () => {
    // log entry
    console.log("handleImageGenerationCancel start");

    // hide dialog
    setDialogVisible(false);
  };

  const callAPIToGenerateDalle3Image = async (
    prompt: string,
    size: "1024x1024" | "1792x1024" | "1024x1792",
    numOfImages: number
  ) => {
    const messages: (Message & ChatCompletionMessageParam)[] = [
      ...conversations[currentConversationId].messages,
    ];

    // prepare the Message containing the url of the generated image
    const newMessageFromAI: Message & ChatCompletionMessageParam = {
      role: "assistant",
      type: "image",
      content: prompt,
      imageSize: size,
      timestamp: Date.now(),
      isLoading: true,
    };

    // add the message to the current conversation
    dispatch(addMessage(currentConversationId, newMessageFromAI));

    try {
      const response = await OpenAI.api.images.generate({
        model: "dall-e-3",
        prompt,
        n: numOfImages,
        size,
        quality: "hd",
        style: "natural",
        response_format: "b64_json",
      });

      // log response
      console.log("onPressGenerateImage response", response);

      /*
      response:
      {
          "created": 1708920525,
          "data": [
              {
                  "revised_prompt": "Picture a common siamese cat with a twist: its fur is predominantly white, as opposed to the usual cream or fawn. Its blue eyes are still stunning against its unusual fur color. Despite the white coat, it has the signature features of a siamese such as the darker face, ears, paws, and tail. The cat is softly sitting on a lush green lawn, showing a mix of curiosity and alertness typical of these creatures. The sunlight gently illuminates its fur, causing it to take on a subtle, beautiful glow.",
                  "b64_json": "..."
              }
          ]
      }
    */

      /*
      export const addMessage = (
        conversationId: string,
        message: Message & ChatCompletionMessageParam
      ): ChatActionTypes => ({
        type: ADD_MESSAGE,
        payload: { conversationId, message },
      });

      ChatCompletionAssistantMessageParam

    */

      // update the message with the generated image
      newMessageFromAI.isLoading = false;
      newMessageFromAI.images = [];

      for (const image of response.data) {
        // base64 image
        const base64image = image.b64_json;

        const base64imageUri = `data:image/jpeg;base64,${base64image}`;

        // use IndexedDB to store the compressed image
        const id = await storeImage(base64imageUri, currentConversationId);

        const localImage = {
          id,
          // base64: base64image,
        };

        newMessageFromAI.images.push(localImage);
      }

      // add revised_prompt to the message.content
      newMessageFromAI.content += `\n\nRevised Prompt: ${response.data[0].revised_prompt}`;

      // update the message to the current conversation
      const messageIndex = messages.length;
      dispatch(
        updateMessage(currentConversationId, newMessageFromAI, messageIndex)
      );
    } catch (e) {
      console.log(e);

      // update the message with the error
      newMessageFromAI.isLoading = false;
      newMessageFromAI.content = `Error: ${e}`;
      newMessageFromAI.type = "text";

      // update the message to the current conversation
      const messageIndex = messages.length;
      dispatch(
        updateMessage(currentConversationId, newMessageFromAI, messageIndex)
      );
    }
  };

  // effect to handle number of images. 1-3.
  React.useEffect(() => {
    if (numOfImages < 1) {
      setNumOfImages(1);
    } else if (numOfImages > 3) {
      setNumOfImages(3);
    } else {
      // do nothing
    }
  }, [numOfImages]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={dialogVisible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
          handleImageGenerationCancel();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textStyle}>Generate Dall-e-3 Image</Text>
            <Text style={styles.modalText}>
              Generate an image using Dall-e-3 model
            </Text>
            <View style={styles.inputsContainer}>
              <View
                style={[styles.inputContainer, styles.inputContainerPrompt]}
              >
                <Text style={styles.inputContainerLabel}>Prompt:</Text>
                <TextInput
                  style={styles.inputPrompt}
                  value={prompt}
                  onChangeText={setPrompt}
                  multiline
                  numberOfLines={5}
                />
              </View>
              <View style={[styles.inputContainer]}>
                <Text style={styles.inputContainerLabel}>Size:</Text>
                <View
                  style={{
                    ...styles.inputSizeView,
                    elevation: active === 1 ? 99 : 1,
                    zIndex: active === 1 ? 99 : 1,
                  }}
                >
                  {/* dropdown to select size */}
                  <DropDownPicker
                    style={styles.inputSize}
                    disabled={active === 3 || active === 2}
                    onOpen={() => setActive(1)}
                    onClose={() => setActive(0)}
                    open={sizeOpen}
                    value={size}
                    items={sizes}
                    setOpen={setSizeOpen}
                    setValue={setSize}
                    setItems={setSizes}
                    placeholder={"Select an image size"}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputContainerNumOfImages,
                ]}
              >
                <Text style={styles.inputContainerLabel}>
                  Number of Images:
                </Text>
                <View
                  style={
                    (styles.inputContainerValue,
                      styles.inputContainerValueNumOfImages)
                  }
                >
                  <TextInput
                    style={styles.inputNumOfImages}
                    keyboardType="numeric"
                    value={numOfImages.toString()}
                    editable={false}
                  />
                  {/* add and subtract buttons */}
                  <Pressable onPress={() => setNumOfImages(numOfImages + 1)}>
                    <Ionicons name="add" size={24} color="black" />
                  </Pressable>
                  <Pressable onPress={() => setNumOfImages(numOfImages - 1)}>
                    <Ionicons name="remove" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
            </View>
            {/* row of buttons */
            /* confirm and cancel buttons */}
            <View style={styles.buttonRowView}>
              <Pressable
                style={[styles.button]}
                onPress={() => handleImageGenerationConfirm()}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => handleImageGenerationCancel()}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.actionButtons}>

        {/* add a pressable button to copy the whole conversation to clipboard */}
        <Pressable
          style={styles.actionButton}
          onPress={(event) => {
            // log
            console.log("copy conversation to clipboard");

            // copy the whole conversation to clipboard
            try {

              // start with title
              let conversation = conversations[currentConversationId].title + "\n\n";

              // add all messages with role and content
              conversation += conversations[currentConversationId].messages.map((message) => {
                return `${message.role}: \n${message.content}`;
              }).join("\n\n");

              navigator.clipboard.writeText(conversation);

              Toast.show({
                type: "success",
                text1: "Conversation copied to clipboard",
              });
            }
            catch (e) {
              console.log("Failed to copy to clipboard", e);

              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to copy to clipboard",
              });
            }
          }}
        >
          <Ionicons name="copy-outline" size={18} color="black" />
        </Pressable>

        {/* add a pressable button to test generate Dall-e-3 image */}
        <Pressable
          style={styles.actionButton}
          onPress={(event) => {
            onPressGenerateImage(event);
          }}
        >
          {/* <Ionicons name="aperture" size={24} color="black" /> */}
          <FontAwesomeIcon icon="brush" size={18} color="black" />
        </Pressable>

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
    // marginLeft: 10,
    // marginRight: 5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
    marginRight: 5,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    gap: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // black button, white text
    backgroundColor: "#000",
    color: "#fff",
  },
  // buttonOpen: {},
  // buttonClose: {},
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonRowView: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    zIndex: -1,
  },
  inputsContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 0,
  },
  inputContainerNumOfImages: {
    display: "none",
    flexDirection: "row",
  },
  inputContainerPrompt: {
    flexGrow: 1,
  },
  inputContainerLabel: {
    flex: 1,
  },
  inputContainerValue: {
    flex: 1,
    // show border
    // borderWidth: 1,
    padding: 5,
    flexGrow: 1,
    // width: "100%",
  },
  inputContainerValueNumOfImages: {
    flexDirection: "row",
    gap: 10,
  },
  inputPrompt: {
    flex: 1,
    flexGrow: 1,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
  },
  inputSizeView: {
    zIndex: 5000,
    flex: 1,
  },
  inputSize: {
    zIndex: 5000,
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  inputNumOfImages: {
    // flex: 1,
    width: 50,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default ChatHeaderRight;
