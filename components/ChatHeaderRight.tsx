import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  Text,
  TextInput,
  Clipboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  createConversation,
  deleteConversation,
  updateMessage,
} from "../state/actions/chatActions";
import { AppState } from "../state/states/app-state";
import OpenAI from "../services/OpenAIService";
import { Message } from "../state/types/message";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { storeImage } from "../idb/images-db";
import Toast from 'react-native-toast-message';
import { ChatCompletionMessageParam } from 'openai/resources';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy'
import { faBrush } from '@fortawesome/free-solid-svg-icons/faBrush'

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
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

  const toggleContextMenu = () => {
    setContextMenuVisible(!contextMenuVisible);
  };

  const onPressGenerateImage = (event) => {
    setContextMenuVisible(false);
    setDialogVisible(true);
  };

  const handleCopyConversation = () => {
    setContextMenuVisible(false);

    try {
      let conversation = conversations[currentConversationId].title + "\n\n";
      conversation += conversations[currentConversationId].messages.map((message) => {
        return `${message.role}: \n${message.content}`;
      }).join("\n\n");

      navigator.clipboard.writeText(conversation);

      Toast.show({
        type: "success",
        text1: "Conversation copied to clipboard",
      });
    } catch (e) {
      console.log("Failed to copy to clipboard", e);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to copy to clipboard",
      });
    }
  };

  const handleImageGenerationConfirm = () => {
    setDialogVisible(false);
    callAPIToGenerateDalle3Image(
      prompt,
      size as "1024x1024" | "1792x1024" | "1024x1792",
      numOfImages
    );
  };

  const handleImageGenerationCancel = () => {
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

    const newMessageFromAI: Message & ChatCompletionMessageParam = {
      role: "assistant",
      type: "image",
      content: prompt,
      imageSize: size,
      timestamp: Date.now(),
      isLoading: true,
    };

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

      newMessageFromAI.isLoading = false;
      newMessageFromAI.images = [];

      for (const image of response.data) {
        const base64image = image.b64_json;
        const base64imageUri = `data:image/jpeg;base64,${base64image}`;
        const id = await storeImage(base64imageUri, currentConversationId);
        const localImage = { id };
        newMessageFromAI.images.push(localImage);
      }

      newMessageFromAI.content += `\n\nRevised Prompt: ${response.data[0].revised_prompt}`;

      const messageIndex = messages.length;
      dispatch(
        updateMessage(currentConversationId, newMessageFromAI, messageIndex)
      );
    } catch (e) {
      console.log(e);
      newMessageFromAI.isLoading = false;
      newMessageFromAI.content = `Error: ${e}`;
      newMessageFromAI.type = "text";

      const messageIndex = messages.length;
      dispatch(
        updateMessage(currentConversationId, newMessageFromAI, messageIndex)
      );
    }
  };

  useEffect(() => {
    if (numOfImages < 1) {
      setNumOfImages(1);
    } else if (numOfImages > 3) {
      setNumOfImages(3);
    }
  }, [numOfImages]);

  return (
    <View style={styles.container}>
      {/* Context Menu Modal */}
      <Modal
        transparent={true}
        visible={contextMenuVisible}
        onRequestClose={() => setContextMenuVisible(false)}
        animationType="fade"
      >
        <Pressable
          style={styles.contextMenuBackground}
          onPress={() => setContextMenuVisible(false)}
        >
          <View style={styles.contextMenu}>
            <Pressable onPress={handleCopyConversation} style={styles.menuItem}>
              {/* copy icon, regular */}
              <FontAwesomeIcon icon={faCopy} />
              <Text style={styles.menuItemText}>
                Copy Conversation to Clipboard
              </Text>
            </Pressable>
            <Pressable onPress={onPressGenerateImage} style={styles.menuItem}>
              {/* brush icon */}
              <FontAwesomeIcon icon={faBrush} />
              <Text style={styles.menuItemText}>Generate Dall-e-3 Image</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={dialogVisible}
        onRequestClose={() => {
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
            </View>
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
        {/* Action Menu Button */}
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            dispatch(createConversation());
          }}
        >
          <Ionicons name="add" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            dispatch(deleteConversation(currentConversationId));
          }}
        >
          <Ionicons name="trash-outline" size={20} color="black" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={toggleContextMenu}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </Pressable>
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
    backgroundColor: "#000",
    color: "#fff",
  },
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
    padding: 5,
    flexGrow: 1,
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
    width: 50,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  contextMenuBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contextMenu: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default ChatHeaderRight;