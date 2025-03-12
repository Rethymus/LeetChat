import React, { useState, useCallback } from "react";
import { FormInstance, Spin } from "antd";
import { ReloadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styles from "./CaptchaVerify.module.scss";

interface CaptchaVerifyProps {
  form: FormInstance;
  imageBase64: string;
  thumbBase64?: string;
  isLoading?: boolean;
  onRefresh: () => void;
  fieldName?: string;
}

// 添加懒加载和无障碍支持
const CaptchaVerify: React.FC<CaptchaVerifyProps> = ({
  form,
  imageBase64,
  thumbBase64,
  isLoading = false,
  onRefresh,
  fieldName = "captcha",
}) => {
  const [marks, setMarks] = useState<number[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用useCallback优化事件处理函数
  const handleCaptchaClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (isLoading) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

      // 最多点击5个点
      if (marks.length >= 10) return;

      const newMarks = [...marks, x, y];
      setMarks(newMarks);
      form.setFieldsValue({ [fieldName]: newMarks });
    },
    [isLoading, marks, form, fieldName],
  );

  // 处理标记点击(删除标记)
  const handleMarkClick = (index: number) => {
    const newMarks = [...marks];
    // 删除坐标对
    newMarks.splice(index * 2, 2);
    setMarks(newMarks);
    form.setFieldsValue({ [fieldName]: newMarks });
  };

  // 处理刷新验证码
  const handleRefresh = useCallback(() => {
    setMarks([]);
    form.setFieldsValue({ [fieldName]: [] });
    onRefresh();
  }, [form, fieldName, onRefresh]);

  // 处理清除选择
  const handleClear = useCallback(() => {
    setMarks([]);
    form.setFieldsValue({ [fieldName]: [] });
  }, [form, fieldName]);

  // 添加键盘导航支持
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleRefresh();
      }
    },
    [handleRefresh],
  );

  // 添加提示和动画效果
  return (
    <div className={styles.captchaContainer} role="region" aria-label="验证码区域">
      {/* 添加提示文本 */}
      <div className={styles.captchaTitle}>
        请依次点击下图中的{" "}
        {thumbBase64 && (
          <img
            src={`data:image/png;base64,${thumbBase64}`}
            alt="目标"
            className={styles.thumbImageInline}
          />
        )}
        {marks.length > 0 && <span className={styles.progress}>({marks.length / 2}/5)</span>}
      </div>

      <div className={styles.captchaImageContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spin tip="加载中..." />
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className={styles.loading}>
                <Spin />
              </div>
            )}
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt="请点击指定目标进行验证"
              className={`${styles.captchaImage} ${imageLoaded ? styles.loaded : ""}`}
              onClick={handleCaptchaClick}
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </>
        )}

        {/* 显示标记点 */}
        {marks.length > 0 &&
          marks.map((_, i) => {
            if (i % 2 === 0) {
              const x = marks[i];
              const y = marks[i + 1];
              return (
                <span
                  key={i / 2}
                  className={`${styles.captchaMark} ${styles.animated}`}
                  onClick={() => handleMarkClick(i / 2)}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  {i / 2 + 1}
                </span>
              );
            }
            return null;
          })}
      </div>

      <div className={styles.captchaActions}>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={handleRefresh}
          onKeyPress={handleKeyPress}
          aria-label="刷新验证码"
          tabIndex={0}
        >
          <ReloadOutlined /> 刷新验证码
        </button>
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="清除所有标记"
          tabIndex={0}
        >
          <CloseCircleOutlined /> 清除
        </button>
        <span className={styles.captchaHint}>
          请依次点击下图中的
          {thumbBase64 && (
            <img
              src={`data:image/png;base64,${thumbBase64}`}
              alt="目标"
              className={styles.thumbImage}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default CaptchaVerify;
