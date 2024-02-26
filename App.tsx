// App.js
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./state/store";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBrush } from "@fortawesome/free-solid-svg-icons";

library.add(faBrush);

export default function App() {
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
