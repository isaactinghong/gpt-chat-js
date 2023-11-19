// SharedContentScreen.js
import React, { useEffect } from "react";
import { View, Text } from "react-native";

const SharedContentScreen = () => {
  const [sharedContent, setSharedContent] = React.useState(null);
  const [sharedAudios, setSharedAudios] = React.useState(null);

  useEffect(() => {
    // You'd add your shared content handling logic here.
    // Perhaps retrieve files from IndexedDB, show a message, etc.

    /*
      data was stored in the service worker this way:
      // set basic data into window.sessionStorage
      const data = {
        title: formData.get("title"),
        text: formData.get("text"),
      };
      window.sessionStorage.setItem("sharedContent", JSON.stringify(data));
      */

    // now get the data from the service worker
    const sharedContent = window.sessionStorage.getItem("sharedContent");
    const sharedAudios = window.sessionStorage.getItem("sharedAudios");

    // set the shared content
    setSharedContent(sharedContent);
    setSharedAudios(sharedAudios);
  }, []);

  return (
    <View>
      <Text>Handle the shared content here:</Text>
      <Text>{sharedContent}</Text>
      <Text>{sharedAudios}</Text>
    </View>
  );
};

export default SharedContentScreen;
