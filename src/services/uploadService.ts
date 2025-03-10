import axios from "axios";

// 文件上传服务
export const uploadFile = async (file: File, type: 'image' | 'file' = 'file') => {
  // 1. 从后端获取OSS签名
  const { data: signData } = await axios.get("/api/upload/sign", {
    params: { fileName: file.name, fileType: file.type }
  });
  
  // 2. 利用签名直接上传到OSS
  const formData = new FormData();
  Object.entries(signData.formData).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);
  
  // 上传到OSS
  await axios.post(signData.url, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  
  // 返回文件URL
  return signData.fileUrl;
};

// 图片上传组件使用示例
export const uploadImage = async (file: File) => {
  return await uploadFile(file, 'image');
};