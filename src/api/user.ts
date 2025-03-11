import axios from 'axios';
import { message } from 'antd';

// 配置axios实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// 请求拦截器添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMsg = '请求失败，请稍后重试';
    if (error.response) {
      if (error.response.status === 401) {
        // 清除用户信息并跳转到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
        errorMsg = '登录已过期，请重新登录';
      } else {
        errorMsg = error.response.data?.message || errorMsg;
      }
    }
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

// 用户认证相关API，根据Swagger文档调整
export const userApi = {
  // 获取图形验证码
  getCaptcha: () => 
    api.get('/user/get-captcha'),
  
  // 验证图形验证码
  verifyCaptcha: (data: { dots: number[], captchaKey: string }) => 
    api.post('/user/verify-captcha', data),
  
  // 获取短信验证码
  getMessageCode: (data: { msgType: string, phone: string }) => 
    api.post('/user/message-code', data),
  
  // 密码登录
  login: (data: { phone: string, password: string }) => 
    api.post('/user/login', data),
  
  // 短信登录
  msgLogin: (data: { phone: string, msgcode: string }) => 
    api.post('/user/msg-login', data),
  
  // 用户注册
  register: (data: { phone: string, email: string, msgcode: string, password: string, nickname?: string }) => 
    api.post('/user/register', data),
  
  // 获取用户信息
  getUserInfo: () => 
    api.get('/user/info'),
  
  // 获取用户资料
  getUserProfile: () => 
    api.get('/user/profile'),
  
  // 修改密码 (通过手机号)
  changePassword: (data: { phone: string, msgcode: string, newPassword: string }) => 
    api.post('/user/change-password', data),
  
  // 修改密码 (通过邮箱)
  changePasswordByEmail: (data: { email: string, msgcode: string, newPassword: string }) => 
    api.post('/user/change-password-by-email', data),
  
  // 更新用户昵称
  updateUserName: (data: { nickname: string }) => 
    api.post('/user/update-name', data),
  
  // 更新用户资料
  updateUserProfile: (data: { 
    avatar_url: string, 
    birthday: number, 
    gender: 'male' | 'female', 
    location: string 
  }) => 
    api.post('/user/update-profile', data),
  
  // 获取在线用户列表
  getOnlineUsers: () => 
    api.get('/user/online-users'),
};