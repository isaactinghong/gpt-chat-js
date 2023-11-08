import { ADD_MESSAGE, CREATE_CONVERSATION, ChatActionTypes } from '../actions/chatActions';
import { ChatState } from '../types/chat-state';

// reducers/chatReducer.js
const initialState = {
  conversations: {},
  currentConversationId: null,
};

const chatReducer = (state = initialState, action: ChatActionTypes): ChatState  => {
  switch (action.type) {
    case ADD_MESSAGE:
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
    case CREATE_CONVERSATION:
      const conversation = action.payload;
      return {
        ...state,
        currentConversationId: conversation.id,
        conversations: {
          ...state.conversations,
          [conversation.id]: conversation,
        },
      };
    // ... other actions
    default:
      return state;
  }
};

export default chatReducer;
