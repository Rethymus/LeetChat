import axios from "axios";

interface CaptchaResponse {
  image_base64: string;
  thumb_base64: string;
  captcha_key: string;
}

interface VerifyResponse {
  result: boolean;
}

/**
 * 获取验证码
 */
export const getCaptcha = async (): Promise<CaptchaResponse | null> => {
  try {
    const response = await axios.get("/api/v1/user/get-captcha");

    if (response.data.code === 0) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("获取验证码失败:", error);
    return null;
  }
};

/**
 * 验证验证码
 */
export const verifyCaptcha = async (dots: string, captchaKey: string): Promise<boolean> => {
  try {
    const response = await axios.post("/api/v1/user/verify-captcha", {
      dots,
      captcha_key: captchaKey,
    });

    if (response.data.code === 0) {
      return response.data.data.result;
    }
    return false;
  } catch (error) {
    console.error("验证码验证失败:", error);
    return false;
  }
};
