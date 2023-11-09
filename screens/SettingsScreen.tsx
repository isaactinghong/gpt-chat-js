import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { saveSettings } from "../state/actions/settingsActions";
import { useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";
import Toast from "react-native-toast-message";

const SettingsScreen = () => {
  const dispatch = useDispatch();

  const openAiApiKey = useSelector(
    (state: AppState) => state.settings.openAiApiKey
  );

  const [openAiApiKeyLocal, setOpenAiApiKey] = React.useState(openAiApiKey);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Key</Text>
      <TextInput
        style={styles.input}
        placeholder="Your API Key here"
        value={openAiApiKeyLocal}
        onChangeText={setOpenAiApiKey}
      />
      <Button
        title="Save"
        color={"#000"}
        onPress={() => {
          /* handle save, using action: saveSettings */
          dispatch(
            saveSettings({
              openAiApiKey: openAiApiKeyLocal,
            })
          );

          // show success toast message
          Toast.show({
            type: "success",
            text1: "Settings saved",
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
});

export default SettingsScreen;
