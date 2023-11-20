// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./state/store";
import { Text } from "react-native";
import Toast from "react-native-toast-message";

import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";

export default function App() {
  const ref = React.useRef(null);

  useEffect(() => {
    const handleRedirect = async () => {
      // Your logic to check for the redirected URL.
      // This might involve checking caches

      // Check if there is a shared content indicator
      // For example, check a flag you've stored:

      const cache = await caches.open("shared-audios");

      const serializedFileNames = await cache.match("fileNames");

      const fileNames = await serializedFileNames.json();

      if (fileNames) {
        console.log("fileNames", fileNames);

        alert("Shared content available: " + fileNames);

        // Navigate to the new screen if shared content available
        ref.current?.navigate("SharedContent");
      }
    };

    handleRedirect();
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <Toast />
    </>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
