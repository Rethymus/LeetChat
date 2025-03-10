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
    
    this.socket.on("typing", ({ chatId, userId, isTyping }) => {
      // 处理正在输入状态
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