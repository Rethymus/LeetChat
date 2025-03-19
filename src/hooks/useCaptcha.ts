import { useState, useCallback, useRef } from "react";
import { FormInstance, message } from "antd";
import axios from "axios";

// 定义类型
interface CaptchaData {
  imageBase64: string;
  thumbBase64: string;
  captchaKey: string;
}

/**
 * 验证码Hook，管理验证码状态和逻辑
 */
export const useCaptcha = (form: FormInstance) => {
  const [loginFailCount, setLoginFailCount] = useState(0);
  const [captcha, setCaptcha] = useState<CaptchaData>({
    imageBase64: "",
    thumbBase64: "",
    captchaKey: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  // 请求控制
  const requestTimeRef = useRef<number>(0);
  const isRequestingRef = useRef<boolean>(false);
  const MIN_REQUEST_INTERVAL = 5000;

  const LOGIN_FAIL_THRESHOLD = 3; // 3次失败后显示验证码

  // 获取验证码
  const getCaptchaImage = useCallback(async () => {
    // 防止重复请求
    if (isRequestingRef.current) return;

    // 检查请求间隔
    const now = Date.now();
    if (now - requestTimeRef.current < MIN_REQUEST_INTERVAL) {
      return;
    }

    try {
      isRequestingRef.current = true;
      requestTimeRef.current = now;
      setIsLoading(true);

      const response = await axios.get("/api/v1/user/get-captcha");

      if (response.data.code === 0) {
        // 使用正确的snake_case字段名，与API匹配
        const { image_base64, thumb_base64, captcha_key } = response.data.data;

        const formatBase64 = (base64: string) => {
          if (!base64) return "";
          if (base64.startsWith("data:image")) {
            return base64;
          }
          return `data:image/png;base64,${base64}`;
        };

        setCaptcha({
          imageBase64: formatBase64(image_base64),
          thumbBase64: formatBase64(thumb_base64),
          captchaKey: captcha_key,
        });
      } else {
        console.error("获取验证码失败:", response.data.msg);
        message.error("获取验证码失败，请重试");
      }
    } catch (error) {
      console.error("获取验证码失败:", error);
      message.error("获取验证码失败，请重试");
    } finally {
      setIsLoading(false);
      // 延迟解除请求标记
      setTimeout(() => {
        isRequestingRef.current = false;
      }, 1000);
    }
  }, []);

  // 记录登录失败
  const recordLoginFail = useCallback(() => {
    setLoginFailCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= LOGIN_FAIL_THRESHOLD) {
        getCaptchaImage();
      }
      return newCount;
    });
  }, [getCaptchaImage]);

  // 验证码验证
  const verifyCaptchaPoints = async (points: number[]): Promise<boolean> => {
    if (!points?.length || !captcha.captchaKey) return false;

    // 添加验证次数限制
    if (verifyAttempts >= 5) {
      message.error("验证次数过多，请稍后再试");
      setTimeout(() => {
        setVerifyAttempts(0);
        resetCaptcha();
      }, 30000); // 30秒后重置
      return false;
    }

    try {
      setIsLoading(true);
      setVerifyAttempts((prev) => prev + 1);

      // 使用正确的snake_case字段名，与API匹配
      const result = await axios.post("/api/v1/user/verify-captcha", {
        dots: points.join(","),
        captcha_key: captcha.captchaKey,
      });

      if (result.data.code === 0 && result.data.data.result) {
        setVerifyAttempts(0);
        return true;
      } else {
        message.error("验证失败，请重新验证");
        resetCaptcha();
        return false;
      }
    } catch (error) {
      console.error("验证码验证失败:", error);
      message.error("验证失败，请稍后再试");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 重置验证码状态
  const resetCaptcha = () => {
    form.setFieldsValue({ captcha: [] });
    getCaptchaImage();
  };

  // 重置失败计数
  const resetFailCount = () => {
    setLoginFailCount(0);
    form.setFieldsValue({ captcha: [] });
    setCaptcha({
      imageBase64: "",
      thumbBase64: "",
      captchaKey: "",
    });
  };

  // 是否应该显示验证码
  const shouldShowCaptcha = loginFailCount >= LOGIN_FAIL_THRESHOLD && captcha.imageBase64;

  return {
    captcha,
    loginFailCount,
    shouldShowCaptcha,
    isLoading,
    getCaptchaImage,
    recordLoginFail,
    resetCaptcha,
    resetFailCount,
    verifyCaptchaPoints,
  };
};
