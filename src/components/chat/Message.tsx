import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Message.module.css";

interface MessageProps {
  message: {
    id: string;
    senderId: string;
    content: string;
    type: "text" | "image" | "file" | "system";
    status: "sending" | "sent" | "delivered" | "read" | "failed";
    createdAt: string;
  };
  isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => {
  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <div className={styles.textContent}>{message.content}</div>;
      case "image":
        return (
          <div className={styles.imageContent}>
            <img src={message.content} alt="图片" className={styles.image} />
          </div>
        );
      case "file":
        return <div className={styles.fileContent}>文件: {message.content}</div>;
      case "system":
        return <div className={styles.systemMessage}>{message.content}</div>;
      default:
        return <div className={styles.textContent}>{message.content}</div>;
    }
  };

  return (
    <div className={`${styles.message} ${isOwn ? styles.own : styles.other}`}>
      {!isOwn && <Avatar icon={<UserOutlined />} className={styles.avatar} />}
      <div className={styles.bubble}>{renderContent()}</div>
      {isOwn && <Avatar icon={<UserOutlined />} className={styles.avatar} />}
    </div>
  );
};

export default Message;
