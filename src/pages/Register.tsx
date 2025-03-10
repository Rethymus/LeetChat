import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css'; // 共用登录页面的样式

const { Title } = Typography;

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      
      // 确保密码一致
      if (values.password !== values.confirmPassword) {
        message.error('两次输入的密码不一致！');
        return;
      }
      
      // 实际应用中，这里应该调用后端API
      const response = await axios.post('/api/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      if (response.data.success) {
        message.success('注册成功！请登录');
        navigate('/login');
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请稍后再试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.logo}>
          <img src="/leetchat-logo.png" alt="LeetChat Logo" />
        </div>
        <Title level={2} className={styles.title}>注册账号</Title>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          className={styles.form}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className={styles.loginButton}>
              注册
            </Button>
          </Form.Item>
          
          <div className={styles.footer}>
            <Link to="/login">返回登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;