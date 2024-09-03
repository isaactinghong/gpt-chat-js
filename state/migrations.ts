import { MigrationManifest, PersistState, PersistedState } from "redux-persist";
import { initialChatState } from "./reducers/chatReducer";
import { AppState } from "./states/app-state";
import { defaultMyProfile } from "./reducers/settingsReducer";

const keepSettingsResetOthers = (state: PersistedState) => {
  // migration to keep only the necessary state
  return {
    ...state,
    chats: initialChatState,
  } as PersistedState;
};

const removeConversationsWithoutId = (state: AppState): AppState => {
  // migration to remove conversations without id
  const newConversations = Object.values(state.chats.conversations).filter(
    (conversation) => conversation.id,
  );
  const conversationsObject = newConversations.reduce(
    (acc, conversation) => {
      acc[conversation.id] = conversation;
      return acc;
    },
    {} as Record<string, any>,
  );
  return {
    ...state,
    chats: {
      ...state.chats,
      conversations: conversationsObject,
    },
  };
};

export const migrations: MigrationManifest = {
  // The keys here correspond to the version numbers
  0: (state: PersistedState) => {
    // migration clear out device state
    return {
      ...state,
    } as PersistedState;
  },
  1: keepSettingsResetOthers,
  2: keepSettingsResetOthers,
  3: keepSettingsResetOthers,
  4: keepSettingsResetOthers,

  // 5 to remove conversations without id
  5: (state: PersistedState) =>
    removeConversationsWithoutId(
      state as unknown as AppState,
    ) as unknown as PersistedState,

  // 6 to change settingsState.modelName to 'gpt-4-turbo'
  6: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        modelName: "gpt-4-turbo",
      },
    } as unknown as PersistedState;
  },
  // 7 to change settingsState.modelName to 'gpt-4o'
  7: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        modelName: "gpt-4o",
      },
    } as unknown as PersistedState;
  },

  // 8 to change settingsState.modelName to 'gpt-4o-mini'
  8: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        modelName: "gpt-4o-mini",
      },
    } as unknown as PersistedState;
  },

  // 9 to change settingsState.myProfile to ... if it is empty
  9: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        ...(appState.settings.myProfile == "" && {
          myProfile: defaultMyProfile,
        }),
      },
    } as unknown as PersistedState;
  },

  // 10 to change settingsState.myProfile to ... if it is empty
  10: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        ...(appState.settings.myProfile == "" && {
          myProfile: defaultMyProfile,
        }),
      },
    } as unknown as PersistedState;
  },
  // 11 to default showMarkdown to true
  11: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        showMarkdown: true,
      },
    } as unknown as PersistedState;
  },
  // 12 to update system message if it is "Chat with me."
  12: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    return {
      ...appState,
      settings: {
        ...appState.settings,
        systemMessage:
          appState.settings.systemMessage == "Chat with me."
            ? `Talk to me like a human being.
Try to reply one or two sentence long each time, unless really necessary.
--------
Any mermaid diagram can be rendered in the app when needed.`
            : appState.settings.systemMessage,
      },
    } as unknown as PersistedState;
  },
  // 13 to remove old conversations if they are more than 100
  13: (state: PersistedState) => {
    const appState = state as unknown as AppState;
    const conversations = Object.values(appState.chats.conversations);
    if (conversations.length > 100) {
      const newConversations = conversations.slice(-100);
      const conversationsObject = newConversations.reduce(
        (acc, conversation) => {
          acc[conversation.id] = conversation;
          return acc;
        },
        {} as Record<string, any>,
      );
      return {
        ...appState,
        chats: {
          ...appState.chats,
          conversations: conversationsObject,
        },
      } as unknown as PersistedState;
    }
    return appState as unknown as PersistedState;
  }


  // ...
  // you can keep adding migrations here for further versions
};
