import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import styles from "./ChatWindow.module.css";

const { Header, Content, Footer } = Layout;

// 模拟数据
const mockChats = {
  "1": {
    id: "1",
    name: "张三",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "private" as const,
    members: [],
    createdAt: "",
    updatedAt: "",
  },
  "2": {
    id: "2",
    name: "项目讨论组",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "group" as const,
    members: [],
    createdAt: "",
    updatedAt: "",
  },
};

const mockMessages = {
  "1": [
    {
      id: "1-1",
      chatId: "1",
      senderId: "current-user", // 当前用户
      content: "嗨，你好！",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
    },
    {
      id: "1-2",
      chatId: "1",
      senderId: "2", // 对方
      content: "你好啊，最近怎么样？",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    },
    {
      id: "1-3",
      chatId: "1",
      senderId: "current-user",
      content: "我很好，谢谢关心。你呢？",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5分钟前
    },
  ],
  "2": [
    {
      id: "2-1",
      chatId: "2",
      senderId: "3",
      content: "大家好，下午3点开会",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2小时前
    },
    {
      id: "2-2",
      chatId: "2",
      senderId: "4",
      content: "好的，我会准时参加",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5小时前
    },
    {
      id: "2-3",
      chatId: "2",
      senderId: "current-user",
      content: "收到，我也会准时到场",
      type: "text" as const,
      status: "read" as const,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    },
  ],
};

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  status: "read" | "sent" | "delivered";
  createdAt: string;
}

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const chat = mockChats[chatId as keyof typeof mockChats];
  const [messageList, setMessageList] = useState<Message[]>(
    mockMessages[chatId as keyof typeof mockMessages] || [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {
    setMessageList(mockMessages[chatId as keyof typeof mockMessages] || []);
  }, [chatId]);

  const handleSendMessage = (content: string, type: string = "text") => {
    console.log(`发送消息到 ${chatId}:`, content, type);

    // 添加新消息到列表
    const newMessage = {
      id: `${chatId}-${Date.now()}`,
      chatId,
      senderId: "current-user",
      content,
      type: type as "text" | "image" | "file" | "system",
      status: "sent" as const,
      createdAt: new Date().toISOString(),
    };

    setMessageList((prev) => [...prev, newMessage]);
  };

  if (!chat) {
    return <div className={styles.notFound}>聊天不存在</div>;
  }

  return (
    <Layout className={styles.chatWindow}>
      <Header className={styles.header}>
        <ChatHeader chat={chat} />
      </Header>
      <Content className={styles.messageContainer}>
        <MessageList messages={messageList} />
        <div ref={messagesEndRef} />
      </Content>
      <Footer className={styles.footer}>
        <ChatInput onSendMessage={handleSendMessage} />
      </Footer>
    </Layout>
  );
};

export default ChatWindow;
