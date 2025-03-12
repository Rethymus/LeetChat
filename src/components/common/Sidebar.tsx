import React from "react";
import { Avatar, Badge, Tooltip } from "antd";
import {
  UserOutlined,
  CommentOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Sidebar.module.css";
import { logout } from "../../store/slices/authSlice";

interface SidebarProps {
  selectedKey: string;
  onSelectMenu: (key: string) => void;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

interface SidebarItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedKey,
  onSelectMenu,
  collapsed = false,
  onCollapse,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const [activeKey, setActiveKey] = React.useState(selectedKey);

  // 当selectedKey变化时更新activeKey
  React.useEffect(() => {
    setActiveKey(selectedKey);
  }, [selectedKey]);

  // 定义菜单项
  const items: SidebarItem[] = [
    {
      key: "chat",
      icon: <CommentOutlined />,
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
    },
  ];

  // 菜单项点击处理函数
  const handleItemClick = (key: string) => {
    console.log("点击菜单项:", key);
    setActiveKey(key);
    onSelectMenu(key);
  };

  // 退出登录
  const handleLogout = () => {
    console.log("退出登录");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("contacts");
    localStorage.removeItem("profile");
    dispatch(logout());
    window.location.href = "/login";
  };

  // 渲染菜单项
  const handleClick = (e: React.MouseEvent, key: string) => {
    e.stopPropagation(); // 防止事件冒泡
    console.log("点击了菜单项:", key);
    handleItemClick(key);
  };

  const renderItem = (item: SidebarItem) => (
    <div
      key={item.key}
      className={`${styles.item} ${activeKey === item.key ? styles.active : ""}`}
      onClick={(e) => handleClick(e, item.key)}
    >
      <div className={styles.icon}>{item.icon}</div>
      <div className={styles.label}>{item.label}</div>
    </div>
  );

  console.log("Sidebar rendered with selectedKey:", selectedKey);
  console.log("User in sidebar:", user);

  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <Avatar
          size={50}
          icon={<UserOutlined />}
          src={user?.avatar}
          className={styles.avatar}
          onClick={() => handleItemClick("profile")}
        />
      </div>

      <div className={styles.menu}>{items.map(renderItem)}</div>

      <div className={styles.footer}>
        <Tooltip title="退出登录" placement="right">
          <LogoutOutlined className={styles.logout} onClick={handleLogout} />
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
