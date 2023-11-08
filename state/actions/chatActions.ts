// actions/chatActions.js

import { Conversation } from '../types/conversation';
import { Message } from '../types/message';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CREATE_CONVERSATION = 'CREATE_CONVERSATION';

interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: {
    conversationId: string;
    message: Message;
  };
}

interface CreateConversationAction {
  type: typeof CREATE_CONVERSATION;
  payload: Conversation;
}

// Union type for chat-related actions
export type ChatActionTypes = AddMessageAction | CreateConversationAction;

export const addMessage = (conversationId: string, message: Message): ChatActionTypes => ({
  type: ADD_MESSAGE,
  payload: { conversationId, message },
});

export const createConversation = (conversation: Conversation): ChatActionTypes => ({
  type: CREATE_CONVERSATION,
  payload: conversation,
});