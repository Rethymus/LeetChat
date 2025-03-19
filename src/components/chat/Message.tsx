import React from "react";
import { Avatar, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Message.module.css";

interface MessageProps {
  message: {
    id: string;
    senderId: string;
    content: string;
    type: string;
    status: string;
    createdAt: string;
  };
  isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => {
  // 根据消息类型渲染不同内容
  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <div className={styles.textContent}>{message.content}</div>;
      case "image":
        return (
          <div className={styles.imageContent}>
            <Image
              src={message.content}
              alt="图片消息"
              className={styles.image}
              preview={{ mask: "查看大图" }}
            />
          </div>
        );
      case "file":
        return <div className={styles.fileContent}>文件: {message.content}</div>;
      case "system":
        return <div className={styles.systemMessage}>{message.content}</div>;
      default:
        return <div>{message.content}</div>;
    }
  };

  // 为系统消息显示不同的样式
  if (message.type === "system") {
    return <div className={styles.systemMessageContainer}>{renderContent()}</div>;
  }

  return (
    <div className={`${styles.message} ${isOwn ? styles.own : styles.other}`}>
      {!isOwn && <Avatar icon={<UserOutlined />} className={styles.avatar} />}
      <div className={styles.bubbleContainer}>
        <div className={styles.bubble}>{renderContent()}</div>
        <div className={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {isOwn && <Avatar icon={<UserOutlined />} className={styles.avatar} />}
    </div>
  );
};

export default Message;
