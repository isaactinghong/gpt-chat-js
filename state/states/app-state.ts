import { ChatState } from './chat-state';
import { SettingsState } from './settings-state';

export interface AppState {
  settings: SettingsState;
  chats: ChatState;
  // ... other state slices
}