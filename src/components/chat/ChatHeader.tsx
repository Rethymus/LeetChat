import React from "react";
import { Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./ChatHeader.module.css";

interface ChatHeaderProps {
  title: string;
  avatar?: string;
  online?: boolean;
  typing?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  avatar,
  online = false,
  typing = false,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <Badge dot={online} color="green" offset={[-5, 5]}>
          <Avatar src={avatar} icon={<UserOutlined />} />
        </Badge>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{title}</div>
          {typing && <div className={styles.typing}>正在输入...</div>}
          {!typing && online && <div className={styles.status}>在线</div>}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
