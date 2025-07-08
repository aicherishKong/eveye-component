/** @jsxImportSource @emotion/react */
import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { CheckboxGroup, Radio, InputNumber, Select } from "./components";
import type { SelectOption } from "./components";

const CheckboxSection = styled.div`
  margin: 2rem 0;
  text-align: left;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  color: white;
`;

const ResultDisplay = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: "Courier New", monospace;
`;

function App() {
  // CheckboxGroup 相关状态
  const [checkedList, setCheckedList] = useState<Array<string | number>>([
    "Apple",
    "Orange",
  ]);

  // Radio 相关状态
  const [radioValue, setRadioValue] = useState(1);

  // InputNumber 相关状态
  const [inputValue, setInputValue] = useState(3);

  // Select 相关状态
  const [selectValue, setSelectValue] = useState<string>();
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [remoteSelectValue, setRemoteSelectValue] = useState<string[]>([]);
  const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);

  // 用户搜索相关状态
  const [userSearchValue, setUserSearchValue] = useState<string[]>([]);
  const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // 选项数据
  const plainOptions = [
    { label: "Apple", value: "Apple" },
    { label: "Pear", value: "Pear" },
    { label: "Orange", value: "Orange" },
    { label: "Banana", value: "Banana" },
    { label: "Grape", value: "Grape", disabled: true },
  ];

  const onChange = (checkedValues: Array<string | number>) => {
    console.log("checked = ", checkedValues);
    setCheckedList(checkedValues);
  };

  const onRadioChange = (value: any) => {
    console.log("radio checked", value);
    setRadioValue(value);
  };

  const onInputNumberChange = (value: number | null) => {
    console.log("input number changed", value);
    setInputValue(value || 0);
  };

  // 基础选项数据
  const basicOptions: SelectOption[] = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Watermelon", value: "watermelon" },
    { label: "Pineapple", value: "pineapple", disabled: true },
  ];

  // 模拟远程搜索
  const handleRemoteSearch = useCallback(async (searchValue: string) => {
    if (!searchValue) {
      setRemoteOptions([]);
      return;
    }

    setRemoteLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const mockData: SelectOption[] = [
        { label: `${searchValue} - Option 1`, value: `${searchValue}-1` },
        { label: `${searchValue} - Option 2`, value: `${searchValue}-2` },
        { label: `${searchValue} - Option 3`, value: `${searchValue}-3` },
        { label: `${searchValue} - Option 4`, value: `${searchValue}-4` },
        { label: `${searchValue} - Option 5`, value: `${searchValue}-5` },
      ];

      setRemoteOptions(mockData);
      setRemoteLoading(false);
    }, 500);
  }, []);

  const onSelectChange = (value: any) => {
    console.log("select changed", value);
    setSelectValue(value);
  };

  const onMultiSelectChange = (value: any) => {
    console.log("multi select changed", value);
    setMultiSelectValue(value);
  };

  const onRemoteSelectChange = (value: any) => {
    console.log("remote select changed", value);
    setRemoteSelectValue(value);
  };

  // 模拟用户搜索
  const handleUserSearch = useCallback(async (searchValue: string) => {
    if (!searchValue) {
      setUserOptions([]);
      return;
    }

    setUserLoading(true);

    // 模拟API调用延迟
    setTimeout(() => {
      const mockUsers: SelectOption[] = [
        {
          label: `张三 (${searchValue})`,
          value: `zhangsan-${searchValue}`,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        },
        {
          label: `李四 (${searchValue})`,
          value: `lisi-${searchValue}`,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        },
        {
          label: `王五 (${searchValue})`,
          value: `wangwu-${searchValue}`,
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
        },
        {
          label: `赵六 (${searchValue})`,
          value: `zhaoliu-${searchValue}`,
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
        },
        {
          label: `钱七 (${searchValue})`,
          value: `qianqi-${searchValue}`,
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
        },
      ];

      setUserOptions(mockUsers);
      setUserLoading(false);
    }, 300);
  }, []);

  const onUserSearchChange = (value: any) => {
    console.log("user search changed", value);
    setUserSearchValue(value);
  };

  return (
    <div>
      <CheckboxSection>
        <SectionTitle>CheckboxGroup 组件演示</SectionTitle>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />

        <ResultDisplay>
          <div>选中的值: {JSON.stringify(checkedList)}</div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Radio 组件演示</SectionTitle>
        <Radio.Group value={radioValue} onChange={onRadioChange}>
          <Radio value={1}>A</Radio>
          <Radio value={2}>B</Radio>
          <Radio value={3}>C</Radio>
        </Radio.Group>

        <ResultDisplay>
          <div>选中的值: {radioValue}</div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Radio 垂直布局演示</SectionTitle>
        <Radio.Group
          value={radioValue}
          onChange={onRadioChange}
          direction="vertical"
        >
          <Radio value={1}>选项 A</Radio>
          <Radio value={2}>选项 B</Radio>
          <Radio value={3}>选项 C</Radio>
          <Radio value={4} disabled>
            禁用选项
          </Radio>
        </Radio.Group>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>InputNumber 组件演示</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <InputNumber
            min={1}
            max={10}
            defaultValue={3}
            onChange={onInputNumberChange}
            placeholder="请输入数字"
          />
          <InputNumber
            min={0}
            max={100}
            step={10}
            defaultValue={20}
            size="large"
          />
          <InputNumber
            min={-10}
            max={10}
            step={0.1}
            precision={1}
            defaultValue={0}
            size="small"
          />
          <InputNumber disabled defaultValue={5} />
        </div>

        <ResultDisplay>
          <div>当前值: {inputValue}</div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Select 基础用法</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Select
            placeholder="请选择水果"
            options={basicOptions}
            value={selectValue}
            onChange={onSelectChange}
            allowClear
          />
          <Select
            placeholder="可搜索"
            options={basicOptions}
            showSearch
            allowClear
            size="large"
          />
          <Select
            placeholder="禁用状态"
            options={basicOptions}
            disabled
            size="small"
          />
        </div>

        <ResultDisplay>
          <div>选中值: {selectValue || "null"}</div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Select 多选模式</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Select
            placeholder="多选水果"
            options={basicOptions}
            value={multiSelectValue}
            onChange={onMultiSelectChange}
            multiple
            allowClear
            showSearch
            style={{ minWidth: "200px" }}
          />
          <Select
            placeholder="限制显示标签数量"
            options={basicOptions}
            multiple
            maxTagCount={2}
            allowClear
            style={{ minWidth: "200px" }}
          />
        </div>

        <ResultDisplay>
          <div>多选值: {JSON.stringify(multiSelectValue)}</div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Select 远程搜索</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Select
            placeholder="输入关键词远程搜索"
            options={remoteOptions}
            value={remoteSelectValue}
            onChange={onRemoteSelectChange}
            onSearch={handleRemoteSearch}
            loading={remoteLoading}
            multiple
            showSearch
            allowClear
            filterOption={false}
            notFoundContent={remoteLoading ? "搜索中..." : "请输入关键词搜索"}
            style={{ minWidth: "250px" }}
          />
        </div>

        <ResultDisplay>
          <div>远程搜索值: {JSON.stringify(remoteSelectValue)}</div>
          <div>
            当前选项: {JSON.stringify(remoteOptions.map((opt) => opt.label))}
          </div>
        </ResultDisplay>
      </CheckboxSection>

      <CheckboxSection>
        <SectionTitle>Select 用户搜索</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Select
            placeholder="搜索用户（支持头像显示）"
            options={userOptions}
            value={userSearchValue}
            onChange={onUserSearchChange}
            onSearch={handleUserSearch}
            loading={userLoading}
            multiple
            showSearch
            allowClear
            filterOption={false}
            notFoundContent={userLoading ? "搜索中..." : "请输入用户名搜索"}
            style={{ minWidth: "300px" }}
            renderOption={(option) => (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img
                  src={
                    option.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  }
                  alt="avatar"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span>{option.label}</span>
              </div>
            )}
            renderTag={(option) => (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <img
                  src={
                    option.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  }
                  alt="avatar"
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span>{option.label}</span>
              </div>
            )}
          />
        </div>

        <ResultDisplay>
          <div>选中用户: {JSON.stringify(userSearchValue)}</div>
          <div>
            用户列表: {JSON.stringify(userOptions.map((opt) => opt.label))}
          </div>
        </ResultDisplay>
      </CheckboxSection>
    </div>
  );
}

export default App;
