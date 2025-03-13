import axios from "axios";

// 记录最近的请求时间
const recentRequests = new Map<string, number>();
// 最小请求间隔 (毫秒)
const MIN_REQUEST_INTERVAL = 3000;

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 为验证码相关请求添加防抖保护
    if (config.url?.includes("captcha")) {
      const requestKey = `${config.method}-${config.url}`;
      const now = Date.now();
      const lastRequestTime = recentRequests.get(requestKey) || 0;

      // 如果请求过于频繁，取消请求
      if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        // 取消请求
        config.cancelToken = new axios.CancelToken((cancel) =>
          cancel(`请求过于频繁: ${requestKey}`),
        );
      } else {
        // 记录本次请求时间
        recentRequests.set(requestKey, now);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
