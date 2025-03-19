import React, { useEffect, useRef } from "react";
import { Modal, message, Button } from "antd";
import { useClickCaptcha } from "../../hooks/useClickCaptcha";
import ClickCaptcha from "./ClickCaptcha";

interface CaptchaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  title?: string;
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  title = "安全验证",
}) => {
  const {
    loading,
    verifying,
    captchaData,
    dots,
    getCaptcha,
    handleImageClick,
    verifyCapcha,
    resetClickCaptcha,
  } = useClickCaptcha();

  // 添加请求状态记录
  const requestedRef = useRef(false);

  // 优化请求逻辑
  useEffect(() => {
    if (visible && !requestedRef.current && !captchaData) {
      requestedRef.current = true;

      // 使用setTimeout避免过快请求
      const timer = setTimeout(() => {
        getCaptcha().finally(() => {
          // 延迟重置请求状态
          setTimeout(() => {
            requestedRef.current = false;
          }, 5000);
        });
      }, 100);

      return () => clearTimeout(timer);
    }

    // 当模态框关闭时重置状态
    if (!visible) {
      requestedRef.current = false;
    }
  }, [visible, captchaData]);

  // 验证处理
  const handleVerify = async () => {
    if (dots.length < 8) {
      message.warning("请点击4个字符位置");
      return;
    }

    const success = await verifyCapcha();
    if (success) {
      message.success("验证成功");
      onSuccess();
    } else {
      message.error("验证失败，请重新尝试");
    }
  };

  // 处理取消
  const handleClose = () => {
    resetClickCaptcha();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button
          key="verify"
          type="primary"
          loading={verifying}
          disabled={dots.length < 8}
          onClick={handleVerify}
        >
          验证
        </Button>,
      ]}
      maskClosable={false}
      destroyOnClose
    >
      <div style={{ padding: "10px 0" }}>
        <p style={{ marginBottom: "15px", color: "#555" }}>
          请点击下图中缩略图显示的4个汉字位置完成验证
        </p>
        <ClickCaptcha
          imageBase64={captchaData?.imageBase64}
          thumbBase64={captchaData?.thumbBase64}
          dots={dots}
          loading={loading}
          onImageClick={handleImageClick}
          onRefresh={getCaptcha}
        />
      </div>
    </Modal>
  );
};

export default CaptchaModal;
