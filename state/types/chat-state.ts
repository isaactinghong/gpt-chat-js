import { Conversation } from './conversation';

export interface ChatState {
  conversations: { [key: string]: Conversation };
  currentConversationId: string | null;

}