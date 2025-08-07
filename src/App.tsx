import React from 'react';
import { Tabs } from './components';
import type { TabsProps } from './components';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

const App: React.FC = () => {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>
        自定义 Tabs 组件演示
      </h1>

      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ marginBottom: "16px" }}>基础 Tabs 组件：</h3>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
};

export default App;
