import { SettingsState } from '../states/settings-state';

// actions
export const SAVE_SETTINGS = 'SAVE_SETTINGS';

interface SaveSettingsAction {
  type: typeof SAVE_SETTINGS;
  payload: {
    settings: Partial<SettingsState>;
  };
}

export type SettingsActionTypes = SaveSettingsAction;

// action creators
export const saveSettings = (settings: Partial<SettingsState>): SettingsActionTypes => ({
  type: SAVE_SETTINGS,
  payload: { settings },
});
