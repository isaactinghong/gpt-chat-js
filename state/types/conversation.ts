import { ChatCompletionMessageParam } from "openai/resources";
import { Message } from "./message";

export interface Conversation {
  id: string;
  title: string;
  messages: (Message & ChatCompletionMessageParam)[];
  // you can add more properties like participants, lastMessage, etc.
}
