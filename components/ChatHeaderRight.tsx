// components/ChatHeaderRight.js
import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
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
import Dialog from "react-native-dialog";

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  const [dialogVisible, setDialogVisible] = useState(false);
  /*
  prompt: string,
  size: "1024x1024" | "1792x1024" | "1024x1792",
  numOfImages: number
  */
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [numOfImages, setNumOfImages] = useState(1);

  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  // test generate image
  const onPressGenerateImage = async () => {
    // log entry
    console.log("onPressGenerateImage start");

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
    // prepare the Message containing the url of the generated image
    const newMessageFromAI: Message & ChatCompletionMessageParam = {
      role: "assistant",
      type: "image",
      timestamp: Date.now(),
      isLoading: true,
    };

    // add the message to the current conversation
    dispatch(addMessage(currentConversationId, newMessageFromAI));

    const messages: (Message & ChatCompletionMessageParam)[] = [
      ...conversations[currentConversationId].messages,
    ];

    const response = await OpenAI.api.images.generate({
      model: "dall-e-3",
      prompt,
      n: numOfImages,
      size,
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
                  "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-88wBwfFBOpztOgr5PqZIriNt/user-qGyWeZzogrFKJ6uMRTK1yJim/img-JOppxLff75Pn8RxGvoTO0wuN.png?st=2024-02-26T03%3A08%3A45Z&se=2024-02-26T05%3A08%3A45Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-02-25T12%3A14%3A56Z&ske=2024-02-26T12%3A14%3A56Z&sks=b&skv=2021-08-06&sig=LkGb6uxSMfFH5k6wqCuZQQjJg7bUbFy5ikrGBBlS/n8%3D"
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
    newMessageFromAI.content = response.data[0].url;

    // update the message to the current conversation
    const messageIndex = messages.length;
    dispatch(
      updateMessage(currentConversationId, newMessageFromAI, messageIndex)
    );
  };

  return (
    <View style={styles.container}>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Generate Dall-e-3 Image</Dialog.Title>
        <Dialog.Description>
          Please enter the prompt, size, and number of images.
        </Dialog.Description>
        <Dialog.Input label="Prompt" onChangeText={setPrompt} value={prompt} />
        <Dialog.Input label="Size" onChangeText={setSize} value={size} />
        <Dialog.Input
          label="Number of Images"
          onChangeText={(value) => setNumOfImages(parseInt(value))}
          value={numOfImages.toString()}
        />
        <Dialog.Button label="Confirm" onPress={handleImageGenerationConfirm} />
        <Dialog.Button label="Cancel" onPress={handleImageGenerationCancel} />
      </Dialog.Container>

      {/* add a pressable button to test generate Dall-e-3 image, if environment is development */}
      {__DEV__ && (
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            onPressGenerateImage();
          }}
        >
          <Ionicons name="aperture" size={24} color="black" />
        </Pressable>
      )}

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
