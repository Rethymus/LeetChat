import React, { useEffect } from "react";
import { Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./ClickCaptcha.module.css";

interface ClickCaptchaProps {
  imageBase64?: string;
  thumbBase64?: string;
  dots: number[];
  loading: boolean;
  onImageClick: (e: React.MouseEvent<HTMLImageElement>) => void;
  onRefresh: () => void;
}

const ClickCaptcha: React.FC<ClickCaptchaProps> = ({
  imageBase64,
  thumbBase64,
  dots,
  loading,
  onImageClick,
  onRefresh,
}) => {
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Spin />
          <p>加载验证码中...</p>
        </div>
      ) : (
        <>
          {/* 强制显示图片区域，即使imageBase64为空 */}
          <div className={styles.imageContainer}>
            {imageBase64 ? (
              <img
                src={imageBase64}
                alt="验证码"
                className={styles.captchaImage}
                onClick={onImageClick}
                onError={(e) => {
                  console.error("验证码图片加载失败");
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.placeholder}>
                <p>验证码加载失败，请刷新</p>
              </div>
            )}

            <div className={styles.dotMarkers}>
              {Array.from({ length: dots.length / 2 }, (_, i) => (
                <div
                  key={i}
                  className={styles.dot}
                  style={{
                    left: `${dots[i * 2]}px`,
                    top: `${dots[i * 2 + 1]}px`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {thumbBase64 && (
            <div className={styles.thumbContainer}>
              <img
                src={thumbBase64}
                alt="验证码缩略图"
                className={styles.thumbImage}
                onError={(e) => {
                  console.error("缩略图加载失败", e);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              className={styles.refreshButton}
            >
              刷新验证码
            </Button>
            <p className={styles.tip}>请依次点击图中对应的4个汉字位置</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ClickCaptcha;
