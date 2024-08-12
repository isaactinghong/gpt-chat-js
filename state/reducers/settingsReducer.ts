// settingsReducer.ts
import { SettingsActionTypes, SAVE_SETTINGS } from "../actions/settingsActions";
import { SettingsState } from "../states/settings-state";

// initialState
const initialState: SettingsState = {
  openAiApiKey: "",
  // modelName: 'gpt-4-1106-preview',
  modelName: "gpt-4o-mini",
  systemMessage: "Chat with me.",
  myProfile: defaultMyProfile,
};

// reducer
const settingsReducer = (
  state = initialState,
  action: SettingsActionTypes
): SettingsState => {
  switch (action.type) {
    case SAVE_SETTINGS: {
      const { settings } = action.payload;
      return {
        ...state,
        ...settings,
      };
    }
    default:
      return state;
  }
};

export const defaultMyProfile = `## User Profile

### Personal Information
- **Name:** ???
- **Age:** ???
- **Sex:** ???
- **Weight:** ???
- **Height:** ???
- **Living Place:** ???
- **Marital Status:** ???

### Occupation
- **Title:** ???

### Hobbies
- **???**
`;

export default settingsReducer;
