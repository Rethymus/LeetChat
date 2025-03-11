import { userApi } from "../api/user";
import { useState } from "react";
import { Form } from "antd";
import CaptchaVerify from "../components/common/CaptchaVerify";

/**
 * 验证验证码
 * @param dots 用户点击的坐标数组
 * @param captchaKey 验证码的唯一标识
 * @returns 验证结果
 */
export const verifyCaptcha = async (dots: number[], captchaKey: string): Promise<boolean> => {
  try {
    if (!dots?.length || !captchaKey) {
      return false;
    }

    const result = await userApi.verifyCaptcha({
      dots,
      captchaKey,
    });

    return result.result;
  } catch (error) {
    console.error("验证码验证失败:", error);
    return false;
  }
};

const useCaptcha = (form) => {
  const [loginFailCount, setLoginFailCount] = useState(0);
  const [captcha, setCaptcha] = useState({ imageBase64: "", thumbBase64: "", captchaKey: "" });
  const LOGIN_FAIL_THRESHOLD = 3;

  const getCaptchaImage = async () => {
    try {
      const result = await userApi.getCaptcha();
      setCaptcha(result);
    } catch (error) {
      console.error("获取验证码失败:", error);
    }
  };

  const handleLoginFail = () => {
    setLoginFailCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= LOGIN_FAIL_THRESHOLD) {
        getCaptchaImage();
      }
      return newCount;
    });
  };

  // 条件渲染验证码
  const captchaComponent =
    loginFailCount >= LOGIN_FAIL_THRESHOLD && captcha.imageBase64 ? (
      <Form.Item name="captcha" rules={[{ required: true, message: "请完成验证" }]}>
        <CaptchaVerify form={form} captchaData={captcha} />
      </Form.Item>
    ) : null;

  return {
    captchaComponent,
    handleLoginFail,
    captchaData: captcha,
    resetCaptcha: () => setCaptcha({ imageBase64: "", thumbBase64: "", captchaKey: "" }),
    loginFailCount,
  };
};

export default useCaptcha;
