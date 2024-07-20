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
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faBrush } from '@fortawesome/free-solid-svg-icons/faBrush'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { SpeechCreateParams } from 'openai/resources/audio/speech';

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  // Dall-e-3 Image Generation Modal
  const [dallEDialogVisible, setDallEDialogVisible] = useState(false);
  const [dallEPrompt, setPrompt] = useState("");
  const [sizeOpen, setSizeOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("1024x1024");
  const [sizes, setSizes] = useState([
    { label: "1024x1024", value: "1024x1024" },
    { label: "1792x1024", value: "1792x1024" },
    { label: "1024x1792", value: "1024x1792" },
  ]);
  const [numOfImages, setNumOfImages] = useState(1);

  // Text-to-speech Generation Modal
  const [ttpDialogVisible, setTTPDialogVisible] = useState(false);
  const [ttpPrompt, setTTPPrompt] = useState("");
  const [ttpModel, setTTPModel] = useState<SpeechCreateParams["model"]>("tts-1");
  const [ttpModelOpen, setTTPModelOpen] = useState(false);
  const [ttpVoice, setTTPVoice] = useState<SpeechCreateParams["voice"]>("alloy");
  const [ttpVoiceOpen, setTTPVoiceOpen] = useState(false);
  // `0.25` to `4.0`
  const [ttpSpeed, setTTPSpeed] = useState<SpeechCreateParams["speed"]>(1.0);
  const [ttpFormat, setTTPFormat] = useState<SpeechCreateParams["response_format"]>("mp3");
  const [ttpFormatOpen, setTTPFormatOpen] = useState(false);

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
    setDallEDialogVisible(true);
  };

  const onPressGenerateVoice = (event) => {
    setContextMenuVisible(false);
    console.log("Generate Voice");
    setTTPDialogVisible(true);
  }

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
    setDallEDialogVisible(false);
    callAPIToGenerateDalle3Image(
      dallEPrompt,
      size as "1024x1024" | "1792x1024" | "1024x1792",
      numOfImages
    );
  };

  const handleVoiceGenerationConfirm = () => {
    // setTTPDialogVisible(false);
    callAPIToGenerateTextToSpeech({
      prompt: ttpPrompt,
      model: ttpModel,
      voice: ttpVoice,
      speed: ttpSpeed,
      format: ttpFormat,
    });
  }

  const handleImageGenerationCancel = () => {
    setDallEDialogVisible(false);
  };

  const handleVoiceGenerationQuit = () => {
    setTTPDialogVisible(false);
  }

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

  const callAPIToGenerateTextToSpeech = async ({
    prompt,
    model = "tts-1",
    voice = "alloy",
    speed = 1.0,
    format = "mp3",
  }: {
    prompt: string;
    model?: SpeechCreateParams["model"];
    voice?: SpeechCreateParams["voice"];
    speed?: SpeechCreateParams["speed"];
    format?: SpeechCreateParams["response_format"];
  }) => {

    try {
      const response = await OpenAI.api.audio.speech.create({
        model,
        input: prompt,
        voice,
        speed,
        response_format: format,
      });

      response.blob().then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audio.mp3";
        a.click();
        URL.revokeObjectURL(url);
      });


    } catch (e) {
      console.error(`Failed to generate audio: ${e}`);
    }
  }

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
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                dispatch(deleteConversation(currentConversationId));
              }}
            >
              {/* trash icon */}
              <FontAwesomeIcon icon={faTrash} />
              <Text style={styles.menuItemText}>Delete Conversation</Text>
            </Pressable>
            <Pressable onPress={onPressGenerateImage} style={styles.menuItem}>
              {/* brush icon */}
              <FontAwesomeIcon icon={faBrush} />
              <Text style={styles.menuItemText}>Dall-e-3 Image</Text>
            </Pressable>
            <Pressable onPress={onPressGenerateVoice} style={styles.menuItem}>
              {/* brush icon */}
              <FontAwesomeIcon icon={faComment} />
              <Text style={styles.menuItemText}>Text-to-speech</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Dall-e-3 Image Generation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dallEDialogVisible}
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
                  value={dallEPrompt}
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

      {/* Text-to-speech Generation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ttpDialogVisible}
        onRequestClose={() => {
          handleVoiceGenerationQuit();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textStyle}>Generate Text-to-speech</Text>
            <Text style={styles.modalText}>
              Generate a voice using OpenAI's Text-to-speech model
            </Text>
            <View style={[styles.itemsContainer]}>
              <View
                style={[styles.inputContainer, styles.inputContainerPrompt, styles.twoColumnItem, {
                  zIndex: 1,
                }]}
              >
                <Text style={styles.inputContainerLabel}>Prompt:</Text>
                <TextInput
                  style={styles.inputPrompt}
                  value={ttpPrompt}
                  onChangeText={setTTPPrompt}
                  multiline
                  numberOfLines={5}
                />
              </View>
              <View style={[styles.inputContainer, styles.oneColumnItem, {
                zIndex: 3,
              }]}>
                <Text style={styles.inputContainerLabel}>Model:</Text>
                {/* select from available models */}
                <DropDownPicker
                  style={styles.inputPrompt}
                  items={[
                    { label: "TTS-1", value: "tts-1" },
                    { label: "TTS-1-HD", value: "tts-1-hd" },
                  ]}
                  containerStyle={{ height: 40 }}
                  value={ttpModel}
                  multiple={false}
                  setValue={setTTPModel}
                  open={ttpModelOpen}
                  setOpen={setTTPModelOpen}
                />
              </View>
              <View style={[styles.inputContainer, styles.oneColumnItem, {
                zIndex: 2,
              }]}>
                <Text style={styles.inputContainerLabel}>Voice:</Text>
                {/* select from available voices */}
                <DropDownPicker
                  style={styles.inputPrompt}
                  items={[
                    { label: "Alloy", value: "alloy" },
                    { label: "Echo", value: "echo" },
                    { label: "Fable", value: "fable" },
                    { label: "Onyx", value: "onyx" },
                    { label: "Nova", value: "nova" },
                    { label: "Shimmer", value: "shimmer" },
                  ]}
                  containerStyle={{ height: 40 }}
                  value={ttpVoice}
                  multiple={false}
                  setValue={setTTPVoice}
                  open={ttpVoiceOpen}
                  setOpen={setTTPVoiceOpen}
                />
              </View>
              <View style={[styles.inputContainer, styles.oneColumnItem]}>
                <Text style={styles.inputContainerLabel}>Speed:</Text>
                <input
                  type="number"
                  style={
                    {
                      padding: 5,
                      height: 40,
                    }
                  }
                  value={String(ttpSpeed)}
                  step="0.25"
                  onChange={(value) => {
                    // if value is a number, set it
                    // else, ignore
                    const speed = parseFloat(value.target.value);
                    if (!isNaN(speed)) {
                      setTTPSpeed(speed);
                    }
                  }}
                />
              </View>
              <View style={[styles.inputContainer, styles.oneColumnItem]}>
                <Text style={styles.inputContainerLabel}>Format:</Text>
                <DropDownPicker
                  style={styles.inputPrompt}
                  items={[
                    { label: "MP3", value: "mp3" },
                    { label: "Opus", value: "opus" },
                    { label: "AAC", value: "aac" },
                    { label: "FLAC", value: "flac" },
                    { label: "WAV", value: "wav" },
                    { label: "PCM", value: "pcm" },
                  ]}
                  containerStyle={{ height: 40 }}
                  value={ttpFormat}
                  multiple={false}
                  setValue={setTTPFormat}
                  open={ttpFormatOpen}
                  setOpen={setTTPFormatOpen}
                />
              </View>
              <View style={styles.buttonRowView}>
                <Pressable
                  style={[styles.button]}
                  onPress={() => handleVoiceGenerationConfirm()}
                >
                  <Text style={styles.textStyle}>Generate</Text>
                </Pressable>
                <Pressable
                  style={[styles.button]}
                  onPress={() => handleVoiceGenerationQuit()}
                >
                  <Text style={styles.textStyle}>Quit</Text>
                </Pressable>
              </View>
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
    width: "100%",
    justifyContent: "center",
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
    gap: 5,
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
    flexShrink: 1,
    flexGrow: 0,
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
    flexDirection: "column",
    alignItems: 'flex-start',
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
  itemsContainer: {
    // grid of two columns
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  oneColumnItem: {
    zIndex: 1,
    // span 1 column
    flexBasis: "50%",
    padding: 5,
  },
  twoColumnItem: {
    zIndex: 1,
    // span 1 column
    flexBasis: "100%",
    padding: 5,
  },
});

export default ChatHeaderRight;