// 消息类型定义
export type MessageType = "text" | "image" | "file" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export type ChatType = "private" | "group";

// 消息数据结构
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
}

// 聊天数据结构
export interface Chat {
  id: string;
  type: ChatType;
  title?: string;
  avatar?: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// 聊天参与者
export interface ChatParticipant {
  userId: string;
  nickname: string;
  avatar: string;
  role?: "admin" | "member";
  status?: "online" | "offline";
}
