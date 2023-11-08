import { ADD_MESSAGE, CREATE_CONVERSATION, ChatActionTypes, SELECT_CONVERSATION } from '../actions/chatActions';
import { ChatState } from '../types/chat-state';
import { Conversation } from '../types/conversation';

// reducers/chatReducer.js
const initialState = {
  conversations: {},
  currentConversationId: null,
};

const chatReducer = (state = initialState, action: ChatActionTypes): ChatState => {
  switch (action.type) {
    case ADD_MESSAGE: {
      const { conversationId, message } = action.payload;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            messages: [...(state.conversations[conversationId]?.messages ?? []), message],
          },
        },
      };
    }
    case CREATE_CONVERSATION: {

      const conversation: Conversation = {
        id: new Date().getTime().toString(),
        title: `New Conversation ${Object.keys(state.conversations).length + 1}`,
        messages: [],
      };
      return {
        ...state,
        currentConversationId: conversation.id,
        conversations: {
          ...state.conversations,
          [conversation.id]: conversation,
        },
      };
    }
    case SELECT_CONVERSATION: {
      const { conversationId } = action.payload;
      return {
        ...state,
        currentConversationId: conversationId,
      };
    }
    // ... other actions
    default:
      return state;
  }
};

export default chatReducer;
