import axios from "axios";
import { message } from "antd";

// 配置axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000,
});

// 请求拦截器添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMsg = "请求失败，请稍后重试";
    if (error.response) {
      if (error.response.status === 401) {
        // 清除用户信息并跳转到登录页
        localStorage.removeItem("token");
        window.location.href = "/login";
        errorMsg = "登录已过期，请重新登录";
      } else {
        errorMsg = error.response.data?.message || errorMsg;
      }
    }
    message.error(errorMsg);
    return Promise.reject(error);
  },
);

// 定义API接口类型
export interface LoginParams {
  phone: string;
  password: string;
}

export interface MessageLoginParams {
  phone: string;
  msgcode: string;
}

export interface RegisterParams {
  phone: string;
  email: string;
  password: string;
  msgcode: string;
  nickname?: string;
}

export interface MessageCodeParams {
  msg_type: string;
  phone: string;
}

export interface ChangePasswordParams {
  phone: string;
  msgcode: string;
  new_password: string;
}

export interface ChangePasswordByEmailParams {
  email: string;
  msgcode: string;
  new_password: string;
}

export interface UpdateProfileParams {
  avatar_url: string;
  birthday: number;
  gender: "male" | "female";
  location: string;
}

export interface UpdateUserNameParams {
  nickname: string;
}

// 用户API
export const userApi = {
  // 获取用户信息
  getUserInfo: () => axios.get("/api/v1/user/info"),

  // 登录
  login: (data: LoginParams) => axios.post("/api/v1/user/login", data),

  // 短信登录
  msgLogin: (data: MessageLoginParams) => axios.post("/api/v1/user/msg-login", data),

  // 注册
  register: (data: RegisterParams) => axios.post("/api/v1/user/register", data),

  // 获取短信验证码
  getMessageCode: (data: MessageCodeParams) => axios.post("/api/v1/user/message-code", data),

  // 获取用户资料
  getUserProfile: () => axios.get("/api/v1/user/profile"),

  // 更新用户资料
  updateUserProfile: (data: UpdateProfileParams) => axios.post("/api/v1/user/update-profile", data),

  // 更新用户名
  updateUserName: (data: UpdateUserNameParams) => axios.post("/api/v1/user/update-name", data),

  // 修改密码
  changePassword: (data: ChangePasswordParams) => axios.post("/api/v1/user/change-password", data),

  // 通过邮箱修改密码
  changePasswordByEmail: (data: ChangePasswordByEmailParams) =>
    axios.post("/api/v1/user/change-password-by-email", data),

  // 获取在线用户列表
  getOnlineUsers: () => axios.get("/api/v1/user/online-users"),
};
