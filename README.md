# LeetChat

English | [简体中文](README-cn.md)

---

## Introduction

LeetChat is a real-time chat application that mimics WeChat's interface, developed with React for the frontend and Go for the backend. This project provides comprehensive chat functionalities including private messaging, group chats, contact management, and more, all designed with a responsive UI that adapts to various devices.

## Features

- 👥 User Authentication: Register, login, profile management
- 💬 Real-time Messaging: Instant message delivery, read status
- 🖼️ Multimedia Support: Send images and files
- 👪 Contact Management: Add friends, create groups
- 📱 Responsive Design: Perfect for mobile and desktop
- 🌙 WeChat-style UI: Familiar user experience

## Tech Stack

### Frontend

- **Core Framework**: React + TypeScript
- **Real-time Communication**: Socket.IO + WebSocket
- **UI Components**: Ant Design
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **HTTP Client**: Axios

### Backend (Planned)

- **Language**: Go
- **Framework**: Gin/Echo
- **Database**: MySQL/PostgreSQL
- **Cache**: Redis
- **WebSocket**: gorilla/websocket

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn or pnpm

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/leetchat.git
   cd leetchat/leetchat-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and visit http://localhost:5173

### Build for Production

```bash
npm run build
```

## Project Structure

## Backend API Design

### Authentication Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Chat Endpoints

- `GET /api/chats` - Get chat list
- `GET /api/chats/:chatId` - Get chat details
- `GET /api/chats/:chatId/messages` - Get chat messages
- `POST /api/chats/:chatId/messages` - Send message
- `POST /api/chats` - Create new chat

### Contact Endpoints

- `GET /api/contacts` - Get contact list
- `POST /api/contacts/search` - Search contacts
- `POST /api/contacts` - Add contact

### File Upload Endpoints

- `GET /api/upload/sign` - Get OSS upload signature

## Contribution Guidelines

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
