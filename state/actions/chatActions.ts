// actions/chatActions.js

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Message } from "../types/message";
import { LocalImage } from "../types/local-image";
import { deleteConversationImages } from "../../idb/images-db";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";
export const CREATE_CONVERSATION = "CREATE_CONVERSATION";
export const SELECT_CONVERSATION = "SELECT_CONVERSATION";
export const DELETE_CONVERSATION = "DELETE_CONVERSATION";
export const UPDATE_CONVERSATION = "UPDATE_CONVERSATION";
export const ADD_IMAGE = "ADD_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";
export const CLEAR_IMAGES = "CLEAR_IMAGES";
export const REORDER_IMAGE = "REORDER_IMAGE";
export const ADD_AUDIO_FILES = "ADD_AUDIO_FILES";
export const REMOVE_AUDIO_FILES = "REMOVE_AUDIO_FILES";
export const POST_PROCESSING_START = "POST_PROCESSING_START";
export const POST_PROCESSING_END = "POST_PROCESSING_END";

interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: {
    conversationId: string;
    message: Message & ChatCompletionMessageParam;
  };
}

interface UpdateMessageAction {
  type: typeof UPDATE_MESSAGE;
  payload: {
    conversationId: string;
    message: Message & ChatCompletionMessageParam;
    messageIndex: number;
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

interface UpdateConversationAction {
  type: typeof UPDATE_CONVERSATION;
  payload: {
    conversationId: string;
    title: string;
  };
}

interface AddImageAction {
  type: typeof ADD_IMAGE;
  payload: {
    localImage: LocalImage;
  };
}

interface RemoveImageAction {
  type: typeof REMOVE_IMAGE;
  payload: {
    imageIndex: number;
  };
}

interface ClearImagesAction {
  type: typeof CLEAR_IMAGES;
}

interface ReorderImageAction {
  type: typeof REORDER_IMAGE;
  payload: {
    imageIndex: number;
    newIndex: number;
  };
}

interface AddAudioFilesAction {
  type: typeof ADD_AUDIO_FILES;
  payload: {
    audioFileNames: string[];
  };
}

interface RemoveAudioFilesAction {
  type: typeof REMOVE_AUDIO_FILES;
}

interface PostProcessingStartAction {
  type: typeof POST_PROCESSING_START;
}

interface PostProcessingEndAction {
  type: typeof POST_PROCESSING_END;
}

// Union type for chat-related actions
export type ChatActionTypes =
  | AddMessageAction
  | UpdateMessageAction
  | CreateConversationAction
  | SelectConversationAction
  | DeleteConversationAction
  | UpdateConversationAction
  | AddImageAction
  | RemoveImageAction
  | ClearImagesAction
  | ReorderImageAction
  | AddAudioFilesAction
  | RemoveAudioFilesAction
  | PostProcessingStartAction
  | PostProcessingEndAction;

export const addMessage = (
  conversationId: string,
  message: Message & ChatCompletionMessageParam,
): ChatActionTypes => ({
  type: ADD_MESSAGE,
  payload: { conversationId, message },
});

export const updateMessage = (
  conversationId: string,
  message: Message & ChatCompletionMessageParam,
  messageIndex: number,
): ChatActionTypes => ({
  type: UPDATE_MESSAGE,
  payload: {
    conversationId,
    message,
    messageIndex,
  },
});

export const createConversation = (): ChatActionTypes => {
  return {
    type: CREATE_CONVERSATION,
  };
};

export const selectConversation = (
  conversationId: string,
): ChatActionTypes => ({
  type: SELECT_CONVERSATION,
  payload: { conversationId },
});

const deleteConversationInner = (conversationId: string): ChatActionTypes => ({
  type: DELETE_CONVERSATION,
  payload: { conversationId },
});

export const deleteConversation = (conversationId: string): ChatActionTypes => {
  // delete images from IndexedDB
  deleteConversationImages(conversationId);

  // dispatch the action
  return deleteConversationInner(conversationId);
};

export const updateConversation = (
  conversationId: string,
  title: string,
): ChatActionTypes => ({
  type: UPDATE_CONVERSATION,
  payload: { conversationId, title },
});

export const addImage = (localImage: LocalImage): ChatActionTypes => ({
  type: ADD_IMAGE,
  payload: { localImage },
});

export const removeImage = (imageIndex: number): ChatActionTypes => ({
  type: REMOVE_IMAGE,
  payload: { imageIndex },
});

export const clearImages = (): ChatActionTypes => ({
  type: CLEAR_IMAGES,
});

export const reorderImage = (
  imageIndex: number,
  newIndex: number,
): ChatActionTypes => ({
  type: REORDER_IMAGE,
  payload: { imageIndex, newIndex },
});

export const addAudioFiles = (audioFileNames: string[]): ChatActionTypes => ({
  type: ADD_AUDIO_FILES,
  payload: { audioFileNames },
});

export const removeAudioFiles = (): ChatActionTypes => ({
  type: REMOVE_AUDIO_FILES,
});

export const postProcessingStart = (): ChatActionTypes => ({
  type: POST_PROCESSING_START,
});

export const postProcessingEnd = (): ChatActionTypes => ({
  type: POST_PROCESSING_END,
});
