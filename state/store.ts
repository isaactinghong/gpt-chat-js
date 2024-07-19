// store.js
import { combineReducers } from "redux";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import chatReducer from "./reducers/chatReducer";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settingsReducer";
import { migrations } from "./migrations";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["settings", "chats"], // You can choose which reducers to persist
  version: 8,
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  chats: chatReducer,
  // ... other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
