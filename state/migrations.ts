import { initialChatState } from "./reducers/chatReducer";

const keepSettingsResetOthers = (state) => {
  // migration to keep only the necessary state
  return {
    ...state,
    chats: initialChatState,
  };
};

export const migrations = {
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
  // you can keep adding migrations here for further versions
};
