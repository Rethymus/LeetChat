import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { message } from "antd";

interface CaptchaData {
  imageBase64: string;
  thumbBase64: string;
  captchaKey: string;
}

// 在 useClickCaptcha hook 中添加更强的防抖和缓存机制

export const useClickCaptcha = () => {
  const [loading, setLoading] = useState(false);
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [dots, setDots] = useState<number[]>([]);
  const [verifying, setVerifying] = useState(false);

  // 防抖控制，增加到5秒，避免过于频繁的请求
  const requestTimeRef = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 5000; // 5秒内不重复请求

  // 请求状态跟踪，避免并发请求
  const isRequestingRef = useRef<boolean>(false);
  // 缓存标记
  const hasCachedDataRef = useRef<boolean>(false);

  // 获取验证码 - 优化后的版本
  const getCaptcha = useCallback(async () => {
    // 如果正在请求或已有数据，直接返回
    if (isRequestingRef.current) {
      return false;
    }

    if (hasCachedDataRef.current && captchaData) {
      return true;
    }

    // 检查请求间隔
    const now = Date.now();
    if (now - requestTimeRef.current < MIN_REQUEST_INTERVAL) {
      return false;
    }

    try {
      // 设置请求状态标记
      isRequestingRef.current = true;
      requestTimeRef.current = now;
      setLoading(true);

      const response = await axios.get("/api/v1/user/get-captcha");

      if (response.data.code === 0) {
        const { image_base64, thumb_base64, captcha_key } = response.data.data;

        if (!image_base64 || !thumb_base64 || !captcha_key) {
          return false;
        }

        // 确保Base64前缀存在
        const formatBase64 = (base64: string) => {
          if (!base64) return "";
          if (base64.startsWith("data:image")) {
            return base64;
          }
          return `data:image/png;base64,${base64}`;
        };

        setCaptchaData({
          imageBase64: formatBase64(image_base64),
          thumbBase64: formatBase64(thumb_base64),
          captchaKey: captcha_key,
        });

        hasCachedDataRef.current = true;
        return true;
      }
    } catch (error) {
      console.error("获取验证码失败:", error);
    } finally {
      setLoading(false);
      // 延迟一段时间后再允许下一次请求
      setTimeout(() => {
        isRequestingRef.current = false;
      }, 1000);
    }

    return false;
  }, []); // 不依赖任何状态，避免循环依赖

  // 处理图片点击
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      // 最多记录4个点
      if (dots.length >= 8) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      setDots([...dots, x, y]);
    },
    [dots],
  );

  // 验证验证码
  const verifyCapcha = useCallback(async () => {
    if (!captchaData || dots.length < 8) return false;

    setVerifying(true);
    try {
      const response = await axios.post("/api/v1/user/verify-captcha", {
        dots: dots.join(","),
        captcha_key: captchaData.captchaKey,
      });

      if (response.data.code === 0 && response.data.data.result) {
        return true;
      }

      // 验证失败，重新获取验证码
      await getCaptcha();
      return false;
    } catch (error) {
      console.error("验证码验证请求失败:", error);
      return false;
    } finally {
      setVerifying(false);
    }
  }, [captchaData, dots, getCaptcha]);

  // 重置验证码状态
  const resetClickCaptcha = useCallback(() => {
    hasCachedDataRef.current = false;
    setDots([]);
    setCaptchaData(null);
  }, []);

  return {
    loading,
    verifying,
    captchaData,
    dots,
    getCaptcha,
    handleImageClick,
    verifyCapcha,
    resetClickCaptcha,
  };
};
