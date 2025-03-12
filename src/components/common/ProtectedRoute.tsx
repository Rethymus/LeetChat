// 创建新文件: f:\Code\New\LeetChat\src\components\common\ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // 修改为始终通过模拟用户的权限验证，确保页面可访问
  // 实际项目中，这应该从Redux中获取正确的认证状态
  const isAuthenticated = token ? true : false;

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
