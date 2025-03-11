import React, { useState, useRef } from "react";
import { Input, Button, Tooltip, Upload } from "antd";
import { SmileOutlined, PictureOutlined, FolderOutlined, SendOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  onSendMessage: (content: string, type: string) => void;
  chatId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, chatId }) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<any>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    onSendMessage(message.trim(), "text");
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (file: UploadFile) => {
    console.log("上传图片:", file);
    // 实际项目中这里应该调用上传服务，获取图片URL后再发送消息
    // 这里简化处理，直接将文件名作为消息内容发送
    onSendMessage(`[图片] ${file.name}`, "image");
    return false; // 阻止默认上传行为
  };

  const handleFileUpload = (file: UploadFile) => {
    console.log("上传文件:", file);
    // 实际项目中这里应该调用上传服务，获取文件URL后再发送消息
    onSendMessage(`[文件] ${file.name}`, "file");
    return false; // 阻止默认上传行为
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.toolbar}>
        <Tooltip title="表情">
          <SmileOutlined className={styles.toolbarIcon} />
        </Tooltip>

        <Upload accept="image/*" showUploadList={false} beforeUpload={handleImageUpload as any}>
          <Tooltip title="图片">
            <PictureOutlined className={styles.toolbarIcon} />
          </Tooltip>
        </Upload>

        <Upload showUploadList={false} beforeUpload={handleFileUpload as any}>
          <Tooltip title="文件">
            <FolderOutlined className={styles.toolbarIcon} />
          </Tooltip>
        </Upload>
      </div>

      <div className={styles.inputWrapper}>
        <Input.TextArea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className={styles.messageInput}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!message.trim()}
          className={styles.sendButton}
        />
      </div>
    </div>
  );
};

export default ChatInput;
