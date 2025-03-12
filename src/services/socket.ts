import { io, Socket } from "socket.io-client";
import { store } from "../store";
import { addMessage } from "../store/slices/chatSlice";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket) return;

    this.socket = io("/", {
      auth: { token },
    });

    this.setupListeners();
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("message:new", (message) => {
      store.dispatch(addMessage(message));
    });

    // 修复未使用的参数
    this.socket.on("typing", (_data: { chatId: string; userId: string; isTyping: boolean }) => {
      // 记录一个TODO注释
      // TODO: 实现打字状态显示功能
      console.log("收到打字状态更新，待实现显示功能");
    });

    // 或者使用解构赋值并添加下划线
    this.socket.on("typing", ({ chatId: _chatId, userId: _userId, isTyping: _isTyping }) => {
      // 以后可能会用到，暂时保留事件监听
    });
  }

  sendMessage(chatId: string, content: string, type: string = "text") {
    if (!this.socket) return;

    this.socket.emit("message:send", { chatId, content, type });
  }

  sendTyping(chatId: string, isTyping: boolean) {
    if (!this.socket) return;

    this.socket.emit("typing", { chatId, isTyping });
  }
}

export const socketService = new SocketService();
