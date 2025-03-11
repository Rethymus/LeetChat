import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Divider, 
  List, 
  Button, 
  Form,
  Input, 
  Modal,
  Switch,
  Upload,
  message 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  BellOutlined, 
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './ProfilePage.module.css';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 退出登录
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 处理个人信息编辑
  const handleEditSubmit = async (values: any) => {
    try {
      // 更新用户昵称
      await userApi.updateUserName({
        nickname: values.nickname
      });
      
      // 更新其他资料信息
      await userApi.updateUserProfile({
        avatar_url: user.avatar || '', 
        birthday: values.birthday || Date.now(),
        gender: values.gender || 'male',
        location: values.location || ''
      });
      
      message.success('个人信息更新成功');
      setIsEditModalVisible(false);
      
      // 刷新用户信息
      const userInfoResponse = await userApi.getUserInfo();
      const profileResponse = await userApi.getUserProfile();
      // 更新Redux store...
    } catch (error) {
      console.error('更新个人信息失败:', error);
      message.error('更新失败，请稍后重试');
    }
  };

  // 处理密码修改
  const handlePasswordChange = (values: any) => {
    console.log('修改密码:', values);
    message.success('密码修改成功');
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  // 头像上传
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  // 清除聊天记录
  const handleClearHistory = () => {
    Modal.confirm({
      title: '清空聊天记录',
      content: '确定要清空所有聊天记录吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('聊天记录已清空');
      }
    });
  };

  // 在getUserInfo后添加获取用户资料的逻辑
  const handleGetUserProfile = async () => {
    try {
      // 获取用户的详细资料
      const profileResponse = await userApi.getUserProfile();
      
      // 更新Redux中的用户信息，增加头像等信息
      dispatch(updateUserProfile({
        avatar: profileResponse.userProfile.avatar_url,
        gender: profileResponse.userProfile.gender,
        birthday: profileResponse.userProfile.birthday,
        location: profileResponse.userProfile.location
      }));
    } catch (error) {
      console.error('获取用户资料失败:', error);
    }
  };

  const settingsItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      title: '编辑个人资料',
      description: '修改你的昵称和个人信息',
      onClick: () => setIsEditModalVisible(true),
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      title: '修改密码',
      description: '更新你的登录密码',
      onClick: () => setIsPasswordModalVisible(true),
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      title: '通知设置',
      description: '管理消息通知',
      extra: <Switch defaultChecked />,
    },
    {
      key: 'clear',
      icon: <DeleteOutlined />,
      title: '清空聊天记录',
      description: '删除所有聊天历史',
      onClick: handleClearHistory,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      title: '退出登录',
      description: '退出当前账号',
      onClick: handleLogout,
      danger: true,
    }
  ];

  if (!user) {
    return <div className={styles.loading}>加载中...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <Card className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <Upload
            name="avatar"
            showUploadList={false}
            action="/api/upload/avatar"
            onChange={handleAvatarChange}
          >
            <div className={styles.avatarWrapper}>
              <Avatar 
                size={100} 
                src={user.avatar} 
                icon={<UserOutlined />} 
              />
              <div className={styles.uploadOverlay}>
                <UploadOutlined />
              </div>
            </div>
          </Upload>
          <Title level={4}>{user.nickname || user.username}</Title>
          <Text type="secondary">@{user.username}</Text>
        </div>

        <Divider />

        <List
          className={styles.settingsList}
          itemLayout="horizontal"
          dataSource={settingsItems}
          renderItem={item => (
            <List.Item
              className={`${styles.settingsItem} ${item.danger ? styles.dangerItem : ''}`}
              onClick={item.onClick}
              actions={item.extra ? [item.extra] : undefined}
            >
              <List.Item.Meta
                avatar={<div className={styles.iconWrapper}>{item.icon}</div>}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 编辑个人资料弹窗 */}
      <Modal
        title="编辑个人资料"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            nickname: user.nickname || '',
            status: user.status || 'online'
          }}
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ max: 20, message: '昵称不能超过20个字符' }]}
          >
            <Input placeholder="设置你的昵称" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
          >
            <Input placeholder="设置你的状态" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="输入当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password placeholder="输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              更新密码
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;