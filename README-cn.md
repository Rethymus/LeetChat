# LeetChat

[English](README.md) | 简体中文

---

## 项目介绍

LeetChat 是一个模仿微信界面的实时聊天应用，前端使用 React 开发，后端使用 Go 语言。该项目提供了完整的聊天功能，包括私聊、群聊、联系人管理等，并且采用响应式设计，适配各种设备。

## 功能特点

- 👥 用户认证：注册、登录、个人资料管理
- 💬 即时通讯：实时消息收发、已读状态
- 🖼️ 多媒体支持：发送图片、文件
- 👪 联系人管理：添加好友、创建群组
- 📱 响应式设计：完美适配移动端和桌面端
- 🌙 微信风格界面：熟悉的用户体验

## 技术栈

### 前端

- **核心框架**：React + TypeScript
- **实时通信**：Socket.IO + WebSocket
- **UI 组件库**：Ant Design
- **状态管理**：Redux Toolkit + RTK Query
- **路由**：React Router v6
- **构建工具**：Vite
- **网络请求**：Axios

### 后端 (计划使用)

- **语言**：Go
- **框架**：Gin/Echo
- **数据库**：MySQL/PostgreSQL
- **缓存**：Redis
- **WebSocket**：gorilla/websocket

## 快速开始

### 前提条件

- Node.js 16.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/leetchat.git
   cd leetchat/leetchat-frontend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 打开浏览器访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 项目结构

## 后端API接口设计

### 认证接口

- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户信息

### 聊天接口

- `GET /api/chats` - 获取聊天列表
- `GET /api/chats/:chatId` - 获取聊天详情
- `GET /api/chats/:chatId/messages` - 获取聊天消息
- `POST /api/chats/:chatId/messages` - 发送消息
- `POST /api/chats` - 创建新聊天

### 联系人接口

- `GET /api/contacts` - 获取联系人列表
- `POST /api/contacts/search` - 搜索联系人
- `POST /api/contacts` - 添加联系人

### 文件上传接口

- `GET /api/upload/sign` - 获取OSS直传签名

## 贡献指南

1. Fork 这个仓库
2. 创建你的功能分支 (git checkout -b feature/amazing-feature)
3. 提交你的更改 (git commit -m 'Add some amazing feature')
4. 推送到分支 (git push origin feature/amazing-feature)
5. 打开一个 Pull Request