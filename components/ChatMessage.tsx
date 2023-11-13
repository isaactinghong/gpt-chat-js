import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Message } from "../state/types/message";
import OpenAIBlackLogo from "./OpenAIBlackLogo";
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
} from "openai/resources";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

const ChatMessage = ({
  message,
  openImageViewer,
}: {
  message: Message & ChatCompletionMessageParam;
  openImageViewer: (images: IImageInfo[], selectedIndex: number) => void;
}) => {
  return (
    <View
      style={
        message.role == "assistant"
          ? styles.assistantMessageRow
          : styles.userMessageRow
      }
    >
      {message.role == "assistant" && (
        <View>
          <OpenAIBlackLogo style={styles.openAIBlackLogo} />
          {/* stack loading spinner on top of logo */}
          {message.isLoading && (
            <ActivityIndicator
              size="small"
              color="#000"
              style={styles.loadingSpinner}
            />
          )}
        </View>
      )}

      <View
        style={
          message.role == "assistant"
            ? styles.assistantMessageContainer
            : styles.userMessageContainer
        }
      >
        <Text
          selectable={true}
          style={
            message.role == "assistant"
              ? styles.assistantMessageText
              : styles.userMessageText
          }
        >
          {/* if content is array, display the first element */}
          {Array.isArray(message.content)
            ? (message.content[0] as ChatCompletionContentPartText).text
            : message.content}
        </Text>
        {Array.isArray(message.content) && (
          <View style={styles.imageContainer}>
            {message.content
              .filter((contentPart) => contentPart.type === "image_url")
              .map((contentPart, index) => {
                const imageUrl = (contentPart as ChatCompletionContentPartImage)
                  .image_url.url;
                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      openImageViewer(
                        (message.content as ChatCompletionContentPart[])
                          .filter(
                            (contentPart) => contentPart.type === "image_url"
                          )
                          .map((contentPart) => ({
                            url: (contentPart as ChatCompletionContentPartImage)
                              .image_url.url,
                            props: {},
                          })),
                        index
                      )
                    }
                  >
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.imageThumbnail}
                    />
                  </Pressable>
                );
              })}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assistantMessageRow: {
    flexDirection: "row",
    // alignItems: "flex-start",
    alignSelf: "flex-start",
    maxWidth: "90%", // 90% of parent
  },
  userMessageRow: {
    flexDirection: "row",
    // alignItems: "flex-start",
    alignSelf: "flex-end",
    maxWidth: "90%", // 90% of parent
  },
  openAIBlackLogo: {
    minWidth: 30,
    width: 30,
    height: 30,
    marginRight: 0,
    marginTop: 21,
    marginLeft: 10,
  },
  loadingSpinner: {
    position: "absolute",
    top: 26,
    left: 15,
  },
  assistantMessageContainer: {
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginLeft: 10,
    borderColor: "#000",
    borderWidth: 0.5,
    borderRadius: 17,
    flexShrink: 1,
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
    flexShrink: 1,
    alignSelf: "flex-end",
    flexDirection: "column",
  },
  assistantMessageText: {
    justifyContent: "center",
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    alignContent: "center",
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
});

export default ChatMessage;
