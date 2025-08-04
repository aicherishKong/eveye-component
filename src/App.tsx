/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Space, Typography, Card, Switch, ConfigProvider, theme } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import DebounceSelect from "./components/debounce-select";
import DateRangePicker from "./components/DateRangePicker";

const { Title, Text } = Typography;

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
  const [value, setValue] = useState<UserValue[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 错误处理回调
  const handleError = (error: any) => {
    console.error("获取用户数据失败:", error);
    // 这里可以添加用户友好的错误提示，比如 toast 通知
  };

  // 处理主题切换
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    console.log('选择的日期范围:', dates);
  };

  // 初始化主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div style={{ 
        padding: '24px', 
        maxWidth: '800px', 
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#000' : '#fff',
        transition: 'background-color 0.3s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#fff' : '#000' }}>Eveye 组件库演示</Title>
          <Space align="center">
            <SunOutlined style={{ color: isDarkMode ? '#666' : '#1890ff' }} />
            <Switch 
              checked={isDarkMode}
              onChange={handleThemeChange}
              size="default"
            />
            <MoonOutlined style={{ color: isDarkMode ? '#1890ff' : '#666' }} />
          </Space>
        </div>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 日期范围选择器演示 */}
        <Card title="日期范围选择器 (DateRangePicker)" style={{ width: '100%' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>基础用法：</Text>
              <div style={{ marginTop: 8 }}>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  placeholder={['开始日期', '结束日期']}
                />
              </div>
            </div>
            
            <div>
              <Text strong>禁用状态：</Text>
              <div style={{ marginTop: 8 }}>
                <DateRangePicker
                  disabled
                  placeholder={['开始日期', '结束日期']}
                />
              </div>
            </div>
            
            <div>
              <Text strong>自定义格式：</Text>
              <div style={{ marginTop: 8 }}>
                <DateRangePicker
                  format="YYYY-MM-DD"
                  placeholder={['起始时间', '结束时间']}
                />
              </div>
            </div>
            
            {dateRange[0] && dateRange[1] && (
              <div style={{ 
                marginTop: 16, 
                padding: 12, 
                background: isDarkMode ? 'var(--drp-success-bg)' : '#f6ffed', 
                border: `1px solid ${isDarkMode ? 'var(--drp-success-border)' : '#b7eb8f'}`, 
                borderRadius: 6 
              }}>
                <Text>已选择日期范围: {dateRange[0].toLocaleDateString()} 至 {dateRange[1].toLocaleDateString()}</Text>
              </div>
            )}
          </Space>
        </Card>
        
        {/* 防抖选择器演示 */}
        <Card title="防抖选择器 (DebounceSelect)" style={{ width: '100%' }}>
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
        </Card>
      </Space>
      </div>
    </ConfigProvider>
  );
};

export default App;
