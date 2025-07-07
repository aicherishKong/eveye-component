/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from "@emotion/styled";
import { CheckboxGroup, Radio } from "./components";

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
        <Radio.Group value={radioValue} onChange={onRadioChange} direction="vertical">
          <Radio value={1}>选项 A</Radio>
          <Radio value={2}>选项 B</Radio>
          <Radio value={3}>选项 C</Radio>
          <Radio value={4} disabled>禁用选项</Radio>
        </Radio.Group>
      </CheckboxSection>
    </div>
  );
}

export default App;
