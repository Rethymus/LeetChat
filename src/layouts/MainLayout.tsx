import React from "react";
import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import styles from "./MainLayout.module.css";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <Layout className={styles.layout}>
      <Sidebar
        selectedKey={location.pathname.split("/")[1] || 'chat'}
        onSelectMenu={(key) => navigate(`/${key}`)}
      />
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;