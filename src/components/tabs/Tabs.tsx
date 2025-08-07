/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { css } from '@emotion/react';

export interface TabItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}

const simpleTabsStyle = css`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const simpleTabsNavStyle = css`
  display: flex;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 16px;
`;

const simpleTabsTabStyle = css`
  padding: 12px 16px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.65);
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  user-select: none;

  &:hover {
    color: #1677ff;
  }
`;

const simpleTabsTabActiveStyle = css`
  color: #1677ff;
  border-bottom-color: #1677ff;
`;

const simpleTabsContentStyle = css`
  padding: 16px 0;
`;

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveKey,
  onChange
}) => {
  const [activeKey, setActiveKey] = useState<string>(
    defaultActiveKey || (items.length > 0 ? items[0].key : '')
  );

  const handleTabClick = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const activeItem = items.find(item => item.key === activeKey);

  return (
    <div css={simpleTabsStyle}>
      <div css={simpleTabsNavStyle}>
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <div
              key={item.key}
              css={[simpleTabsTabStyle, isActive && simpleTabsTabActiveStyle]}
              onClick={() => handleTabClick(item.key)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div css={simpleTabsContentStyle}>
        {activeItem?.children}
      </div>
    </div>
  );
};

export default Tabs;