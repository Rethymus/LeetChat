import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import styles from "./ChatWindow.module.css";
import { addMessage, setMessages, markMessagesAsRead } from "../../store/slices/chatSlice";
import { fetchMessages, sendTextMessage, uploadImage } from "../../api/chatApi";
import { socketService } from "../../services/socketService";

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, currentUserId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.chat.messagesByChatId[chatId] || []);
  const chat = useSelector((state: any) => state.chat.chats.find((c: any) => c.id === chatId));

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载消息历史
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const result = await fetchMessages(chatId, { page: 1, pageSize: 20 });
        if (result && result.messages) {
          dispatch(
            setMessages({
              chatId,
              messages: result.messages,
            }),
          );
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.error("加载消息失败:", error);
        message.error("加载消息失败");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      loadMessages();
    }
  }, [chatId, dispatch]);

  // 消息滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 标记消息为已读
  useEffect(() => {
    if (chatId && messages.length > 0) {
      dispatch(markMessagesAsRead(chatId));

      // 发送已读回执到服务器
      const unreadMessageIds = messages
        .filter((msg: any) => msg.status !== "read" && msg.senderId !== currentUserId)
        .map((msg: any) => msg.id);

      if (unreadMessageIds.length > 0) {
        socketService.markAsRead(chatId, unreadMessageIds);
      }
    }
  }, [chatId, messages, dispatch, currentUserId]);

  // 加载更多消息
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchMessages(chatId, { page: nextPage, pageSize: 20 });

      if (result && result.messages) {
        dispatch(
          setMessages({
            chatId,
            messages: result.messages,
            prepend: true,
          }),
        );
        setPage(nextPage);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error("加载更多消息失败:", error);
      message.error("加载更多消息失败");
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const handleSendMessage = (content: string, type: string, tempId: string) => {
    // 创建临时消息对象
    const newMessage = {
      id: tempId,
      chatId,
      senderId: currentUserId,
      content,
      type,
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    // 将消息添加到Redux store
    dispatch(addMessage(newMessage));
  };

  if (!chatId) {
    return (
      <div className={styles.noChat}>
        <p>请选择一个聊天</p>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <ChatHeader
        title={chat?.title || "未命名聊天"}
        avatar={chat?.avatar}
        online={chat?.online || false}
      />

      <div className={styles.messageContainer}>
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <MessageInput chatId={chatId} disabled={sending} onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
