import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ToastAndroid,
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
import { getImage } from "../idb/images-db";
import { LocalImage } from "../state/types/local-image";
import Toast from "react-native-toast-message";
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';
import { AppState } from '../state/states/app-state';

import mermaid from "mermaid";
import { getCodeString } from 'rehype-rewrite';
// No import is required in the WebPack.
import "@uiw/react-markdown-preview/markdown.css";
import MarkdownPreview from '@uiw/react-markdown-preview';


const ChatMessage = ({
  message,
  openImageViewer,
}: {
  message: Message & ChatCompletionMessageParam;
  openImageViewer: (images: IImageInfo[], selectedIndex: number) => void;
}) => {
  const [localImages, setLocalImages] = React.useState<LocalImage[]>([]);

  // showMarkdown from settings
  const showMarkdown = useSelector(
    (state: AppState) => state.settings.showMarkdown
  );

  React.useEffect(() => {
    try {
      // clear local images
      setLocalImages([]);

      // get all local images from IndexedDB
      for (const localImage of message?.images || []) {
        const id = localImage.id;

        // log getImage(id)
        console.log("getImage(id)", id);

        // get image from IndexedDB
        getImage(id).then((image) => {
          //log image
          console.log("getImage(id).then", image);
          if (image) {
            setLocalImages((localImages) => [
              ...localImages,
              {
                id: image.id,
                base64: image.uri,
              } as LocalImage,
            ]);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [message.timestamp, message.images]);

  const handleLongPress = (content: string | ChatCompletionContentPart[]) => {
    try {

      const textContent: string = Array.isArray(content)
        ? (content[0] as ChatCompletionContentPartText).text
        : (content as unknown as string);
      Clipboard.setString(textContent);
      // clear Toast first
      Toast.hide();
      Toast.show({
        type: 'success',
        text1: `"${textContent.slice(0, 15)}..." copied to clipboard`,
      });
    }
    catch (e) {
      console.error(e);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to copy to clipboard',
      });
    }
  };

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

      <Pressable
        onLongPress={() =>
          handleLongPress(
            message.content!
            // Array.isArray(message.content)
            //   ? (message.content[0] as ChatCompletionContentPartText).text
            //   : (message.content as string)
          )
        }
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
          <View style={{ flexDirection: "column", width: "100%", display: "flex", }}>
            {/* if content is array, display the first element */}
            {message.type === "image"
              ? localImages.length > 0
                ? localImages?.map((image, index) => (
                  <View key={index} style={{ flexDirection: "column" }}>
                    <Pressable
                      onPress={() =>
                        openImageViewer(
                          localImages.map((image) => ({
                            url: image?.base64,
                            props: {},
                          } as IImageInfo)),
                          index
                        )
                      }
                    >
                      <Image
                        key={index}
                        source={{ uri: image.base64 }}
                        style={{ width: 200, height: 200 }}
                      />
                    </Pressable>
                    <Text>{message.content as string}</Text>
                  </View>
                ))
                : "Generating image..."
              : null}
            {/* if showMarkdown */}
            {showMarkdown && (
              // <Markdown>
              //   {Array.isArray(message.content)
              //     ? (message.content[0] as ChatCompletionContentPartText).text
              //     : message.content}
              // </Markdown>)

              <MarkdownPreview
                source={Array.isArray(message.content)
                  ? (message.content[0] as ChatCompletionContentPartText).text
                  : message.content ?? undefined}
                components={{
                  code: Code
                }}
                className='markdown-body'
              />
            )}
            {/* else show pure text */}
            {!showMarkdown && (
              <Text>
                {Array.isArray(message.content)
                  ? (message.content[0] as ChatCompletionContentPartText).text
                  : message.content}
              </Text>
            )}

          </View>
        </Text>
      </Pressable>

      {message.type !== "image" && localImages?.length > 0 && (
        <View style={styles.imageContainer}>
          {localImages.map((localImage, index) => {
            return (
              <Pressable
                key={index}
                onPress={() =>
                  openImageViewer(
                    localImages.map((localImage) => ({
                      url: localImage?.base64,
                      props: {},
                    } as IImageInfo)),
                    index
                  )
                }
              >
                <Image
                  key={index}
                  source={{ uri: localImage?.base64 }}
                  style={styles.imageThumbnail}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({ inline, children = [], className, ...props }: {
  inline?: boolean;
  children?: any;
  className?: string;
  node?: any;
}) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null as HTMLElement | null);
  const isMermaid =
    className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = children
    ? getCodeString(props.node.children)
    : children[0] || "";

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          container.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(container);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback((node: HTMLPreElement | null) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: "none" }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code className={className}>{children}</code>;
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
    paddingVertical: 20,
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
    paddingVertical: 20,
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
    flex: 1,
    width: "100%",

  },
  userMessageText: {
    alignContent: "center",
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    width: "100%",
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