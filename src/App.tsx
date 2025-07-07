/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from "@emotion/styled";
import { CheckboxGroup } from "./components";

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

  return (
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
  );
}

export default App;
