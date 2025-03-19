import axios from "axios";
import { socketService } from "../services/socketService";

export interface Chat {
  id: string;
  title: string;
  avatar?: string;
  lastMessage?: any;
  unreadCount: number;
  online: boolean;
  typing: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface ChatListResponse {
  chats: any[];
}

export interface MessagesResponse {
  messages: any[];
  hasMore: boolean;
}

// 获取当前用户的聊天列表
export const getUserChats = async (): Promise<Chat[]> => {
  try {
    // 此处可先使用模拟数据
    const mockChats: Chat[] = [
      {
        id: "1",
        title: "用户1",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        lastMessage: { content: "你好，这是一条测试消息", createdAt: new Date().toISOString() },
        unreadCount: 2,
        online: true,
        typing: false,
      },
      {
        id: "2",
        title: "用户2",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        unreadCount: 0,
        online: false,
        typing: false,
      },
    ];

    return mockChats;

    // 实际项目中应该调用API
    // const response = await axios.get('/api/v1/chat/list');
    // return response.data.data.chats;
  } catch (error) {
    console.error("获取聊天列表失败:", error);
    return [];
  }
};

// 获取特定聊天的消息
export const fetchMessages = async (
  chatId: string,
  { page = 1, pageSize = 20 } = {},
): Promise<MessagesResponse> => {
  try {
    // 模拟数据
    const currentUserId = localStorage.getItem("userId") || "0";
    const messages: Message[] = [];

    for (let i = 0; i < 10; i++) {
      messages.push({
        id: `msg-${i}`,
        chatId,
        senderId: i % 2 === 0 ? currentUserId : chatId,
        content: i % 2 === 0 ? `我发送的消息 ${i}` : `对方发送的消息 ${i}`,
        type: "text",
        status: "sent",
        createdAt: new Date(Date.now() - i * 60000).toISOString(),
      });
    }

    return { messages, hasMore: page < 3 };

    // 实际项目中应该调用API
    // const response = await axios.get(`/api/v1/chat/messages/${chatId}`, { params: { page, pageSize } });
    // return response.data.data;
  } catch (error) {
    console.error("获取消息失败:", error);
    throw error;
  }
};

// 发送文本消息
export const sendTextMessage = async (
  chatId: string,
  content: string,
  type: string = "text",
): Promise<{ success: boolean }> => {
  try {
    // 创建消息对象
    const message = {
      chatId,
      content,
      type,
    };

    // 通过Socket发送消息
    socketService.sendMessage(message);

    // 模拟API响应
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };

    // 实际项目中应该调用API
    // const response = await axios.post('/api/v1/chat/message', message);
    // return response.data.data;
  } catch (error) {
    console.error("发送消息失败:", error);
    throw error;
  }
};

// 上传图片
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append("file", file);

    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return URL.createObjectURL(file); // 返回本地URL用于测试

    // 实际项目中应该调用API
    // const response = await axios.post('/api/v1/upload/image', formData);
    // return response.data.data.url;
  } catch (error) {
    console.error("上传图片失败:", error);
    throw error;
  }
};

// 创建新聊天
export const createChat = async (userId: number): Promise<string> => {
  try {
    // 模拟创建聊天
    await new Promise((resolve) => setTimeout(resolve, 500));
    return userId.toString();

    // 实际项目中应该调用API
    // const response = await axios.post('/api/v1/chat/create', { userId });
    // return response.data.data.chatId;
  } catch (error) {
    console.error("创建聊天失败:", error);
    throw error;
  }
};

// 标记消息为已读
export const markMessagesAsRead = async (
  chatId: string,
  messageIds: string[],
): Promise<boolean> => {
  try {
    const response = await axios.post("/api/v1/message/mark-read", {
      chat_id: chatId,
      message_ids: messageIds,
    });

    return response.data.code === 0;
  } catch (error) {
    console.error("标记消息已读失败:", error);
    return false;
  }
};

// 辅助函数：生成UUID
const generateUuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
