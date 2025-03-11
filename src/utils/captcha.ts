import { userApi } from "../api/user";
import { useState } from "react";

/**
 * 验证验证码
 * @param dots 用户点击的坐标数组
 * @param captchaKey 验证码的唯一标识
 * @returns 验证结果
 */
export const verifyCaptcha = async (
  dots: number[],
  captchaKey: string
): Promise<boolean> => {
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
const useCaptcha = () => {
  const [loginFailCount, setLoginFailCount] = useState(0);
  const LOGIN_FAIL_THRESHOLD = 3; // 3次失败后显示验证码

  // 在登录失败处理中
  if (loginFailCount >= LOGIN_FAIL_THRESHOLD) {
    getCaptchaImage();
  }
  setLoginFailCount((prev) => prev + 1);

  // 条件渲染验证码
  return loginFailCount >= LOGIN_FAIL_THRESHOLD && captcha.imageBase64 ? (
    <Form.Item
      name="captcha"
      rules={[{ required: true, message: "请完成验证" }]}
    >
      <CaptchaVerify form={form} />
    </Form.Item>
  ) : null;
};

export default useCaptcha;
