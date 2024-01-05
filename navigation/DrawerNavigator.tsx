// navigation/DrawerNavigator.js
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatHeaderRight from "../components/ChatHeaderRight";
import SideMenu from "../components/SideMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";
import { Conversation } from "../state/types/conversation";
import OpenAI from "../services/OpenAIService";
import { View, Text, StyleSheet } from "react-native";
import {
  addAudioFiles,
  addImage,
} from "../state/actions/chatActions";
import SharedContentScreen from "../screens/SharedContentScreen";
import { storeImage } from '../idb/images-db';
import { compressImage } from '../helpers/image-utils';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "c" && event.ctrlKey && event.shiftKey) {
  //       // Prevent the default action to avoid opening a new browser window
  //       event.preventDefault();
  //       event.stopPropagation();
  //       event.nativeEvent.stopImmediatePropagation();

  //       console.log("Ctrl+Shift+C is pressed");

  //       // create new conversation
  //       dispatch(createConversation());
  //     }
  //   };

  //   // Add event listener to capture keydown events on the document
  //   document.addEventListener("keydown", handleKeyDown);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleRedirectAudios = async () => {
      try {
        // Your logic to check for the redirected URL.
        // This might involve checking caches

        // Check if there is a shared content indicator
        // For example, check a flag you've stored:

        const cache = await caches.open("shared-audios");

        const serializedFileNames: Response = await cache.match("fileNames");

        if (!serializedFileNames) {
          // No shared content available
          return;
        }

        // delete cache fileNames
        await cache.delete("fileNames");

        const fileNames = await serializedFileNames.json();

        if (fileNames) {
          console.log("fileNames", fileNames);

          // alert("Shared content available: " + fileNames);

          // dispatch addAudioFiles
          dispatch(addAudioFiles(fileNames));
        }
        // log exit
        console.log("handleRedirectAudios exit");
      } catch (e) {
        console.log(e);

        alert("handleRedirectAudios Error: " + e);
      }
    };

    const handleRedirectImages = async () => {
      try {
        // Your logic to check for the redirected URL.
        // This might involve checking caches

        // Check if there is a shared content indicator
        // For example, check a flag you've stored:

        const cache = await caches.open("shared-images");

        const serializedFileNames: Response = await cache.match("fileNames");

        if (!serializedFileNames) {
          // No shared content available
          return;
        }

        // delete cache fileNames
        await cache.delete("fileNames");

        const fileNames = await serializedFileNames.json();

        if (fileNames) {
          console.log("fileNames", fileNames);


          // for each result.assets
          // add to messages
          fileNames.forEach(async (fileName) => {
            // compress the image
            const compressedImage = await compressImage(fileName);

            // get the current conversation id
            const currentConversationId = useSelector(
              (state: AppState) => state.chats.currentConversationId
            );

            // use IndexedDB to store the compressed image
            const id = await storeImage(compressedImage, currentConversationId);

            const localImage = {
              id,
              base64: compressedImage,
            };

            // just add the original image
            dispatch(addImage(localImage));
          });
        }
        // log exit
        console.log("handleRedirectImages exit");
      } catch (e) {
        console.log(e);

        alert("handleRedirectImages Error: " + e);
      }
    };

    handleRedirectAudios();
    handleRedirectImages();
  }, []);

  const openAiApiKey = useSelector(
    (state: AppState) => state.settings.openAiApiKey
  );

  // whenever openAiApiKey changes, update the OpenAIService
  React.useEffect(() => {
    OpenAI.setApiKey(openAiApiKey);
  }, [openAiApiKey]);

  const currentConversation: Conversation = useSelector(
    (state: AppState) =>
      state.chats.conversations[state.chats.currentConversationId]
  );

  return (
    <Drawer.Navigator
      initialRouteName="Chat"
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={
        {
          // Other options
        }
      }
    >
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
          headerTitle: (props) => {
            return (
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>
                  {currentConversation?.title}
                </Text>
              </View>
            );
          },
          headerRight: () => <ChatHeaderRight />,
          headerTitleContainerStyle: {
            width: "100%",
            marginLeft: 0,
            paddingRight: 20,
          },
        }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      {/* Add other screens here */}
      <Drawer.Screen name="SharedContent" component={SharedContentScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "gray",
  },
});

export default DrawerNavigator;
