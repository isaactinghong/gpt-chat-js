import { Message } from './message';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  // you can add more properties like participants, lastMessage, etc.
}
