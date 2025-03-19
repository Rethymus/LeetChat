import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./components/common/ProtectedRoute";

import "./App.css";
import "./layout.css"; // 导入响应式修正

const App: React.FC = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" /> : <Login />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/chat" /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/chat" /> : <ForgetPassword />}
        />

        {/* 受保护的路由 */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 重定向和404 */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
