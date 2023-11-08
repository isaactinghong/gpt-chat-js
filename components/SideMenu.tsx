// src/components/SideMenu.js
import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "../theme/GlobalStyles";
import { version } from "../package.json";
import { useSelector } from "react-redux";
import { AppState } from "../state/types/app-state";
import { Conversation } from "../state/types/conversation";
import {
  createConversation,
  selectConversation,
} from "../state/actions/chatActions";
import { useDispatch } from "react-redux";

const SideMenu = ({ navigation }) => {
  // load conversations from store
  const conversationList: Conversation[] = useSelector((state: AppState) =>
    state.chats.conversations
      ? Object.values(state.chats.conversations).reverse()
      : []
  );
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.containerView}>
        {/* Top of the side menu: New Conversation */}
        <Button
          color={"#000"}
          title="New Conversation"
          onPress={() => {
            // dispatch action to add new conversation
            dispatch(createConversation());

            /* Navigate to new conversation screen */
            navigation.navigate("Chat");
          }}
        />

        {/* List of chat conversations, expanded and scrollable */}
        <ScrollView style={styles.conversationList}>
          {/* list the conversations */}
          {conversationList.map((conversation) => (
            <Text
              key={conversation.id}
              style={styles.conversationTitle}
              onPress={() => {
                // select the conversation
                dispatch(selectConversation(conversation.id));

                /* Navigate to conversation screen */
                navigation.navigate("Chat");
              }}
            >
              {conversation.title}
            </Text>
          ))}
        </ScrollView>

        {/* Bottom of the side menu */}
        <View style={styles.gptModelInputView}>
          {/* label: model: */}
          <Text style={styles.inputLabel}>Model:</Text>
          {/* input: model name */}
          <TextInput
            style={styles.gptModelInput}
            placeholder="GPT Model Name"
            defaultValue="gpt-4-vision-preview"
          />
        </View>
        <View style={styles.systemMessageInputView}>
          {/* label: system message: */}
          <Text style={styles.inputLabel}>Sys. Msg:</Text>
          {/* input: system message */}
          <TextInput
            style={styles.systemMessageInput}
            placeholder="System Message"
            numberOfLines={2}
            multiline={true}
            defaultValue="Chat with me."
          />
        </View>
        <Button
          color={"#000"}
          title="Settings"
          onPress={() => {
            /* Navigate to settings screen */
            navigation.navigate("Settings");
          }}
        />
        <Text style={styles.versionText}>Version {version}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newConversationButton: {
    marginBottom: 10,
  },
  containerView: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
    gap: 15,
  },
  conversationList: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  gptModelInput: {
    flex: 1,
    marginLeft: 5,
    padding: 5,
  },
  gptModelInputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  systemMessageInputView: {
    flexDirection: "row",
  },
  systemMessageInput: {
    flex: 1,
    marginLeft: 5,
    padding: 5,
  },
  versionText: {
    alignSelf: "center",
    fontSize: 11,
  },
});

export default SideMenu;
