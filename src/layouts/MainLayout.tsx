import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import styles from "./MainLayout.module.css";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [collapsed, setCollapsed] = useState(isMobile);

  // 监听屏幕大小变化
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 在移动端，点击菜单后自动折叠侧边栏
  const handleMenuSelect = (key: string) => {
    console.log("选中菜单项:", key);
    navigate(`/${key}`);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <Layout className={styles.layout}>
      <Sidebar
        selectedKey={location.pathname.split("/")[1] || "chat"}
        onSelectMenu={handleMenuSelect}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <Layout className={styles.mainContent}>
        <Content
          className={styles.content}
          style={{
            marginLeft: isMobile ? 0 : collapsed ? "80px" : "300px",
            transition: "margin-left 0.3s",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
