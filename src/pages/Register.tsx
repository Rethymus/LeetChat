import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Row, Col } from "antd";
import {
  MobileOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../api/user";
import styles from "./Register.module.css";
import { useCaptcha } from "../hooks/useCaptcha";
import CaptchaVerify from "../components/common/CaptchaVerify";
import CaptchaModal from "../components/common/CaptchaModal";

const { Title } = Typography;

interface RegisterFormValues {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  msgcode: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [captchaModalVisible, setCaptchaModalVisible] = useState(false);

  const { captcha, shouldShowCaptcha, isLoading, resetCaptcha, verifyCaptchaPoints } =
    useCaptcha(form);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegister = async (values: RegisterFormValues) => {
    // 添加验证码验证
    if (shouldShowCaptcha) {
      const captchaValid = await verifyCaptchaPoints(form.getFieldValue("captcha"));
      if (!captchaValid) return;
    }

    try {
      // 确保两次密码一致
      if (values.password !== values.confirmPassword) {
        return message.error("两次输入的密码不一致");
      }

      setLoading(true);

      // 调用注册API
      const response = await userApi.register({
        phone: values.phone,
        email: values.email,
        msgcode: values.msgcode,
        password: values.password,
      });

      // 注册成功，跳转到登录页
      message.success("注册成功，请登录");
      navigate("/login");
    } catch (error) {
      console.error("注册失败:", error);
      message.error("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 显示验证码弹窗
  const showCaptchaModal = () => {
    const phone = form.getFieldValue("phone");
    if (!phone) {
      return message.error("请输入手机号");
    }

    // 验证手机号格式
    if (!/^1\d{10}$/.test(phone)) {
      return message.error("手机号格式不正确");
    }

    setCaptchaModalVisible(true);
  };

  // 验证码成功后发送短信
  const handleCaptchaSuccess = async () => {
    setCaptchaModalVisible(false);

    try {
      const phone = form.getFieldValue("phone");
      await userApi.getMessageCode({
        msgType: "register",
        phone,
      });

      message.success("验证码发送成功");
      setCountdown(60);
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("发送验证码失败，请稍后重试");
    }
  };

  // 验证处理
  const handleVerify = async () => {
    if (dots.length < 8) {
      message.warning("请点击4个字符位置");
      return;
    }

    const success = await verifyCapcha();
    if (success) {
      message.success("验证成功");
      onSuccess();
    } else {
      message.error("验证失败，请重新尝试");
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.logo}>
          <img src="/leetchat-logo.png" alt="LeetChat Logo" />
        </div>
        <Title level={2} className={styles.title}>
          注册账号
        </Title>

        <Form
          form={form}
          name="register"
          initialValues={{ remember: true }}
          onFinish={handleRegister}
          size="large"
          className={styles.form}
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1\d{10}$/, message: "手机号格式不正确" },
            ]}
          >
            <Input prefix={<MobileOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item name="msgcode" rules={[{ required: true, message: "请输入验证码" }]}>
            <Row gutter={8}>
              <Col flex="auto">
                <Input prefix={<SafetyCertificateOutlined />} placeholder="验证码" />
              </Col>
              <Col flex="none">
                <Button onClick={showCaptchaModal} disabled={countdown > 0}>
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度不能小于6位" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          {shouldShowCaptcha && (
            <Form.Item name="captcha" rules={[{ required: true, message: "请完成验证" }]}>
              <CaptchaVerify
                form={form}
                imageBase64={captcha.imageBase64}
                thumbBase64={captcha.thumbBase64}
                isLoading={isLoading}
                onRefresh={resetCaptcha}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.registerButton}
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            已有账号？
            <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>

      {/* 验证码弹窗 */}
      <CaptchaModal
        visible={captchaModalVisible}
        onCancel={() => setCaptchaModalVisible(false)}
        onSuccess={handleCaptchaSuccess}
        title="安全验证"
      />
    </div>
  );
};

export default Register;
