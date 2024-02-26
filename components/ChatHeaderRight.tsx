// components/ChatHeaderRight.js
import React from "react";
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
import OpenAI from '../services/OpenAIService';
import { Message } from '../state/types/message';
import { ChatCompletionMessageParam } from 'openai/resources';

const ChatHeaderRight = () => {
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state: AppState) => state.chats.conversations
  );
  const currentConversationId = useSelector(
    (state: any) => state.chats.currentConversationId
  );

  // test generate Dall-e-3 image
  const handleGenerateDalle3Image = async () => {
    // log entry
    console.log("handleGenerateDalle3Image start");

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
      prompt: "a white siamese cat",
      n: 1,
      size: "1024x1024", // Must be one of 1024x1024, 1792x1024, or 1024x1792 for dall-e-3 models.
    });

    // log response
    console.log("handleGenerateDalle3Image response", response);

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
    dispatch(updateMessage(currentConversationId, newMessageFromAI, messageIndex));

  }


  return (
    <View style={styles.container}>
      {/* add a pressable button to test generate Dall-e-3 image, if environment is development */}
      {__DEV__ && (
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            handleGenerateDalle3Image();
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
