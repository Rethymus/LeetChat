import { useState, useEffect } from "react";
import { userApi } from "../api/user";

/**
 * 验证码Hook，管理验证码状态和逻辑
 */
export const useCaptcha = (form: any) => {
  const [loginFailCount, setLoginFailCount] = useState(0);
  const [captcha, setCaptcha] = useState<{
    imageBase64: string;
    thumbBase64: string;
    captchaKey: string;
  }>({
    imageBase64: "",
    thumbBase64: "",
    captchaKey: "",
  });

  const LOGIN_FAIL_THRESHOLD = 3; // 3次失败后显示验证码

  // 获取验证码图片
  const getCaptchaImage = async () => {
    try {
      const response = await userApi.getCaptcha();
      setCaptcha({
        imageBase64: response.imageBase64,
        thumbBase64: response.thumbBase64,
        captchaKey: response.captchaKey,
      });
    } catch (error) {
      console.error("获取验证码失败:", error);
    }
  };

  // 记录登录失败并可能触发验证码
  const recordLoginFail = () => {
    const newCount = loginFailCount + 1;
    setLoginFailCount(newCount);

    if (newCount >= LOGIN_FAIL_THRESHOLD) {
      getCaptchaImage();
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
  };

  // 是否应该显示验证码
  const shouldShowCaptcha = loginFailCount >= LOGIN_FAIL_THRESHOLD && captcha.imageBase64;

  return {
    captcha,
    loginFailCount,
    shouldShowCaptcha,
    getCaptchaImage,
    recordLoginFail,
    resetCaptcha,
    resetFailCount,
  };
};
