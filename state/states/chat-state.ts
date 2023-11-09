import { Conversation } from '../types/conversation';

export interface ChatState {
  conversations: { [key: string]: Conversation };
  currentConversationId: string | null;

}