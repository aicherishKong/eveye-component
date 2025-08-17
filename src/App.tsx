import React, { useState } from "react";
import { LatencyChart, ChartSelector } from "./components";
import "./App.css";
import type { ChartOption } from "./components";

const App: React.FC = () => {
  // 模拟后端分别返回的数据
  // P50 延迟数据 (来自 /api/metrics/p50)
  const p50Data = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      p50: 0.19,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      p50: 16.65,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      p50: 16.62,
    },
  ];

  // P99 延迟数据 (来自 /api/metrics/p99)
  const p99Data = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      p99: 0.35,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      p99: 22.45,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      p99: 24.15,
    },
  ];

  // 错误率数据 (来自 /api/metrics/error-rate)
  const errorRateData = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      errorRate: 1.0,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      errorRate: 0.6,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      errorRate: 0.2,
    },
  ];

  // Prompt Tokens 数据
  const promptTokensData = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      promptTokens: 12,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      promptTokens: 11,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      promptTokens: 22,
    },
  ];

  // Output Tokens 数据
  const outputTokensData = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      outputTokens: 0,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      outputTokens: 215,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      outputTokens: 420,
    },
  ];

  // Total Cost 数据
  const totalCostData = [
    {
      name: "pg:gpt-4-1-mini-5568f096",
      totalCost: 0.025,
    },
    {
      name: "pg:deepseek-reasoner-aeb4500",
      totalCost: 0.018,
    },
    {
      name: "expr_name_expr_name_expr_name_...",
      totalCost: 0.042,
    },
  ];

  // 图表配置
  const p50Config = {
    title: "P50 Latency",
    dataKey: "p50",
    unit: "ms",
    color: "#5470c6",
  };

  const p99Config = {
    title: "P99 Latency",
    dataKey: "p99",
    unit: "ms",
    color: "#5470c6",
  };

  const errorRateConfig = {
    title: "Error Rate",
    dataKey: "errorRate",
    unit: "",
    color: "#5470c6",
    yAxisMax: 1,
    formatter: (value: number) => (value * 100).toFixed(1) + "%",
  };

  const promptTokensConfig = {
    title: "Prompt Tokens",
    dataKey: "promptTokens",
    unit: "tokens",
    color: "#5470c6",
    formatter: (value: number) => `${value} tokens`,
  };

  const outputTokensConfig = {
    title: "Output Tokens",
    dataKey: "outputTokens",
    unit: "tokens",
    color: "#5470c6",
    formatter: (value: number) => `${value} tokens`,
  };

  const totalCostConfig = {
    title: "Total Cost",
    dataKey: "totalCost",
    unit: "$",
    color: "#5470c6",
    formatter: (value: number) => `$${value.toFixed(3)}`,
  };

  // 图表可见性状态
  const [chartOptions, setChartOptions] = useState<ChartOption[]>([
    { id: "p50", label: "P50 Latency", visible: true },
    { id: "p99", label: "P99 Latency", visible: true },
    { id: "errorRate", label: "Error Rate", visible: true },
    { id: "totalCost", label: "Total Cost", visible: true },
  ]);

  // 处理图表可见性变化
  const handleChartVisibilityChange = (id: string, visible: boolean) => {
    setChartOptions((prev) =>
      prev.map((option) => (option.id === id ? { ...option, visible } : option))
    );
  };

  // 获取图表可见性状态
  const isChartVisible = (id: string) => {
    return chartOptions.find((option) => option.id === id)?.visible ?? false;
  };

  return (
    <div>
      {/* 图表选择器 */}
      <div style={{ maxWidth: "400px", margin: "0 auto 40px" }}>
        <ChartSelector
          options={chartOptions}
          onChange={handleChartVisibilityChange}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: "20px",
        }}
      >
        {/* P50 延迟图表 */}
        <div style={{ display: isChartVisible("p50") ? "block" : "none" }}>
          <LatencyChart
            data={p50Data}
            config={p50Config}
            width={450}
            height={400}
          />
        </div>

        {/* P99 延迟图表 */}
        <div style={{ display: isChartVisible("p99") ? "block" : "none" }}>
          <LatencyChart
            data={p99Data}
            config={p99Config}
            width={450}
            height={400}
          />
        </div>

        {/* Error Rate 图表 */}
        <div
          style={{ display: isChartVisible("errorRate") ? "block" : "none" }}
        >
          <LatencyChart
            data={errorRateData}
            config={errorRateConfig}
            width={450}
            height={400}
          />
        </div>

        {/* Total Cost 图表 */}
        <div
          style={{ display: isChartVisible("totalCost") ? "block" : "none" }}
        >
          <LatencyChart
            data={totalCostData}
            config={totalCostConfig}
            width={450}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
