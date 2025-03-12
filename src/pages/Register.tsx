import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice";
import { userApi } from "../api/user";
import styles from "./Login.module.css"; // 共用登录样式
import { useCaptcha } from "../hooks/useCaptcha";
import CaptchaVerify from "../components/common/CaptchaVerify";

const { Title } = Typography;

interface RegisterFormValues {
  phone: string;
  email: string;
  msgcode: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
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
        nickname: values.nickname,
      });

      // 存储token和过期信息
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("accessExpire", String(response.accessExpire));
      localStorage.setItem("refreshAfter", String(response.refreshAfter));

      // 获取用户信息
      const userInfoResponse = await userApi.getUserInfo();
      const userInfo = userInfoResponse.userInfo;

      dispatch(
        loginSuccess({
          user: {
            id: String(userInfo.id),
            username: userInfo.nickname,
            phone: userInfo.phone,
            email: userInfo.email,
            avatar: "", // 初始化空头像，后续获取Profile可更新
          },
          token: response.accessToken,
        }),
      );

      message.success("注册成功，已自动登录");
      navigate("/chat");
    } catch (error) {
      console.error("注册失败:", error);
      message.error("注册失败，请检查输入信息或稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 发送短信验证码
  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue("phone");
      if (!phone) {
        return message.error("请输入手机号");
      }

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
                <Button onClick={handleSendCode} disabled={countdown > 0}>
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="nickname" rules={[{ required: false, message: "请输入昵称" }]}>
            <Input prefix={<UserOutlined />} placeholder="昵称（选填）" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6个字符" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
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
              className={styles.loginButton}
              loading={loading}
            >
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
