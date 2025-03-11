import React from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./CaptchaVerify.module.css";

interface CaptchaVerifyProps {
  form: any;
  imageBase64: string;
  captchaKey: string;
  onRefresh: () => void;
  fieldName?: string;
}

const CaptchaVerify: React.FC<CaptchaVerifyProps> = ({
  form,
  imageBase64,
  captchaKey,
  onRefresh,
  fieldName = "captcha",
}) => {
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

  return (
    <div className={styles.captchaContainer}>
      <div className={styles.captchaImage}>
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt="验证码"
          onClick={handleCaptchaClick}
        />
        {form.getFieldValue(fieldName)?.length > 0 && (
          <div className={styles.captchaMarks}>
            {Array.from({
              length: Math.floor(form.getFieldValue(fieldName).length / 2),
            }).map((_, i) => (
              <span
                key={i}
                className={styles.captchaMark}
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
      <Button
        icon={<ReloadOutlined />}
        onClick={resetCaptcha}
        className={styles.refreshCaptcha}
      >
        刷新验证码
      </Button>

      {/* 用于存储captchaKey，以便在提交时可以传递给后端 */}
      <input type="hidden" id={`${fieldName}-key`} value={captchaKey} />
    </div>
  );
};

export default CaptchaVerify;
