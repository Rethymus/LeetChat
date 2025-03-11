import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// 创建一个新的 mock 适配器实例
const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

// 模拟的测试用户数据
const testUser = {
  id: "test-001",
  username: "测试账号",
  nickname: "测试账号",
  phone: "root",
  email: "test@example.com",
  avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
};

// 拦截密码登录请求 - 修改路径
mock.onPost("/user/login").reply((config) => {
  console.log("Mock 拦截到登录请求");
  const data = JSON.parse(config.data);

  // 检查是否是测试账号
  if (data.phone === "root" && data.password === "root") {
    console.log("测试账号登录成功");
    return [
      200,
      {
        accessToken: "test-token-12345",
        accessExpire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        refreshAfter: Date.now() + 24 * 60 * 60 * 1000,
        userInfo: testUser,
      },
    ];
  }

  // 不是测试账号，继续原有流程
  return [404, { message: "未找到用户" }];
});

// 拦截验证码登录请求 - 修改路径
mock.onPost("/user/msg-login").reply((config) => {
  const data = JSON.parse(config.data);

  // 对于root账号，任何验证码都有效
  if (data.phone === "root") {
    console.log("测试账号验证码登录成功");
    return [
      200,
      {
        accessToken: "test-token-12345",
        accessExpire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        refreshAfter: Date.now() + 24 * 60 * 60 * 1000,
        userInfo: testUser,
      },
    ];
  }

  return [404, { message: "验证码错误" }];
});

// 拦截用户信息请求 - 修改路径
mock.onGet("/user/info").reply((config) => {
  console.log("Mock 拦截到用户信息请求");
  // 检查是否是测试账号的 token
  const token = config.headers?.Authorization;
  if (token?.includes("test-token") || localStorage.getItem("token") === "test-token-12345") {
    return [200, { userInfo: testUser }];
  }

  // 不是测试账号，继续原有流程
  return [401, { message: "未授权" }];
});

export default mock;
