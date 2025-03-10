import React from "react";
import { Avatar, Spin, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./MessageList.module.css";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, loading }) => {
  // 格式化时间
  const formatTime = (time: string) => {
    const messageDate = dayjs(time);
    const now = dayjs();
    
    if (messageDate.isSame(now, 'day')) {
      return messageDate.format('HH:mm');
    } else if (messageDate.isSame(now.subtract(1, 'day'), 'day')) {
      return `昨天 ${messageDate.format('HH:mm')}`;
    } else if (messageDate.isSame(now, 'year')) {
      return messageDate.format('MM-DD HH:mm');
    } else {
      return messageDate.format('YYYY-MM-DD HH:mm');
    }
  };
  
  // 渲染消息内容
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'text':
        return <div className={styles.textContent}>{message.content}</div>;
      case 'image':
        return (
          <div className={styles.imageContent}>
            <Image src={message.content} alt="图片" width={200} />
          </div>
        );
      case 'file':
        return <div className={styles.fileContent}>文件: {message.content}</div>;
      case 'system':
        return <div className={styles.systemMessage}>{message.content}</div>;
      default:
        return <div className={styles.textContent}>{message.content}</div>;
    }
  };
  
  // 按日期分组显示消息
  const renderMessageGroups = () => {
    let lastDate = '';
    
    return messages.map((message, index) => {
      const messageDate = dayjs(message.createdAt).format('YYYY-MM-DD');
      const showDateDivider = messageDate !== lastDate;
      
      if (showDateDivider) {
        lastDate = messageDate;
      }
      
      const isCurrentUser = message.senderId === currentUserId;
      
      return (
        <React.Fragment key={message.id}>
          {showDateDivider && (
            <div className={styles.dateDivider}>
              {dayjs(message.createdAt).format('YYYY年MM月DD日')}
            </div>
          )}
          
          {message.type === 'system' ? (
            <div className={styles.systemMessageContainer}>
              {renderMessageContent(message)}
            </div>
          ) : (
            <div className={`${styles.messageItem} ${isCurrentUser ? styles.rightAlign : styles.leftAlign}`}>
              {!isCurrentUser && (
                <Avatar 
                  className={styles.avatar} 
                  icon={<UserOutlined />} 
                />
              )}
              <div className={`${styles.messageBubble} ${isCurrentUser ? styles.myMessage : styles.otherMessage}`}>
                {renderMessageContent(message)}
              </div>
              {isCurrentUser && (
                <Avatar 
                  className={styles.avatar} 
                  icon={<UserOutlined />} 
                />
              )}
            </div>
          )}
          <div className={`${styles.messageTime} ${isCurrentUser ? styles.rightAlign : styles.leftAlign}`}>
            {formatTime(message.createdAt)}
            {isCurrentUser && (
              <span className={styles.messageStatus}>
                {message.status === 'sending' && ' 发送中...'}
                {message.status === 'failed' && ' 发送失败'}
              </span>
            )}
          </div>
        </React.Fragment>
      );
    });
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin />
      </div>
    );
  }
  
  return (
    <div className={styles.messageList}>
      {messages.length === 0 ? (
        <div className={styles.emptyMessage}>暂无消息记录</div>
      ) : (
        renderMessageGroups()
      )}
    </div>
  );
};

export default MessageList;