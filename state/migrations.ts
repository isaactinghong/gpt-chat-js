import { MigrationManifest, PersistState, PersistedState } from 'redux-persist';
import { initialChatState } from "./reducers/chatReducer";
import { AppState } from './states/app-state';

const keepSettingsResetOthers = (state) => {
  // migration to keep only the necessary state
  return {
    ...state,
    chats: initialChatState,
  };
};

const removeConversationsWithoutId = (state: AppState): AppState => {
  // migration to remove conversations without id
  const newConversations = Object.values(state.chats.conversations).filter(
    (conversation) => conversation.id
  );
  const conversationsObject = newConversations.reduce((acc, conversation) => {
    acc[conversation.id] = conversation;
    return acc;
  }, {});
  return {
    ...state,
    chats: {
      ...state.chats,
      conversations: conversationsObject,
    },
  };
}

export const migrations: MigrationManifest = {
  // The keys here correspond to the version numbers
  0: (state) => {
    // migration clear out device state
    return {
      ...state,
    };
  },
  1: keepSettingsResetOthers,
  2: keepSettingsResetOthers,
  3: keepSettingsResetOthers,
  4: keepSettingsResetOthers,
  5: (state: { _persist: PersistState; }) => removeConversationsWithoutId(state as unknown as AppState) as unknown as PersistedState,
  // you can keep adding migrations here for further versions
};