import React, { useState, useRef } from "react";
import { Input, Button, Upload, message, Tooltip } from "antd";
import { SendOutlined, PictureOutlined, SmileOutlined } from "@ant-design/icons";
import { uploadImage, sendTextMessage } from "../../api/chatApi";
import { socketService } from "../../services/socketService";
import styles from "./MessageInput.module.css";

// 导入表情选择器 (如果需要使用emoji功能，请先安装: npm install emoji-picker-react)
// import EmojiPicker from 'emoji-picker-react';

interface MessageInputProps {
  chatId: string;
  disabled?: boolean;
  onSend: (content: string, type: string, tempId: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId, disabled = false, onSend }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<any>(null);

  // 发送文本消息
  const handleSendMessage = async () => {
    if (!text.trim() || sending || disabled) return;

    const tempId = `temp-${Date.now()}`;
    const trimmedText = text.trim();
    onSend(trimmedText, "text", tempId);
    setText("");
    setSending(true);

    try {
      await sendTextMessage(chatId, trimmedText);
    } catch (error) {
      console.error("发送消息失败:", error);
      message.error("发送消息失败");
    } finally {
      setSending(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    if (sending) return false;

    const tempId = `temp-${Date.now()}`;
    setSending(true);

    try {
      // 预览上传的图片
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        onSend(previewUrl, "image", tempId);
      };
      reader.readAsDataURL(file);

      // 上传图片到服务器
      const imageUrl = await uploadImage(file);
      if (!imageUrl) {
        throw new Error("图片上传失败");
      }
    } catch (error) {
      console.error("上传图片失败:", error);
      message.error("图片上传失败");
    } finally {
      setSending(false);
    }

    return false; // 阻止自动上传
  };

  return (
    <div className={styles.messageInput}>
      <div className={styles.toolbar}>
        <Tooltip title="表情">
          <Button
            type="text"
            icon={<SmileOutlined />}
            onClick={() => setShowEmoji(!showEmoji)}
            disabled={disabled}
          />
        </Tooltip>

        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleImageUpload}
          disabled={disabled || sending}
        >
          <Tooltip title="图片">
            <Button type="text" icon={<PictureOutlined />} disabled={disabled || sending} />
          </Tooltip>
        </Upload>
      </div>

      {/* {showEmoji && (
        <div className={styles.emojiPicker}>
          <EmojiPicker onEmojiClick={(emojiData) => {
            setText(prev => prev + emojiData.emoji);
            setShowEmoji(false);
            inputRef.current?.focus();
          }} />
        </div>
      )} */}

      <div className={styles.inputArea}>
        <Input.TextArea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled || sending}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!text.trim() || disabled || sending}
        />
      </div>
    </div>
  );
};

export default MessageInput;
