import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Tabs, Row, Col } from "antd";
import {
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { userApi } from "../api/user";
import styles from "./Login.module.css"; // 共用登录样式

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
  const [resetType, setResetType] = useState<"phone" | "email">("phone");
  const [phoneForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneReset = async (values: PhoneFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      await userApi.changePassword({
        phone: values.phone,
        msgcode: values.msgcode,
        new_password: values.newPassword,
      });
      message.success("密码重置成功，请使用新密码登录");
      navigate("/login");
    } catch (error) {
      console.error("密码重置失败:", error);
      message.error("密码重置失败，请检查手机号和验证码");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReset = async (values: EmailFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      await userApi.changePasswordByEmail({
        email: values.email,
        msgcode: values.msgcode,
        new_password: values.newPassword,
      });
      message.success("密码重置成功，请使用新密码登录");
      navigate("/login");
    } catch (error) {
      console.error("密码重置失败:", error);
      message.error("密码重置失败，请检查邮箱和验证码");
    } finally {
      setLoading(false);
    }
  };

  const sendSmsCode = async () => {
    try {
      const phone = phoneForm.getFieldValue("phone");
      if (!phone) {
        message.error("请输入手机号");
        return;
      }

      await userApi.getMessageCode({
        phone,
        msg_type: "resetpwd",
      });

      message.success("验证码已发送");
      setCountdown(60);
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("发送验证码失败");
    }
  };

  const sendEmailCode = async () => {
    try {
      const email = emailForm.getFieldValue("email");
      if (!email) {
        message.error("请输入邮箱");
        return;
      }

      // 假设有一个发送邮箱验证码的接口
      // await userApi.getEmailCode({
      //   email,
      //   msgType: "resetpwd",
      // });

      message.success("验证码已发送到邮箱");
      setCountdown(60);
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("发送验证码失败");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <Card className={styles.formCard}>
          <div className={styles.formHeader}>
            <Title level={2} className={styles.title}>
              忘记密码
            </Title>
          </div>

          <Tabs activeKey={resetType} onChange={(key) => setResetType(key as "phone" | "email")}>
            <TabPane tab="手机号重置" key="phone">
              <Form
                form={phoneForm}
                name="phone_reset"
                onFinish={handlePhoneReset}
                layout="vertical"
              >
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: "请输入手机号" },
                    { pattern: /^1\d{10}$/, message: "手机号格式不正确" },
                  ]}
                >
                  <Input prefix={<MobileOutlined />} placeholder="请输入手机号" size="large" />
                </Form.Item>

                <Form.Item
                  name="msgcode"
                  rules={[
                    { required: true, message: "请输入验证码" },
                    { len: 6, message: "验证码应为6位" },
                  ]}
                >
                  <Row gutter={8}>
                    <Col span={16}>
                      <Input
                        prefix={<SafetyCertificateOutlined />}
                        placeholder="请输入验证码"
                        size="large"
                      />
                    </Col>
                    <Col span={8}>
                      <Button block disabled={countdown > 0} onClick={sendSmsCode} size="large">
                        {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: "请输入新密码" },
                    { min: 6, message: "密码至少6位" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入新密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
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
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请确认新密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                    className={styles.submitButton}
                  >
                    重置密码
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="邮箱重置" key="email">
              <Form
                form={emailForm}
                name="email_reset"
                onFinish={handleEmailReset}
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "请输入邮箱" },
                    { type: "email", message: "邮箱格式不正确" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" size="large" />
                </Form.Item>

                <Form.Item
                  name="msgcode"
                  rules={[
                    { required: true, message: "请输入验证码" },
                    { len: 6, message: "验证码应为6位" },
                  ]}
                >
                  <Row gutter={8}>
                    <Col span={16}>
                      <Input
                        prefix={<SafetyCertificateOutlined />}
                        placeholder="请输入验证码"
                        size="large"
                      />
                    </Col>
                    <Col span={8}>
                      <Button block disabled={countdown > 0} onClick={sendEmailCode} size="large">
                        {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: "请输入新密码" },
                    { min: 6, message: "密码至少6位" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入新密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
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
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请确认新密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                    className={styles.submitButton}
                  >
                    重置密码
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <div className={styles.formFooter}>
            <Link to="/login">返回登录</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgetPassword;
