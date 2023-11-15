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
import { createConversation } from "../state/actions/chatActions";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if 'C' is pressed along with the 'Control' key
      if (event.key === "c" && event.ctrlKey) {
        // Prevent the default action to avoid opening a new browser window
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        // Here goes your action when 'Control + N' is pressed
        console.log("Control + C is pressed");

        // create new conversation
        dispatch(createConversation());
      }
    };

    // Add event listener to capture keydown events on the document
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
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
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "gray",
  },
});

export default DrawerNavigator;
