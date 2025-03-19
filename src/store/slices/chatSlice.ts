import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  online: boolean;
  typing: boolean;
}

interface ChatState {
  chats: Chat[];
  messagesByChatId: {
    [chatId: string]: Message[];
  };
  selectedChatId: string | null;
}

const initialState: ChatState = {
  chats: [], // 确保这里初始化为空数组，而不是undefined
  messagesByChatId: {},
  selectedChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    addChat(state, action: PayloadAction<Chat>) {
      state.chats.push(action.payload);
    },
    selectChat(state, action: PayloadAction<string>) {
      state.selectedChatId = action.payload;
    },
    setMessages(
      state,
      action: PayloadAction<{
        chatId: string;
        messages: Message[];
        prepend?: boolean;
      }>,
    ) {
      const { chatId, messages, prepend } = action.payload;

      if (prepend && state.messagesByChatId[chatId]) {
        // 添加到已有消息的开头
        state.messagesByChatId[chatId] = [...messages, ...state.messagesByChatId[chatId]];
      } else {
        state.messagesByChatId[chatId] = messages;
      }
    },
    addMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const chatId = message.chatId;

      // 添加消息到指定聊天
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = [];
      }
      state.messagesByChatId[chatId].push(message);

      // 更新聊天列表中的最后一条消息
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;

        // 如果不是当前选中的聊天，增加未读消息数
        if (state.selectedChatId !== chatId) {
          state.chats[chatIndex].unreadCount += 1;
        }
      }
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        status: string;
      }>,
    ) {
      const { chatId, messageId, status } = action.payload;

      if (state.messagesByChatId[chatId]) {
        const messageIndex = state.messagesByChatId[chatId].findIndex(
          (message) => message.id === messageId,
        );
        if (messageIndex !== -1) {
          state.messagesByChatId[chatId][messageIndex].status = status;
        }
      }
    },
    markMessagesAsRead(state, action: PayloadAction<string>) {
      const chatId = action.payload;

      // 将指定聊天的未读消息数重置为0
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].unreadCount = 0;
      }
    },
    setUserOnlineStatus(
      state,
      action: PayloadAction<{
        userId: string;
        online: boolean;
      }>,
    ) {
      const { userId, online } = action.payload;

      // 更新对应聊天的在线状态
      const chatIndex = state.chats.findIndex((chat) => chat.id === userId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].online = online;
      }
    },
  },
});

export const {
  setChats,
  addChat,
  selectChat,
  setMessages,
  addMessage,
  updateMessageStatus,
  markMessagesAsRead,
  setUserOnlineStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
