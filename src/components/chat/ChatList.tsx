import React from "react";
import { List, Input, Avatar, Badge, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./ChatList.module.css";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
}

interface Chat {
  id: string;
  name?: string;
  avatar?: string;
  type: 'private' | 'group';
  lastMessage?: Message;
  unreadCount?: number;
  members: any[];
  createdAt: string;
  updatedAt: string;
}

interface ChatListProps {
  chats: Chat[];
  loading: boolean;
  activeChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, loading, activeChatId }) => {
  const navigate = useNavigate();
  
  const formatTime = (time: string) => {
    const date = dayjs(time);
    const now = dayjs();
    
    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
      return '昨天';
    } else if (date.isSame(now, 'year')) {
      return date.format('MM-DD');
    } else {
      return date.format('YYYY-MM-DD');
    }
  };
  
  return (
    <div className={styles.chatList}>
      <div className={styles.header}>
        <Input 
          placeholder="搜索" 
          prefix={<SearchOutlined />} 
          className={styles.searchInput}
        />
      </div>
      
      {loading ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item 
              className={`${styles.chatItem} ${chat.id === activeChatId ? styles.activeChat : ''}`}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div className={styles.avatarContainer}>
                <Badge count={chat.unreadCount || 0} size="small">
                  <Avatar src={chat.avatar} size={44}>
                    {chat.name?.[0] || '?'}
                  </Avatar>
                </Badge>
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.chatTime}>
                    {chat.lastMessage && formatTime(chat.lastMessage.createdAt)}
                  </span>
                </div>
                <div className={styles.chatPreview}>
                  {chat.lastMessage?.content || '暂无消息'}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
      
      <div className={styles.newChat}>
        <PlusOutlined />
      </div>
    </div>
  );
};

export default ChatList;