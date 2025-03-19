import React from "react";
import { Spin, Button } from "antd";
import Message from "./Message";
import styles from "./MessageList.module.css";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  loading = false,
  hasMore = false,
  onLoadMore,
}) => {
  return (
    <div className={styles.messageList}>
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={onLoadMore} loading={loading} disabled={!hasMore || loading}>
            {loading ? "加载中" : "加载更多"}
          </Button>
        </div>
      )}

      {loading && messages.length === 0 && (
        <div className={styles.loadingContainer}>
          <Spin tip="加载消息中..." />
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} isOwn={message.senderId === currentUserId} />
      ))}
    </div>
  );
};

export default MessageList;
