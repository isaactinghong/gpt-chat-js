import { ChatCompletionContentPartImage } from 'openai/resources';
import { Conversation } from '../types/conversation';

export interface ChatState {
  conversations: { [key: string]: Conversation };
  currentConversationId: string | null;

  // temporary state for attachment upload
  images: ChatCompletionContentPartImage[];
}