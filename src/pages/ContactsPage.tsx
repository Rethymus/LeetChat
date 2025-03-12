import React, { useState, useEffect } from "react";
import { List, Avatar, Input, Button, message, Empty } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Contact } from "../types";
import styles from "./ContactsPage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ContactsPage: React.FC = () => {
  // 添加安全检查，防止访问undefined属性
  const storeContacts = useSelector(
    (state: RootState) => (state.contact ? state.contact.contacts : []), // 注意这里是contact而不是contacts
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.log("加载联系人数据");

    // 1. 优先使用Redux store中的数据
    if (storeContacts && storeContacts.length > 0) {
      console.log("使用Redux store中的联系人数据");
      setContacts(storeContacts);
      setLoading(false);
      return;
    }

    // 2. 尝试从localStorage加载数据
    const contactsStr = localStorage.getItem("contacts");
    if (contactsStr) {
      try {
        const contactData = JSON.parse(contactsStr);
        console.log("从localStorage加载联系人数据");
        setContacts(contactData);
      } catch (error) {
        console.error("解析联系人数据失败", error);
        // 使用默认联系人数据
        setContacts(getDefaultContacts());
      }
    } else {
      console.log("未找到联系人数据，使用默认数据");
      // 使用默认联系人数据
      setContacts(getDefaultContacts());
    }

    setLoading(false);
  }, [storeContacts]); // 监听Redux中的联系人数据变化

  // 默认联系人数据
  const getDefaultContacts = (): Contact[] => {
    return [
      {
        id: "contact1",
        userId: "user1",
        user: {
          id: "user1",
          username: "张三",
          nickname: "张三",
          phone: "13800000001",
          email: "zhangsan@example.com",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          status: "online",
        },
        remark: "技术部张三",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: "contact2",
        userId: "user2",
        user: {
          id: "user2",
          username: "李四",
          nickname: "李四",
          phone: "13800000002",
          email: "lisi@example.com",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          status: "offline",
        },
        createdAt: "2023-01-02T00:00:00.000Z",
      },
    ];
  };

  // 处理搜索功能
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }

    const results = contacts.filter(
      (contact) =>
        (contact.user.username && contact.user.username.includes(searchValue)) ||
        (contact.user.nickname && contact.user.nickname.includes(searchValue)) ||
        (contact.user.phone && contact.user.phone.includes(searchValue)) ||
        (contact.remark && contact.remark.includes(searchValue)),
    );

    setSearchResults(results);
  };

  // 显示联系人列表
  const displayContacts = searchValue.trim() ? searchResults : contacts;

  return (
    <div className={styles.contactsPage}>
      <div className={styles.header}>
        <Input
          placeholder="搜索联系人"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() => handleSearch()}
          allowClear
        />
      </div>

      <div className={styles.contactsContainer}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : displayContacts.length > 0 ? (
          <List
            dataSource={displayContacts}
            renderItem={(contact) => (
              <List.Item className={styles.contactItem}>
                <List.Item.Meta
                  avatar={<Avatar src={contact.user.avatar} icon={<UserOutlined />} />}
                  title={contact.remark || contact.user.nickname || contact.user.username}
                  description={contact.user.phone || contact.user.email}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无联系人" />
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
