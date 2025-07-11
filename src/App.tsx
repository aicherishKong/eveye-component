/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import DebounceSelect from "./components/debounce-select";

// 用户数据类型
interface UserValue {
  label: string;
  value: string;
  avatar?: string;
}

// 模拟 API 调用
async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log("fetching user", username);

  try {
    const response = await fetch(
      `https://660d2bd96ddfa2943b33731c.mockapi.io/api/users/?search=${username}`
    );
    const res = await response.json();
    const results = Array.isArray(res) ? res : [];

    return results.map((user: any) => ({
      label: user.name,
      value: user.id,
      avatar: user.avatar,
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

const App: React.FC = () => {
  const [value, setValue] = useState<{ label: string; value: string }[]>([]);

  // 错误处理回调
  const handleError = (error: any) => {
    console.error("获取用户数据失败:", error);
    // 这里可以添加用户友好的错误提示，比如 toast 通知
  };

  return (
    <DebounceSelect<UserValue>
      mode="multiple"
      value={value}
      placeholder="搜索并选择用户"
      fetchOptions={fetchUserList}
      style={{ width: "100%" }}
      onChange={(newValue) => {
        if (Array.isArray(newValue)) {
          setValue(newValue);
        }
      }}
      // 新增的错误处理配置
      onError={handleError}
      timeout={8000}
      fallbackOptions={[]}
      enableKeyboardNavigation={true}
      aria-label="用户搜索选择器"
    />
  );
};

export default App;
