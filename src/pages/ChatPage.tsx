import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { userApi } from "../api/user";
import { socketService } from "../services/socketService";
import styles from "./ChatPage.module.css";

const { Sider, Content } = Layout;

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 获取在线用户
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await userApi.getOnlineUsers();
        if (response.data && response.data.code === 0) {
          setOnlineUsers(response.data.data.online_user);
        }
      } catch (error) {
        console.error("获取在线用户失败:", error);
      }
    };

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 60000); // 每分钟更新一次在线用户列表

    return () => clearInterval(interval);
  }, []);

  // 获取当前用户ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userApi.getUserInfo();
        if (response.data && response.data.code === 0) {
          setCurrentUserId(String(response.data.data.user_info.id));

          // 获取到用户信息后，连接WebSocket
          const token = localStorage.getItem("token");
          if (token) {
            socketService.connect(token);
          }
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };

    fetchUserInfo();

    // 组件卸载时断开WebSocket
    return () => {
      socketService.disconnect();
    };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className={styles.chatLayout}>
      <Sider width={300} className={styles.sider} collapsed={isMobile && !!chatId}>
        <ChatSidebar onlineUsers={onlineUsers} />
      </Sider>
      <Content className={styles.content}>
        {chatId ? (
          <ChatWindow chatId={chatId} currentUserId={currentUserId} />
        ) : (
          <div className={styles.welcome}>
            <h2>欢迎使用 LeetChat</h2>
            <p>选择一个聊天或开始新的对话</p>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatPage;
