import React from 'react';
import { Conversation } from '../state/types/conversation';
import { selectConversation } from '../state/actions/chatActions';
import { useDispatch } from 'react-redux';
import {
  Text,
  StyleSheet,
} from "react-native";

interface ConversationItemProps {
  conversation: Conversation;
  navigation: any;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, navigation }) => {
  const dispatch = useDispatch();

  return (
    <Text
      key={conversation.id}
      style={styles.conversationTitle}
      onPress={() => {
        // select the conversation
        dispatch(selectConversation(conversation.id));

        /* Navigate to conversation screen */
        navigation.navigate("Chat");
      }}
    >
      {conversation.title}
    </Text>
  );
}

const styles = StyleSheet.create({
  conversationTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
});


export default ConversationItem;