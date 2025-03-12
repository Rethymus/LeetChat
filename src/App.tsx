import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./App.css";
import "./layout.css"; // 导入响应式修正

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
