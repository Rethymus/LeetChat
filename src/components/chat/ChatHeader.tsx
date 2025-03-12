import * as React from "react";
import { Typography, Space, Avatar } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import styles from "./ChatWindow.module.css";
import { User } from "../../types"; // 导入User类型

interface Chat {
  id: string;
  name?: string;
  avatar?: string;
  type: "private" | "group";
  members: User[]; // 替换any[]为User[]
  createdAt: string;
  updatedAt: string;
}

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  return (
    <div className={styles.chatHeaderContainer}>
      <Space>
        <Avatar
          src={chat.avatar}
          icon={chat.type === "private" ? <UserOutlined /> : <TeamOutlined />}
        />
        <Typography.Title level={5} style={{ margin: 0 }}>
          {chat.name}
          {chat.type === "group" && (
            <span style={{ fontSize: "13px", color: "#999", marginLeft: "8px" }}>
              ({chat.members.length}人)
            </span>
          )}
        </Typography.Title>
      </Space>
    </div>
  );
};

export default ChatHeader;
