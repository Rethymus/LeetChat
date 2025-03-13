import React from "react";
import { Button, message } from "antd";
import { useCaptcha } from "../hooks/useCaptcha";
import styles from "./CaptchaTest.module.css";

const CaptchaTest: React.FC = () => {
  const { loading, verifying, captchaData, dots, getCaptcha, handleImageClick, verifyCapcha } =
    useCaptcha();

  // 处理验证
  const handleVerify = async () => {
    if (dots.length < 8) {
      return message.warning("请点击4个字符位置");
    }

    const success = await verifyCapcha();
    if (success) {
      message.success("验证成功");
    } else {
      message.error("验证失败，请重新尝试");
    }
  };

  return (
    <div className={styles.container}>
      <h1>验证码测试页面</h1>

      <div className={styles.captchaArea}>
        {captchaData ? (
          <>
            <div className={styles.imageContainer}>
              <img
                src={captchaData.imageBase64}
                alt="验证码"
                className={styles.captchaImage}
                onClick={handleImageClick}
              />
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

            {captchaData.thumbBase64 && (
              <div className={styles.thumbContainer}>
                <img
                  src={captchaData.thumbBase64}
                  alt="验证码缩略图"
                  className={styles.thumbImage}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <p>请点击下方按钮获取验证码</p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="primary" onClick={getCaptcha} loading={loading} className={styles.button}>
          {captchaData ? "刷新验证码" : "获取验证码"}
        </Button>

        <Button
          type="primary"
          onClick={handleVerify}
          disabled={!captchaData || dots.length < 8 || verifying}
          loading={verifying}
          className={styles.button}
        >
          验证
        </Button>
      </div>

      <div className={styles.instructions}>
        <h3>使用说明:</h3>
        <p>1. 点击"获取验证码"按钮获取验证码图片</p>
        <p>2. 在大图中依次点击缩略图中显示的汉字位置</p>
        <p>3. 点击"验证"按钮提交验证</p>
      </div>
    </div>
  );
};

export default CaptchaTest;
