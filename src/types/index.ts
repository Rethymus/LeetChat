export interface User {
  id: string;
  username: string;
  avatar: string;
  nickname?: string;
  status?: 'online' | 'offline';
}

export interface Chat {
  id: string;
  name?: string;
  avatar?: string;
  type: 'private' | 'group';
  lastMessage?: Message;
  unreadCount?: number;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  user: User;
  remark?: string;
  createdAt: string;
}