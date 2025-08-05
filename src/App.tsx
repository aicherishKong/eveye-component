import React, { useState } from "react";
import DateRangePicker from "./components/DateRangePicker";

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // 处理日期范围变化
  const handleDateRangeChange = (
    dates: [Date | null, Date | null],
    isoStrings: [string | null, string | null]
  ) => {
    setDateRange(dates);
    console.log("选择的日期范围:", dates);
    console.log("ISO字符串格式:", isoStrings);
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: "24px" }}>
        DateRangePicker 暗黑主题演示
      </h1>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#fff", marginBottom: "12px" }}>基础用法：</h3>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder={["开始日期", "结束日期"]}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#fff", marginBottom: "12px" }}>禁用状态：</h3>
        <DateRangePicker disabled placeholder={["开始日期", "结束日期"]} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#fff", marginBottom: "12px" }}>自定义格式：</h3>
        <DateRangePicker
          format="YYYY-MM-DD"
          placeholder={["起始时间", "结束时间"]}
        />
      </div>

      {dateRange[0] && dateRange[1] && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "var(--drp-success-bg)",
            border: "1px solid var(--drp-success-border)",
            borderRadius: 6,
            color: "#fff",
          }}
        >
          已选择日期范围: {dateRange[0].toLocaleDateString()} 至{" "}
          {dateRange[1].toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default App;
