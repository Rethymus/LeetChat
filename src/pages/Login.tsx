import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import styles from './Login.module.css';

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: LoginFormValues) => {
    try {
      dispatch(loginStart());
      
      // 实际项目中应该调用API进行登录
      // 这里使用模拟数据
      setTimeout(() => {
        const mockUser = {
          id: '1',
          username: values.username,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        const mockToken = 'mock-jwt-token-' + Math.random();
        
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        message.success('登录成功');
        navigate('/chat');
      }, 1000);
    } catch (error) {
      dispatch(loginFailure());
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.logo}>
          <img src="/leetchat-logo.png" alt="LeetChat Logo" />
        </div>
        <Title level={2} className={styles.title}>LeetChat</Title>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          className={styles.form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className={styles.loginButton}>
              登录
            </Button>
          </Form.Item>
          
          <div className={styles.footer}>
            <Link to="/register">注册新账号</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;