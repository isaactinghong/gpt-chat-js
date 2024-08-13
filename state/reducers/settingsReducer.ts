// settingsReducer.ts
import { SettingsActionTypes, SAVE_SETTINGS } from "../actions/settingsActions";
import { SettingsState } from "../states/settings-state";

export const defaultMyProfile = {
  personal_information: {
    name: null,
    birthday: null,
    living_place: null,
    marital_status: {
      status: null,
      fiancee_name: null,
    },
  },
  education: {
    university: {
      name: null,
      degree: null,
    },
  },
  professional_information: {
    occupation: {
      title: null,
      company: null,
    },
  },
  financial_overview: {
    monthly_income: null,
    monthly_expenses: null,
    monthly_savings_potential: null,
  },
};

// initialState
const initialState: SettingsState = {
  openAiApiKey: "",
  newsApiKey: "",
  modelName: "gpt-4o-mini",
  systemMessage: "Chat with me.",
  myProfile: "",
  myProfileJson: defaultMyProfile,
  showMarkdown: true,
};

// reducer
const settingsReducer = (
  state = initialState,
  action: SettingsActionTypes,
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

export default settingsReducer;
