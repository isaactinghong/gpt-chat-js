// actions/chatActions.js

import { Conversation } from '../types/conversation';
import { Message } from '../types/message';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CREATE_CONVERSATION = 'CREATE_CONVERSATION';
export const SELECT_CONVERSATION = 'SELECT_CONVERSATION';
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';

interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: {
    conversationId: string;
    message: Message;
  };
}

interface CreateConversationAction {
  type: typeof CREATE_CONVERSATION;
}

interface SelectConversationAction {
  type: typeof SELECT_CONVERSATION;
  payload: {
    conversationId: string;
  };
}

interface DeleteConversationAction {
  type: typeof DELETE_CONVERSATION;
  payload: {
    conversationId: string;
  };
}

// Union type for chat-related actions
export type ChatActionTypes =
  AddMessageAction |
  CreateConversationAction |
  SelectConversationAction |
  DeleteConversationAction
  ;

export const addMessage = (conversationId: string, message: Message): ChatActionTypes => ({
  type: ADD_MESSAGE,
  payload: { conversationId, message },
});

export const createConversation = (): ChatActionTypes => {
  return {
    type: CREATE_CONVERSATION,
  };
};

export const selectConversation = (conversationId: string): ChatActionTypes => ({
  type: SELECT_CONVERSATION,
  payload: { conversationId },
});

export const deleteConversation = (conversationId: string): ChatActionTypes => ({
  type: DELETE_CONVERSATION,
  payload: { conversationId },
});