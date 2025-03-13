import React from "react";
import ReactDOM from "react-dom/client";
import { message } from "antd"; // 添加这一行导入message
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { initTestEnvironment } from "./utils/testDataInitializer";
import { checkBackendServices } from "./utils/serviceCheck";
import "./index.css";
import "./utils/requestMiddleware";

// 初始化测试环境
initTestEnvironment();

// 在应用启动时检查服务状态
checkBackendServices().then((isAvailable) => {
  if (!isAvailable) {
    // 可以显示友好的提示
    message.warning("后端服务未启动或不可用，某些功能可能不正常");
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
