import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import ContactsPage from "./pages/ContactsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// 权限保护组件
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/chat" replace /> },
      { path: "chat", element: <ChatPage /> },
      { path: "chat/:chatId", element: <ChatPage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);
