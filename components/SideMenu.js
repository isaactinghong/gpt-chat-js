// src/components/SideMenu.js
import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "../theme/GlobalStyles";
import { version } from "../package.json";

const conversations = [
  {
    id: 1,
    title:
      "This is a development-only warning and won't be shown in production.",
  },
  {
    id: 2,
    title: "Conversation 2",
  },
  {
    id: 3,
    title: "Conversation 3",
  },
  {
    id: 4,
    title: "If you're trying to navigate to a screen in a nested navigator",
  },
  {
    id: 5,
    title: "Conversation 5",
  },
  {
    id: 6,
    title: "Conversation 6",
  },
  {
    id: 7,
    title: "Conversation 7",
  },
  {
    id: 8,
    title: "Conversation 8",
  },
  {
    id: 9,
    title: "Conversation 9",
  },
  {
    id: 10,
    title: "Conversation 10",
  },
  {
    id: 11,
    title: "Conversation 11",
  },
  {
    id: 12,
    title: "Conversation 12",
  },
  {
    id: 13,
    title: "Conversation 13",
  },
  {
    id: 14,
    title: "Conversation 14",
  },
  {
    id: 15,
    title: "Conversation 15",
  },
  {
    id: 16,
    title: "Conversation 16",
  },
  {
    id: 17,
    title: "Conversation 17",
  },
  {
    id: 18,
    title: "Conversation 18",
  },
  {
    id: 19,
    title: "Conversation 19",
  },
  {
    id: 20,
    title: "Conversation 20",
  },
  {
    id: 21,
    title: "Conversation 21",
  },
  {
    id: 22,
    title: "Conversation 22",
  },
  {
    id: 23,
    title: "Conversation 23",
  },
  {
    id: 24,
    title: "Conversation 24",
  },
  {
    id: 25,
    title: "Conversation 25",
  },
  {
    id: 26,
    title: "Conversation 26",
  },
  {
    id: 27,
    title: "Conversation 27",
  },
  {
    id: 28,
    title: "Conversation 28",
  },
  {
    id: 29,
    title: "Conversation 29",
  },
  {
    id: 30,
    title: "Conversation 30",
  },
  {
    id: 31,
    title: "Conversation 31",
  },
  {
    id: 32,
    title: "Conversation 32",
  },
  {
    id: 33,
    title: "Conversation 33",
  },
  {
    id: 34,
    title: "Conversation 34",
  },
  {
    id: 35,
    title: "Conversation 35",
  },
];

const SideMenu = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.containerView}>
        {/* Top of the side menu: New Conversation */}
        <Button
          color={"#000"}
          title="New Conversation"
          onPress={() => {
            // TODO: create new conversation

            /* Navigate to new conversation screen */
            navigation.navigate("Chat");
          }}
        />

        {/* List of chat conversations, expanded and scrollable */}
        <ScrollView style={styles.conversationList}>
          {/* list the conversations */}
          {conversations.map((conversation) => (
            <Text
              key={conversation.id}
              style={styles.conversationTitle}
              onPress={() => {
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
    alignItems: "start",
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
    paddingLeft: 15,
  },
  gptModelInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
  },
  systemMessageInputView: {
    flexDirection: "row",
    alignItems: "start",
    justifyContent: "start",
  },
  systemMessageInput: {
    paddingLeft: 15,
  },
  versionText: {
    alignSelf: "center",
    fontSize: 11,
  },
});

export default SideMenu;
