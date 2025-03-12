import { userApi } from "../api/user";

/**
 * 验证验证码工具函数
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

// 将useCaptcha的导入导出改为直接从hooks引入
export { useCaptcha } from "../hooks/useCaptcha";
