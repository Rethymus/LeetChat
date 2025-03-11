import React, { useState } from "react";
import { Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./CaptchaVerify.module.css";

interface CaptchaVerifyProps {
  form: any;
  captchaData?: {
    imageBase64: string;
    thumbBase64: string;
    captchaKey: string;
  };
  onRefresh: () => void;
  fieldName?: string;
}

// 组件内部处理两种传参方式
const CaptchaVerify: React.FC<CaptchaVerifyProps> = ({
  form,
  imageBase64,
  captchaKey,
  captchaData,
  onRefresh,
  fieldName = "captcha",
}) => {
  // 确保数据一致
  const imgBase64 = imageBase64 || captchaData?.imageBase64 || "";
  const key = captchaKey || captchaData?.captchaKey || "";

  const [captchaLoading, setCaptchaLoading] = useState(false);

  const handleCaptchaClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const currentDots = form.getFieldValue(fieldName) || [];
    form.setFieldsValue({
      [fieldName]: [...currentDots, x, y],
    });
  };

  const resetCaptcha = () => {
    onRefresh();
    form.setFieldsValue({ [fieldName]: [] });
  };

  const handleMarkClick = (index: number) => {
    const currentDots = [...form.getFieldValue(fieldName)];
    // 移除对应的x,y坐标
    currentDots.splice(index * 2, 2);
    form.setFieldsValue({ [fieldName]: currentDots });
  };

  return (
    <div className={styles.captchaContainer}>
      <div className={styles.captchaImage}>
        {captchaLoading ? (
          <div className={styles.captchaLoading}>
            <Spin tip="验证码加载中..." />
          </div>
        ) : (
          <img
            src={`data:image/png;base64,${imgBase64}`}
            alt="验证码"
            onClick={handleCaptchaClick}
          />
        )}
        {form.getFieldValue(fieldName)?.length > 0 && (
          <div className={styles.captchaMarks}>
            {Array.from({
              length: Math.floor(form.getFieldValue(fieldName).length / 2),
            }).map((_, i) => (
              <span
                key={i}
                className={styles.captchaMark}
                onClick={() => handleMarkClick(i)}
                style={{
                  left: form.getFieldValue(fieldName)[i * 2],
                  top: form.getFieldValue(fieldName)[i * 2 + 1],
                }}
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
      <Button icon={<ReloadOutlined />} onClick={resetCaptcha} className={styles.refreshCaptcha}>
        刷新验证码
      </Button>

      {/* 用于存储captchaKey，以便在提交时可以传递给后端 */}
      <input type="hidden" id={`${fieldName}-key`} value={key} />
    </div>
  );
};

export default CaptchaVerify;
