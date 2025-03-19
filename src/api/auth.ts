// src/api/auth.ts
import apiClient from "./client";

export const authApi = {
  // 用户注册
  register: (data: {
    phone: string;
    email: string;
    msgcode: string;
    password: string;
    nickname?: string;
  }) => apiClient.post("/user/register", data),

  // 密码登录
  login: (data: { phone: string; password: string }) => apiClient.post("/user/login", data),

  // 短信验证码登录
  msgLogin: (data: { phone: string; msgcode: string }) => apiClient.post("/user/msg-login", data),

  // 获取短信验证码
  getMessageCode: (data: { msg_type: string; phone: string }) =>
    apiClient.post("/user/message-code", data),

  // 获取图形验证码
  getCaptcha: () => apiClient.get("/user/get-captcha"),

  // 验证图形验证码
  verifyCaptcha: (data: { dots: string; captcha_key: string }) =>
    apiClient.post("/user/verify-captcha", data),
};
