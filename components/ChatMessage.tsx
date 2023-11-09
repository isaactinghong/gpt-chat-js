import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Message } from "../state/types/message";

const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <View
      style={
        message.role == "assistant"
          ? styles.assistantMessageContainer
          : styles.userMessageContainer
      }
    >
      <Text
        style={
          message.role == "assistant"
            ? styles.assistantMessageText
            : styles.userMessageText
        }
      >
        {message.content}
      </Text>
      <View style={styles.imageContainer}>
        {message.imageUrls?.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.imageThumbnail}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assistantMessageContainer: {
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginHorizontal: 15,
    borderColor: "#000",
    borderWidth: 0.5,
    borderRadius: 17,
    flexShrink: 1,
    maxWidth: "90%", // 90% of parent
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  userMessageContainer: {
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginHorizontal: 15,
    borderColor: "#000",
    borderWidth: 0.5,
    borderRadius: 17,
    maxWidth: "90%", // 90% of parent
    flexShrink: 1,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  assistantMessageText: {
    justifyContent: "center",
    fontSize: 16,
    lineHeight: 16,
  },
  userMessageText: {
    alignContent: "center",
    fontSize: 16,
    lineHeight: 16,
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
});

export default ChatMessage;
