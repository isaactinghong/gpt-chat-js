// src/components/SideMenu.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { version } from "../package.json";
import { useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";
import { Conversation } from "../state/types/conversation";
import {
  createConversation,
  deleteConversation,
  selectConversation,
} from "../state/actions/chatActions";
import { useDispatch } from "react-redux";
import { saveSettings } from "../state/actions/settingsActions";
import Toast from "react-native-toast-message";
import GlobalStyles from "../theme/GlobalStyles";

const SideMenu = ({ navigation }: {
  navigation: any;
}) => {
  // load conversations from store
  const conversationList: Conversation[] = useSelector((state: AppState) =>
    state.chats.conversations
      ? Object.values(state.chats.conversations).reverse()
      : []
  );
  const dispatch = useDispatch();

  const modelName = useSelector((state: AppState) => state.settings.modelName);
  const systemMessage = useSelector(
    (state: AppState) => state.settings.systemMessage
  );

  const [modelNameLocal, setModelNameLocal] = React.useState(modelName);
  const [systemMessageLocal, setSystemMessageLocal] =
    React.useState(systemMessage);

  // const myProfileJson = useSelector((state: AppState) => state.settings.myProfileJson);
  // const [myProfileLocal, setMyProfileLocal] = React.useState("");
  // const [myProfileText, setMyProfileText] = React.useState("");

  // modal visibility
  const [modalVisible, setModalVisible] = React.useState(false);
  // parse error
  const [parseError, setParseError] = React.useState("");

  // const handleMyProfileTextChange = (value: string) => {

  //   // setMyProfileLocal
  //   setMyProfileLocal(value);

  //   // try to parse the value
  //   try {
  //     const myProfileJson = JSON.parse(value);
  //     setParseError("");
  //   } catch (error) {
  //     setParseError("Invalid JSON");
  //   }
  // }

  const handleSave = (fieldName: string, newInput: any) => {
    // log
    console.log("handleSave", fieldName, newInput?.target.value);

    const updateSettings = {
      [fieldName]: newInput.target.value,
    };

    // log updateSettings
    console.log("updateSettings", updateSettings);

    /* handle save, using action: saveSettings */
    dispatch(saveSettings(updateSettings));

    // close the modal
    setModalVisible(false);

    // show success toast message
    Toast.show({
      type: "success",
      text1: `${fieldName} saved`,
    });
  };

  // effect, if modelName becomes "", set it back to "gpt-4o-mini"
  React.useEffect(() => {
    if (modelNameLocal === "") {
      setModelNameLocal("gpt-4o-mini");
    }
  }, [modelNameLocal]); // adding handleSave to dependencies as a best practice

  // // onMount, load myProfile from store
  // React.useEffect(() => {

  //   // JSON stringify myProfile
  //   const myProfileString = JSON.stringify(myProfileJson, null, 2);

  //   // set myProfileLocal
  //   setMyProfileLocal(myProfileString);
  // }, [myProfileJson]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.containerView}>
        {/* Top of the side menu: New Conversation */}
        <Pressable
          style={GlobalStyles.primaryButton}
          onPress={() => {
            // dispatch action to add new conversation
            dispatch(createConversation());

            /* Navigate to new conversation screen */
            navigation.navigate("Chat");
          }}
        >
          <Text style={GlobalStyles.primaryButtonText}>New Conversation</Text>
        </Pressable>

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
            value={modelNameLocal}
            onChangeText={(value) => setModelNameLocal(value)}
            onChange={(value) => handleSave("modelName", value)}
            onSubmitEditing={(value) => handleSave("modelName", value)}
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
            value={systemMessageLocal}
            onChangeText={setSystemMessageLocal}
            onChange={(value) => handleSave("systemMessage", value)}
          />
        </View>
        {/* my profile button, click to open modal */}
        {/* <Pressable
          style={GlobalStyles.primaryClearButton}
          onPress={() => {
            // set modal visibility to true
            setModalVisible(true);
          }}
        >
          <Text style={GlobalStyles.primaryClearButtonText}>My Profile</Text>
        </Pressable> */}
        <Pressable
          // color={"#000"}
          style={GlobalStyles.primaryButton}
          onPress={() => {
            /* Navigate to settings screen */
            navigation.navigate("Settings");
          }}
        >
          <Text style={GlobalStyles.primaryButtonText}>Settings</Text>
        </Pressable>
        <Text style={styles.versionText}>Version {version}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newConversationButton: {
    marginBottom: 10,
  },
  modalView: {
    flex: 1,
    gap: 10,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
    padding: 35,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
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
