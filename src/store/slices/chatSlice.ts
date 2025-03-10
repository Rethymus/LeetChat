import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types';

interface ChatState {
  activeChat: string | null;
  messages: Record<string, Message[]>;
  typing: Record<string, string[]>; // chatId -> userIds
}

const initialState: ChatState = {
  activeChat: null,
  messages: {},
  typing: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<string>) {
      state.activeChat = action.payload;
    },
    
    addMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      if (!state.messages[message.chatId]) {
        state.messages[message.chatId] = [];
      }
      state.messages[message.chatId].push(message);
    },
    
    setMessages(state, action: PayloadAction<{ chatId: string, messages: Message[] }>) {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    
    setTyping(state, action: PayloadAction<{ chatId: string, userId: string, isTyping: boolean }>) {
      const { chatId, userId, isTyping } = action.payload;
      
      if (!state.typing[chatId]) {
        state.typing[chatId] = [];
      }
      
      if (isTyping && !state.typing[chatId].includes(userId)) {
        state.typing[chatId].push(userId);
      } else if (!isTyping) {
        state.typing[chatId] = state.typing[chatId].filter(id => id !== userId);
      }
    }
  },
});

export const { setActiveChat, addMessage, setMessages, setTyping } = chatSlice.actions;
export default chatSlice.reducer;