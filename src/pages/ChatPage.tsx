import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, Empty, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import styles from "./ChatPage.module.css";

const { Sider, Content } = Layout;

// 模拟数据
const mockChats = [
  {
    id: "1",
    name: "张三",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "private",
    lastMessage: {
      id: "msg1",
      chatId: "1",
      senderId: "2",
      content: "你好，最近怎么样？",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5分钟前
    },
    unreadCount: 0,
    members: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "项目讨论组",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    type: "group",
    lastMessage: {
      id: "msg2",
      chatId: "2",
      senderId: "3",
      content: "下午3点开会讨论方案",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    },
    unreadCount: 2,
    members: [],
    createdAt: "",
    updatedAt: "",
  },
];

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile && chatId) {
    // 移动端聊天详情视图
    return (
      <div className={styles.mobileChatView}>
        <div className={styles.mobileHeader}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/chat")}
            className={styles.backButton}
          />
        </div>
        <ChatWindow chatId={chatId} />
      </div>
    );
  }

  return (
    <Layout className={styles.chatLayout}>
      <Sider
        width={isMobile ? "100%" : 300}
        className={styles.sider}
        theme="light"
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
      >
        <ChatList chats={mockChats} loading={false} activeChatId={chatId} />
      </Sider>
      {(!isMobile || !chatId) && (
        <Content className={styles.content}>
          {chatId ? <ChatWindow chatId={chatId} /> : <Empty description="选择聊天或开始新的对话" />}
        </Content>
      )}
    </Layout>
  );
};

export default ChatPage;
