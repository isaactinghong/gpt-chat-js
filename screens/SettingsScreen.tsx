import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Linking,
  Switch,
} from "react-native";
import { useDispatch } from "react-redux";
import { saveSettings } from "../state/actions/settingsActions";
import { useSelector } from "react-redux";
import { AppState } from "../state/states/app-state";
import Toast from "react-native-toast-message";
import GlobalStyles from "../theme/GlobalStyles";

const SettingsScreen = () => {
  const dispatch = useDispatch();

  // openAiApiKey
  const openAiApiKey = useSelector(
    (state: AppState) => state.settings.openAiApiKey
  );
  const [openAiApiKeyLocal, setOpenAiApiKey] = React.useState(openAiApiKey);

  // newsApiKey
  const newsApiKey = useSelector(
    (state: AppState) => state.settings.newsApiKey
  );
  const [newsApiKeyLocal, setNewsApiKey] = React.useState(newsApiKey);

  // showMarkdown
  const showMarkdown = useSelector(
    (state: AppState) => state.settings.showMarkdown
  );
  const [showMarkdownLocal, setShowMarkdownLocal] = React.useState(showMarkdown);

  return (
    <View style={styles.container}>
      {/* OpenAI API Key */}
      <Text style={styles.title}>OpenAI API Key</Text>
      <TextInput
        style={styles.input}
        placeholder="Your API Key here"
        value={openAiApiKeyLocal}
        onChangeText={setOpenAiApiKey}
      />

      {/* News API Key */}
      <Text style={styles.title}
      >News API Key (<Text
        style={{ color: 'blue' }}
      ><Pressable
        // inline
        onPress={() => {
          // navigate the newsapi.org website
          Linking.openURL("https://newsapi.org/");
        }}
      >click here to get API key</Pressable></Text>)</Text>
      <TextInput
        style={styles.input}
        placeholder="Your API Key here"
        value={newsApiKeyLocal}
        onChangeText={setNewsApiKey}
      />

      {/* margin */}
      <View style={{ height: 20 }}></View>

      {/* Show Markdown toggle */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Text style={{ marginRight: 10, fontSize: 20 }}>Show Markdown</Text>
        <Switch
          // big
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          value={showMarkdownLocal}
          onValueChange={setShowMarkdownLocal}
        />
      </View>

      {/* margin */}
      <View style={{ flexGrow: 1 }}></View>

      {/* Save Button */}
      <Pressable
        style={GlobalStyles.primaryButton}
        onPress={() => {
          /* handle save, using action: saveSettings */
          dispatch(
            saveSettings({
              openAiApiKey: openAiApiKeyLocal,
              newsApiKey: newsApiKeyLocal,
              showMarkdown: showMarkdownLocal,
            })
          );

          // show success toast message
          Toast.show({
            type: "success",
            text1: "Settings saved",
          });
        }}
      >
        <Text style={GlobalStyles.primaryButtonText}>Save</Text>
      </Pressable>
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
