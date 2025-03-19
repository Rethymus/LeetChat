import { io, Socket } from "socket.io-client";
import { addMessage, updateMessageStatus } from "../store/slices/chatSlice";
import { store } from "../store";

class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  // 连接WebSocket
  connect(token: string) {
    if (this.connected) return;

    // 实际项目中应该使用环境变量或配置
    const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("WebSocket连接成功");
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket连接断开");
      this.connected = false;
    });

    // 监听新消息
    this.socket.on("new_message", (message) => {
      store.dispatch(addMessage(message));
    });

    // 监听消息状态更新
    this.socket.on("message_status", ({ messageId, chatId, status }) => {
      store.dispatch(
        updateMessageStatus({
          chatId,
          messageId,
          status,
        }),
      );
    });

    // 监听错误
    this.socket.on("error", (err) => {
      console.error("WebSocket错误:", err);
    });
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // 发送消息
  sendMessage(message) {
    if (!this.socket || !this.connected) {
      console.error("WebSocket未连接");
      return false;
    }

    this.socket.emit("send_message", message);
    return true;
  }

  // 标记消息为已读
  markAsRead(chatId: string, messageIds: string[]) {
    if (!this.socket || !this.connected) {
      console.error("WebSocket未连接");
      return;
    }

    this.socket.emit("mark_as_read", { chatId, messageIds });
  }
}

export const socketService = new SocketService();
