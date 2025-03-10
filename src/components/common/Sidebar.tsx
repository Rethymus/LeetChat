import React from "react";
import { Menu, Avatar, Badge, Tooltip } from "antd";
import { 
  MessageOutlined, 
  TeamOutlined, 
  UserOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  selectedKey: string;
  onSelectMenu: (key: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey, onSelectMenu, isMobile = false }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const menuItems = [
    {
      key: "chat",
      icon: <Badge dot offset={[5, 0]}><MessageOutlined /></Badge>,
      label: "聊天",
    },
    {
      key: "contacts",
      icon: <TeamOutlined />,
      label: "通讯录",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "我的",
    }
  ];
  
  if (isMobile) {
    return (
      <div className={styles.mobileNav}>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          className={styles.mobileMenu}
          onClick={({ key }) => onSelectMenu(key as string)}
          items={menuItems}
        />
      </div>
    );
  }
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <Avatar 
          size={64} 
          src={user?.avatar} 
          className={styles.avatar}
          icon={<UserOutlined />}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className={styles.menu}
        onClick={({ key }) => onSelectMenu(key as string)}
        items={menuItems}
      />
      <div className={styles.footer}>
        <Tooltip title="退出登录">
          <LogoutOutlined className={styles.logout} onClick={handleLogout} />
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;