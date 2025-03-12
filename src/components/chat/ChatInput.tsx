import React, { useState, useRef } from "react";
import { Input, Button, Tooltip, Upload, Popover } from "antd";
import { SmileOutlined, PictureOutlined, FolderOutlined, SendOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import styles from "./ChatInput.module.css";

// 表情集合 - 添加更多表情符号
const emojis = [
  "😀",
  "😂",
  "😊",
  "😎",
  "😍",
  "🥰",
  "😘",
  "🤗",
  "🤔",
  "😴",
  "😭",
  "🥺",
  "😡",
  "🤯",
  "👍",
  "👋",
  "❤️",
  "🎉",
];

const ChatInput: React.FC<{ onSendMessage: (message: string, type?: string) => void }> = ({
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(message.trim(), "text");
    setMessage("");
    inputRef.current?.focus();
  };

  // 添加插入表情功能
  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // 表情面板内容
  const emojiContent = (
    <div className={styles.emojiPanel}>
      {emojis.map((emoji) => (
        <span key={emoji} className={styles.emojiItem} onClick={() => handleEmojiClick(emoji)}>
          {emoji}
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.chatInput}>
      <div className={styles.inputContainer}>
        <div className={styles.actionsBar}>
          <Popover
            content={
              <div className={styles.emojiPanel}>
                {/* 表情符号 */}
                {["😊", "😂", "😍", "🤔", "😎", "👍", "❤️", "😢"].map((emoji) => (
                  <span
                    key={emoji}
                    className={styles.emojiItem}
                    onClick={() => {
                      setMessage((prev) => prev + emoji);
                      inputRef.current?.focus();
                    }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            }
            trigger="click"
            placement="topLeft"
          >
            <Button type="text" icon={<SmileOutlined />} className={styles.actionButton} />
          </Popover>

          <Upload
            beforeUpload={() => false}
            showUploadList={false}
            onChange={(info) => {
              // 图片上传逻辑
            }}
          >
            <Button type="text" icon={<PictureOutlined />} className={styles.actionButton} />
          </Upload>

          <Upload
            beforeUpload={() => false}
            showUploadList={false}
            onChange={(info) => {
              // 文件上传逻辑
            }}
          >
            <Button type="text" icon={<FolderOutlined />} className={styles.actionButton} />
          </Upload>
        </div>

        <Input.TextArea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className={styles.textarea}
        />

        <div className={styles.sendControls}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            className={styles.sendButton}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
