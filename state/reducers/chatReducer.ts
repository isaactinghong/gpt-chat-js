import { ADD_MESSAGE, UPDATE_MESSAGE, CREATE_CONVERSATION, ChatActionTypes, DELETE_CONVERSATION, SELECT_CONVERSATION, UPDATE_CONVERSATION } from '../actions/chatActions';
import { ChatState } from '../states/chat-state';
import { Conversation } from '../types/conversation';

// reducers/chatReducer.js
const initialState: ChatState = {
  conversations: {
    '0': {
      id: '0',
      title: 'New Conversation 1',
      messages: [
      ],
    },
  },
  currentConversationId: '0',
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
    case UPDATE_MESSAGE: {
      const { conversationId, message, messageIndex } = action.payload;
      const messages = [...state.conversations[conversationId].messages];
      messages[messageIndex] = message;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            messages,
          },
        },
      };
    }
    case CREATE_CONVERSATION: {

      const conversation: Conversation = _createConversation(
        Object.keys(state.conversations).length
      );
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
    case DELETE_CONVERSATION: {
      const { conversationId } = action.payload;

      const conversationIds = Object.keys(state.conversations);
      const conversationIdIndex = conversationIds.indexOf(conversationId);
      const isLastConversation = conversationIds.length === 1;

      // if more than 2 conversations, delete the selected one and select the next one
      if (conversationIdIndex > -1 && !isLastConversation) {
        const nextConversationIdIndex = conversationIdIndex === conversationIds.length - 1
          ? conversationIdIndex - 1
          : conversationIdIndex + 1;
        const nextConversationId = conversationIds[nextConversationIdIndex];
        const { [conversationId]: deletedConversation, ...remainingConversations } = state.conversations;
        return {
          ...state,
          currentConversationId: nextConversationId,
          conversations: remainingConversations,
        };
      }
      // else if only 1 conversation, delete the selected one and create a new one
      else if (conversationIdIndex > -1 && isLastConversation) {
        const newConversation = _createConversation(
          0
        );
        return {
          ...state,
          currentConversationId: newConversation.id,
          conversations: {
            [newConversation.id]: newConversation,
          },
        };
      }
      // else do nothing
      else {
        return state;
      }
    }
    case UPDATE_CONVERSATION: {
      const { conversationId, title } = action.payload;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId],
            title,
          },
        },
      };
    }
    // ... other actions
    default:
      return state;
  }
};

const _createConversation = (conversationCount): Conversation => ({
  id: new Date().getTime().toString(),
  title: `New Conversation ${conversationCount + 1}`,
  messages: [],
});

export default chatReducer;
