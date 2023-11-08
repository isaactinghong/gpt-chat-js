// navigation/DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatHeaderRight from "../components/ChatHeaderRight";
import SideMenu from "../components/SideMenu";
import { useSelector } from "react-redux";
import { AppState } from "../state/types/app-state";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const currentConversation = useSelector(
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
          headerTitle: currentConversation.title,
          headerRight: () => <ChatHeaderRight />,
          // Other options
        }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      {/* Add other screens here */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
