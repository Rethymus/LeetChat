import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Tabs, Row, Col } from 'antd';
import { LockOutlined, MobileOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../api/user';
import styles from './Login.module.css'; // 共用登录样式

const { Title } = Typography;
const { TabPane } = Tabs;

interface PhoneFormValues {
  phone: string;
  msgcode: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailFormValues {
  email: string;
  msgcode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [resetType, setResetType] = useState<'phone' | 'email'>('phone');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 通过手机重置密码
  const handlePhoneReset = async (values: PhoneFormValues) => {
    try {
      // 确保两次密码一致
      if (values.newPassword !== values.confirmPassword) {
        return message.error('两次输入的密码不一致');
      }

      setLoading(true);
      
      // 调用修改密码API
      await userApi.changePassword({
        phone: values.phone,
        msgcode: values.msgcode,
        newPassword: values.newPassword
      });
      
      message.success('密码重置成功，请使用新密码登录');
      navigate('/login');
    } catch (error) {
      console.error('密码重置失败:', error);
      message.error('密码重置失败，请检查输入信息或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 通过邮箱重置密码
  const handleEmailReset = async (values: EmailFormValues) => {
    try {
      // 确保两次密码一致
      if (values.newPassword !== values.confirmPassword) {
        return message.error('两次输入的密码不一致');
      }

      setLoading(true);
      
      // 调用修改密码API
      await userApi.changePasswordByEmail({
        email: values.email,
        msgcode: values.msgcode,
        newPassword: values.newPassword
      });
      
      message.success('密码重置成功，请使用新密码登录');
      navigate('/login');
    } catch (error) {
      console.error('密码重置失败:', error);
      message.error('密码重置失败，请检查输入信息或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 发送短信验证码
  const handleSendPhoneCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone) {
        return message.error('请输入手机号');
      }
      
      await userApi.getMessageCode({
        msgType: 'resetPassword',
        phone
      });
      
      message.success('验证码发送成功');
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
      message.error('发送验证码失败，请稍后重试');
    }
  };

  // 发送邮箱验证码 (实际API可能不同，这里简化处理)
  const handleSendEmailCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        return message.error('请输入邮箱');
      }
      
      // 这里根据实际API调整
      await userApi.getMessageCode({
        msgType: 'resetPasswordEmail',
        phone: email // 这里可能需要调整API或创建新的API
      });
      
      message.success('验证码已发送到邮箱');
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
      message.error('发送验证码失败，请稍后重试');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.logo}>
          <img src="/leetchat-logo.png" alt="LeetChat Logo" />
        </div>
        <Title level={2} className={styles.title}>重置密码</Title>
        
        <Tabs 
          activeKey={resetType} 
          onChange={(key) => setResetType(key as 'phone' | 'email')}
          centered
        >
          <TabPane tab="手机号重置" key="phone">
            <Form
              form={form}
              name="phoneReset"
              onFinish={handlePhoneReset}
              size="large"
              className={styles.form}
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
                ]}
              >
                <Input prefix={<MobileOutlined />} placeholder="手机号" />
              </Form.Item>

              <Form.Item
                name="msgcode"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Row gutter={8}>
                  <Col flex="auto">
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="验证码"
                    />
                  </Col>
                  <Col flex="none">
                    <Button 
                      onClick={handleSendPhoneCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="新密码"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认密码' },
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
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认新密码"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  className={styles.loginButton}
                  loading={loading}
                >
                  重置密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="邮箱重置" key="email">
            <Form
              form={form}
              name="emailReset"
              onFinish={handleEmailReset}
              size="large"
              className={styles.form}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱" />
              </Form.Item>

              <Form.Item
                name="msgcode"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Row gutter={8}>
                  <Col flex="auto">
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="验证码"
                    />
                  </Col>
                  <Col flex="none">
                    <Button 
                      onClick={handleSendEmailCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="新密码"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认密码' },
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
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认新密码"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  className={styles.loginButton}
                  loading={loading}
                >
                  重置密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <div className={styles.footer}>
            <Link to="/login">返回登录</Link>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default ForgetPassword;
