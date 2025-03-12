import { useState, useCallback } from "react";
import { FormInstance, message } from "antd";
import { userApi } from "../api/user";

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

  const LOGIN_FAIL_THRESHOLD = 3; // 3次失败后显示验证码

  // 使用 useCallback 包装函数，正确设置依赖项
  const getCaptchaImage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getCaptcha();
      setCaptcha({
        imageBase64: response.imageBase64,
        thumbBase64: response.thumbBase64,
        captchaKey: response.captchaKey,
      });
    } catch (error) {
      console.error("获取验证码失败:", error);
      message.error("获取验证码失败，请重试");
    } finally {
      setIsLoading(false);
    }
  }, []); // 无外部依赖

  // 使用 useCallback 包装其他函数，设置正确的依赖项
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

      const result = await userApi.verifyCaptcha({
        dots: points,
        captchaKey: captcha.captchaKey,
      });

      if (!result.result) {
        message.error("验证失败，请重新验证");
        resetCaptcha();
      } else {
        setVerifyAttempts(0); // 成功后重置尝试次数
      }

      return result.result;
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
