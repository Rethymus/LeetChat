import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Tabs,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { userApi } from "../api/user";
import styles from "./Login.module.css";
import { useCaptcha } from "../hooks/useCaptcha";
import CaptchaVerify from "../components/common/CaptchaVerify";

const { Title } = Typography;
const { TabPane } = Tabs;

interface PasswordLoginValues {
  phone: string;
  password: string;
  captcha: number[];
}

interface MessageLoginValues {
  phone: string;
  msgcode: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginType, setLoginType] = useState<"password" | "message">(
    "password"
  );
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    captcha,
    shouldShowCaptcha,
    getCaptchaImage,
    recordLoginFail,
    resetFailCount,
  } = useCaptcha(form);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    getCaptchaImage();
  }, []);

  // 修改密码登录处理函数
  const handlePasswordLogin = async (
    values: PasswordLoginValues & { captcha?: number[] }
  ) => {
    try {
      setLoading(true);

      // 如果需要验证码，则先验证
      if (shouldShowCaptcha && values.captcha) {
        const verifyResult = await userApi.verifyCaptcha({
          dots: values.captcha,
          captchaKey: captcha.captchaKey,
        });

        if (!verifyResult.result) {
          message.error("验证码错误，请重新验证");
          getCaptchaImage();
          setLoading(false);
          return;
        }
      }

      dispatch(loginStart());

      // 后续登录逻辑保持不变...
      const response = await userApi.login(values);

      // 存储token和过期信息
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("accessExpire", String(response.accessExpire));
      localStorage.setItem("refreshAfter", String(response.refreshAfter));

      // 获取用户信息
      const userInfoResponse = await userApi.getUserInfo();

      // 根据API返回结构调整
      dispatch(
        loginSuccess({
          user: {
            id: String(userInfoResponse.userInfo.id),
            username: userInfoResponse.userInfo.nickname,
            phone: userInfoResponse.userInfo.phone,
            email: userInfoResponse.userInfo.email,
            avatar: "", // 初始化空头像，后续获取Profile可更新
          },
          token: response.accessToken,
        })
      );

      message.success("登录成功");
      navigate("/chat");
      // 登录成功后重置失败计数
      resetFailCount();
    } catch (error) {
      console.error("登录失败:", error);
      dispatch(loginFailure());
      // 记录登录失败，可能会触发验证码
      recordLoginFail();
      message.error("登录失败，请检查手机号和密码");
      // 登录失败时刷新验证码
      getCaptchaImage();
    } finally {
      setLoading(false);
    }
  };

  // 短信登录处理
  const handleMessageLogin = async (values: MessageLoginValues) => {
    try {
      setLoading(true);
      dispatch(loginStart());

      const response = await userApi.msgLogin(values);

      // 存储token和过期信息
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("accessExpire", String(response.accessExpire));
      localStorage.setItem("refreshAfter", String(response.refreshAfter));

      // 获取用户信息
      const userInfoResponse = await userApi.getUserInfo();

      dispatch(
        loginSuccess({
          user: {
            id: String(userInfoResponse.userInfo.id),
            username: userInfoResponse.userInfo.nickname,
            phone: userInfoResponse.userInfo.phone,
            email: userInfoResponse.userInfo.email,
            avatar: "", // 初始化空头像，后续获取Profile可更新
          },
          token: response.accessToken,
        })
      );

      message.success("登录成功");
      navigate("/chat");
    } catch (error) {
      console.error("登录失败:", error);
      dispatch(loginFailure());
      message.error("登录失败，请检查手机号和验证码");
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
        msgType: "login",
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
          LeetChat
        </Title>

        <Tabs
          activeKey={loginType}
          onChange={(key) => setLoginType(key as "password" | "message")}
          centered
        >
          <TabPane tab="密码登录" key="password">
            <Form
              form={form}
              name="passwordLogin"
              initialValues={{ remember: true }}
              onFinish={handlePasswordLogin}
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
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              {/* 添加验证码 */}
              {shouldShowCaptcha && (
                <Form.Item
                  name="captcha"
                  rules={[{ required: true, message: "请完成验证" }]}
                >
                  <CaptchaVerify
                    form={form}
                    imageBase64={captcha.imageBase64}
                    captchaKey={captcha.captchaKey}
                    onRefresh={getCaptchaImage}
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
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="验证码登录" key="message">
            <Form
              form={form}
              name="messageLogin"
              initialValues={{ remember: true }}
              onFinish={handleMessageLogin}
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
                name="msgcode"
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <Row gutter={8}>
                  <Col flex="auto">
                    <Input
                      prefix={<SafetyCertificateOutlined />}
                      placeholder="验证码"
                    />
                  </Col>
                  <Col flex="none">
                    <Button onClick={handleSendCode} disabled={countdown > 0}>
                      {countdown > 0 ? `${countdown}s` : "获取验证码"}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className={styles.loginButton}
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <div className={styles.footer}>
          <Link to="/register">注册新账号</Link>
          <Link to="/forget-password" style={{ float: "right" }}>
            忘记密码?
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
