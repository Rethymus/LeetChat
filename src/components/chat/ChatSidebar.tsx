import React, { useState, useEffect } from "react";
import { Menu, Input, Avatar, Badge, Spin, Empty } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../../api/chatApi";
import { setChats, markMessagesAsRead } from "../../store/slices/chatSlice";
import styles from "./ChatSidebar.module.css";

const { Search } = Input;

interface ChatSidebarProps {
  onlineUsers?: number[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onlineUsers = [] }) => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 安全地获取chats，防止undefined错误
  const chats = useSelector((state: any) => state.chat?.chats || []);

  // 使用computed属性方式计算过滤后的聊天列表
  const getFilteredChats = () => {
    if (!searchText.trim()) return chats;

    return chats.filter(
      (chat: any) =>
        chat.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        chat.lastMessage?.content?.toLowerCase().includes(searchText.toLowerCase()),
    );
  };

  // 获取聊天列表
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const chatList = await getUserChats();
        if (chatList) {
          dispatch(setChats(chatList));
        }
      } catch (error) {
        console.error("获取聊天列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [dispatch]);

  // 处理选择聊天
  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
    dispatch(markMessagesAsRead(chatId));
  };

  // 检查用户是否在线
  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(Number(userId));
  };

  // 获取过滤后的聊天列表
  const filteredChats = getFilteredChats();

  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <Search
          placeholder="搜索聊天"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      ) : filteredChats.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="没有聊天记录"
          className={styles.empty}
        />
      ) : (
        <div className={styles.chatList}>
          {filteredChats.map((chat: any) => {
            const isOnline = isUserOnline(chat.id);
            const isActive = location.pathname === `/chat/${chat.id}`;

            return (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${isActive ? styles.active : ""}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <Badge count={chat.unreadCount || 0} size="small">
                  <Avatar
                    src={chat.avatar}
                    icon={<UserOutlined />}
                    className={`${styles.avatar} ${isOnline ? styles.online : ""}`}
                  />
                </Badge>
                <div className={styles.chatInfo}>
                  <div className={styles.chatTitle}>{chat.title || "未命名聊天"}</div>
                  <div className={styles.chatLastMsg}>
                    {chat.lastMessage?.content || (
                      <span className={styles.noMessage}>暂无消息</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
