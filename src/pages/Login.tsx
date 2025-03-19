import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Card, Typography, message, Tabs, Row, Col } from "antd";
import { LockOutlined, MobileOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";
import { userApi } from "../api/user";
import styles from "./Login.module.css";
import { useCaptcha } from "../hooks/useCaptcha";
import { useClickCaptcha } from "../hooks/useClickCaptcha";
import CaptchaVerify from "../components/common/CaptchaVerify";
import ClickCaptcha from "../components/common/ClickCaptcha";

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
  const [loginType, setLoginType] = useState<"password" | "message">("password");
  // 为两种登录类型创建不同的表单实例
  const [passwordForm] = Form.useForm();
  const [messageForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 使用当前激活的表单
  const currentForm = loginType === "password" ? passwordForm : messageForm;

  const {
    captcha,
    shouldShowCaptcha,
    isLoading,
    recordLoginFail,
    resetCaptcha,
    verifyCaptchaPoints,
  } = useCaptcha(currentForm); // 传入当前激活的表单

  const {
    loading: clickCaptchaLoading,
    captchaData: clickCaptchaData,
    dots: clickCaptchaDots,
    getCaptcha: getClickCaptcha,
    handleImageClick: handleClickCaptchaImageClick,
    verifyCapcha: verifyClickCaptcha,
    resetClickCaptcha,
  } = useClickCaptcha();

  const [clickCaptchaVerified, setClickCaptchaVerified] = useState(false);

  // 将useRef提升到组件顶层
  const shouldFetch = useRef(true);
  const initialRenderRef = useRef(true);
  const lastRequestTimeRef = useRef<number>(0);

  const shouldFetchRef = useRef(true);
  const captchaRequestedRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    resetCaptcha();
  }, [resetCaptcha]); // 添加 resetCaptcha 作为依赖项

  useEffect(() => {
    // 确保只在初始渲染和条件满足时获取验证码
    if (
      initialRenderRef.current &&
      loginType === "password" &&
      !shouldShowCaptcha &&
      !captchaRequestedRef.current
    ) {
      initialRenderRef.current = false;
      captchaRequestedRef.current = true;

      // 确保请求间隔至少5秒
      const now = Date.now();
      if (now - lastRequestTimeRef.current > 5000) {
        lastRequestTimeRef.current = now;

        // 延迟请求，避免可能的渲染冲突
        const timer = setTimeout(() => {
          getClickCaptcha();
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [loginType, shouldShowCaptcha]);

  // 替换环境变量处理方式
  const handlePasswordLogin = async (values: PasswordLoginValues & { captcha?: number[] }) => {
    try {
      setLoading(true);

      // 使用配置对象替代环境变量
      const testAccounts = {
        root: "root", // 将 'admin123' 改为 'root'
        test: "test123",
      };

      const isDev = import.meta.env.DEV || import.meta.env.MODE === "development";
      const isTestAccount =
        isDev &&
        values.phone in testAccounts &&
        values.password === testAccounts[values.phone as keyof typeof testAccounts];

      // 改进测试账号登录逻辑
      if (isTestAccount) {
        // 对于测试账号，直接模拟成功响应，无需请求后端
        const testToken = "test-token-12345";
        const testExpire = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const testRefresh = Date.now() + 24 * 60 * 60 * 1000;

        // 存储token和过期信息
        localStorage.setItem("token", testToken);
        localStorage.setItem("accessExpire", String(testExpire));
        localStorage.setItem("refreshAfter", String(testRefresh));

        // 模拟用户信息
        const testUser = {
          id: "test-001",
          username: "测试账号",
          nickname: "测试账号",
          phone: values.phone,
          email: "test@example.com",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        };

        // 添加更多必要的状态，确保路由可以正常跳转
        localStorage.setItem("user", JSON.stringify(testUser));

        // 派发登录成功action
        dispatch(
          loginSuccess({
            user: {
              id: testUser.id,
              username: testUser.username,
              phone: testUser.phone,
              email: testUser.email,
              avatar: testUser.avatar,
              nickname: testUser.nickname,
            },
            token: testToken,
          }),
        );

        message.success("测试账号登录成功");
        navigate("/chat");
        setLoading(false);
        return;
      }

      // 如果需要验证码，则先验证（但测试账号跳过验证）
      if (shouldShowCaptcha && values.captcha && !isTestAccount) {
        const captchaValid = await verifyCaptchaPoints(values.captcha);
        if (!captchaValid) {
          message.error("验证码错误，请重新验证");
          resetCaptcha();
          setLoading(false);
          return;
        }
      } else if (!isTestAccount) {
        // 使用点击式验证码逻辑
        const success = await verifyClickCaptcha();
        if (!success) {
          message.error("请先通过点击验证码验证");
          setLoading(false);
          return;
        }
        setClickCaptchaVerified(true);
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
        }),
      );

      message.success("登录成功");
      navigate("/chat");
      // 登录成功后重置失败计数
      resetCaptcha();
    } catch (error) {
      console.error("登录失败:", error);
      dispatch(loginFailure());
      // 记录登录失败，可能会触发验证码
      recordLoginFail();
      message.error("登录失败，请检查手机号和密码");
      // 登录失败时刷新验证码
      resetCaptcha();
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
        }),
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
      const phone = currentForm.getFieldValue("phone");
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
              form={passwordForm}
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
                  {
                    validator: (_, value) => {
                      if (value === "root" || /^1\d{10}$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("手机号格式不正确"));
                    },
                  },
                ]}
              >
                <Input prefix={<MobileOutlined />} placeholder="手机号" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              {/* 添加验证码 */}
              {shouldShowCaptcha && (
                <Form.Item name="captcha" rules={[{ required: true, message: "请完成验证" }]}>
                  <CaptchaVerify
                    form={passwordForm}
                    imageBase64={captcha.imageBase64}
                    thumbBase64={captcha.thumbBase64}
                    isLoading={isLoading}
                    onRefresh={resetCaptcha}
                  />
                </Form.Item>
              )}

              <Form.Item>
                {loginType === "password" && !shouldShowCaptcha && (
                  <ClickCaptcha
                    imageBase64={clickCaptchaData?.imageBase64}
                    thumbBase64={clickCaptchaData?.thumbBase64}
                    dots={clickCaptchaDots}
                    loading={clickCaptchaLoading}
                    onImageClick={handleClickCaptchaImageClick}
                    onRefresh={getClickCaptcha}
                  />
                )}
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

          <TabPane tab="验证码登录" key="message">
            <Form
              form={messageForm}
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
                  {
                    validator: (_, value) => {
                      if (value === "root" || /^1\d{10}$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("手机号格式不正确"));
                    },
                  },
                ]}
              >
                <Input prefix={<MobileOutlined />} placeholder="手机号" />
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
