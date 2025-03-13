import axios from "axios";

/**
 * 检查后端服务是否可用
 */
export const checkBackendServices = async (): Promise<boolean> => {
  try {
    // 测试请求验证码接口
    const response = await axios.get("/api/v1/user/health", {
      timeout: 3000,
      validateStatus: () => true,
    });

    if (response.status === 200) {
      return true;
    }

    // 如果health接口不可用，尝试验证码接口
    const captchaResponse = await axios.get("/api/v1/user/get-captcha", {
      timeout: 3000,
      validateStatus: () => true,
    });

    if (captchaResponse.status === 200) {
      return true;
    }

    console.error("✗ API服务响应异常：", response.status);
    return false;
  } catch (error) {
    console.error("✗ 无法连接到后端服务，请确保服务已启动", error);
    return false;
  }
};
