import { ChatState } from './chat-state';

export interface AppState {
  chats: ChatState;
  // ... other state slices
}