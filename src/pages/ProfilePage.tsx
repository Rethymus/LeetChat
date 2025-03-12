import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Upload,
  Card,
  Avatar,
  Modal,
  message,
  Switch,
  Divider,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  LockOutlined,
  BellOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import dayjs from "dayjs";
import styles from "./ProfilePage.module.css";

// 默认用户信息
const mockUserInfo = {
  userInfo: {
    id: 1001,
    nickname: "测试用户",
    phone: "13800000000",
    email: "test@example.com",
  },
};

// 默认用户资料
const mockUserProfile = {
  userProfile: {
    user_id: 1001,
    avatar_url: "https://randomuser.me/api/portraits/lego/1.jpg",
    birthday: Math.floor(new Date("1990-01-01").getTime() / 1000),
    gender: "male",
    location: "北京市",
  },
};

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 安全访问Redux状态
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;

  // 使用本地状态管理profile数据，而不是尝试从Redux获取
  const [profile, setProfile] = useState({
    nickname: "测试账号",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    gender: "male",
    birthday: dayjs("1990-01-01"),
    location: "北京市",
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 从localStorage加载数据
  useEffect(() => {
    // 获取用户资料
    let userData = user;

    // 如果Redux中没有数据，尝试从localStorage获取
    if (!userData) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
        } catch (e) {
          console.error("解析用户数据失败", e);
        }
      }
    }

    // 获取个人资料信息
    const profileStr = localStorage.getItem("profile");
    let profileData = null;

    if (profileStr) {
      try {
        profileData = JSON.parse(profileStr);
      } catch (e) {
        console.error("解析个人资料失败", e);
      }
    }

    // 设置表单初始值
    form.setFieldsValue({
      nickname: userData?.nickname || userData?.username || "测试用户",
      avatar: userData?.avatar
        ? [{ uid: "-1", name: "avatar.png", status: "done", url: userData.avatar }]
        : [],
      gender: profileData?.gender || "male",
      birthday: profileData?.birthday ? dayjs.unix(profileData.birthday) : undefined,
      location: profileData?.location || "北京市",
    });

    // 更新本地state
    setProfile({
      nickname: userData?.nickname || userData?.username || "测试用户",
      avatar:
        userData?.avatar ||
        profileData?.avatar_url ||
        "https://randomuser.me/api/portraits/lego/1.jpg",
      gender: profileData?.gender || "male",
      birthday: profileData?.birthday ? dayjs.unix(profileData.birthday) : dayjs("1990-01-01"),
      location: profileData?.location || "北京市",
    });

    console.log("个人资料数据加载完成");
  }, [form, user]);

  // 退出登录
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // 处理个人信息编辑
  const handleEditSubmit = (values: any) => {
    setSubmitting(true);

    setTimeout(() => {
      // 模拟API调用成功
      const updatedProfile = {
        ...profile,
        nickname: values.nickname,
        gender: values.gender,
        birthday: values.birthday,
        location: values.location,
      };

      // 更新本地状态
      setProfile(updatedProfile);

      // 更新localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          userData.nickname = values.nickname;
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (e) {
          console.error("更新用户数据失败", e);
        }
      }

      const profileData = {
        gender: values.gender,
        birthday: values.birthday.unix(),
        location: values.location,
        avatar_url: values.avatar?.[0]?.url || profile.avatar,
      };
      localStorage.setItem("profile", JSON.stringify(profileData));

      setSubmitting(false);
      setIsEditModalVisible(false);
      message.success("个人资料更新成功");
    }, 1000);
  };

  // 处理密码修改
  const handlePasswordChange = (values: any) => {
    console.log("修改密码:", values);
    message.success("密码修改成功");
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  // 头像上传
  const handleAvatarChange = (info: UploadProps["onChange"]) => {
    if (info.file.status === "done") {
      message.success("头像上传成功");
    } else if (info.file.status === "error") {
      message.error("头像上传失败");
    }
  };

  // 清除聊天记录
  const handleClearHistory = () => {
    Modal.confirm({
      title: "清空聊天记录",
      content: "确定要清空所有聊天记录吗？此操作不可恢复。",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        message.success("聊天记录已清空");
      },
    });
  };

  // 设置项目
  const settingsItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      title: "编辑个人资料",
      description: "修改你的昵称和个人信息",
      onClick: () => setIsEditModalVisible(true),
    },
    {
      key: "password",
      icon: <LockOutlined />,
      title: "修改密码",
      description: "更新你的登录密码",
      onClick: () => setIsPasswordModalVisible(true),
    },
    {
      key: "notification",
      icon: <BellOutlined />,
      title: "通知设置",
      description: "管理消息通知",
      extra: <Switch defaultChecked />,
    },
    {
      key: "clear",
      icon: <DeleteOutlined />,
      title: "清空聊天记录",
      description: "删除所有聊天历史",
      onClick: handleClearHistory,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      title: "退出登录",
      description: "退出当前账号",
      onClick: handleLogout,
    },
  ];

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar
            src={profile.avatar}
            icon={<UserOutlined />}
            size={80}
            className={styles.avatar}
          />
          <h2>{profile.nickname}</h2>
          <p>ID: {user?.id || "test-001"}</p>
        </div>
      </div>

      <Divider />

      <div className={styles.settingsSection}>
        <h3>设置</h3>
        <div className={styles.settingsList}>
          {settingsItems.map((item) => (
            <Card key={item.key} className={styles.settingItem} onClick={item.onClick}>
              <div className={styles.settingContent}>
                <div className={styles.settingIcon}>{item.icon}</div>
                <div className={styles.settingInfo}>
                  <div className={styles.settingTitle}>{item.title}</div>
                  <div className={styles.settingDesc}>{item.description}</div>
                </div>
                {item.extra && <div className={styles.settingExtra}>{item.extra}</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title="编辑个人资料"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: "请输入昵称" }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="头像"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList || [];
            }}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className={styles.avatarUploader}
              showUploadList={true}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              maxCount={1}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="gender" label="性别" initialValue="male">
            <Radio.Group>
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="birthday" label="生日">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="location" label="地区">
            <Input placeholder="请输入地区" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: "请输入当前密码" }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: "请输入新密码" }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
