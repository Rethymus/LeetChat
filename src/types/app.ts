// 定义组件常用类型
export interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void;
}

export interface UploadProps {
  file: File;
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
}

export interface SidebarItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}
