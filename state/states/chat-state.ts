import { ChatCompletionContentPartImage } from "openai/resources";
import { Conversation } from "../types/conversation";
import { LocalImage } from "../types/local-image";

export interface ChatState {
  conversations: { [key: string]: Conversation };
  currentConversationId: string | null;

  // temporary state for attachment upload
  // images: ChatCompletionContentPartImage[];
  imagesToUpload: LocalImage[];

  audioFileNames: string[];
}
