import React, { useState } from "react";
import { List, Input, Avatar, Button, Modal, Form, message } from "antd";
import { UserOutlined, SearchOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./ContactsPage.module.css";

// 模拟数据
const mockContacts = [
  {
    id: "1",
    userId: "101",
    user: {
      id: "101",
      username: "张三",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "online" as const,
    },
    remark: "老张",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "102",
    user: {
      id: "102",
      username: "李四",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "offline" as const,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "103",
    user: {
      id: "103",
      username: "王五",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      status: "online" as const,
    },
    remark: "小王",
    createdAt: new Date().toISOString(),
  },
];

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(mockContacts);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 搜索联系人
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.user.username.includes(searchText) ||
      (contact.remark && contact.remark.includes(searchText)),
  );

  // 开始聊天
  const startChat = (userId: string) => {
    // 实际应用中应该创建或查找已有的聊天
    // 这里简单跳转到模拟的聊天ID
    navigate(`/chat/1`);
  };

  // 添加联系人
  const addContact = (values: { username: string }) => {
    console.log("添加联系人:", values);
    message.success(`已发送好友请求给 ${values.username}`);
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className={styles.contactsPage}>
      <div className={styles.header}>
        <Input
          placeholder="搜索联系人"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          className={styles.addButton}
        >
          添加联系人
        </Button>
      </div>

      <List
        className={styles.contactsList}
        dataSource={filteredContacts}
        renderItem={(contact) => (
          <List.Item
            className={styles.contactItem}
            actions={[
              <Button
                key="message"
                type="primary"
                shape="round"
                size="small"
                onClick={() => startChat(contact.userId)}
              >
                发消息
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={contact.user.avatar} icon={<UserOutlined />} />}
              title={
                <span>
                  {contact.remark || contact.user.username}
                  {contact.remark && (
                    <span className={styles.username}>({contact.user.username})</span>
                  )}
                </span>
              }
              description={
                <span
                  className={`${styles.status} ${
                    contact.user.status === "online" ? styles.online : styles.offline
                  }`}
                >
                  {contact.user.status === "online" ? "在线" : "离线"}
                </span>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="添加联系人"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={addContact}>
          <Form.Item
            name="username"
            label="用户名/ID"
            rules={[{ required: true, message: "请输入用户名或ID" }]}
          >
            <Input prefix={<UserAddOutlined />} placeholder="请输入用户名或ID" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              发送好友请求
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactsPage;
