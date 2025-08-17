import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartData {
  name: string;
  [key: string]: any;
}

interface ChartConfig {
  title: string;
  dataKey: string;
  unit?: string;
  color?: string;
  yAxisMax?: number;
  formatter?: (value: number) => string;
}

export interface LatencyChartProps {
  data: ChartData[];
  config: ChartConfig;
  width?: number;
  height?: number;
}

const LatencyChart: React.FC<LatencyChartProps> = ({
  data,
  config,
  width = 400,
  height = 300,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    chartInstance.current = echarts.init(chartRef.current);

    // 配置选项
    const option: echarts.EChartsOption = {
      backgroundColor: "#1a1a1a", // 暗色背景
      title: {
        text: config.title,
        left: "left",
        top: "top",
        textStyle: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#333",
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          const value = config.formatter ? config.formatter(params.value) : params.value;
          return `${params.name}<br/>${params.marker} ${params.seriesName}: ${value}${config.unit || ''}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.name),
        axisLine: {
          lineStyle: {
            color: "#666",
          },
        },
        axisLabel: {
          color: "#ffffff",
          rotate: 45,
          width: 60,
          overflow: "truncate",
          ellipsis: "...",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#666",
          },
        },
        axisLabel: {
          color: "#ffffff",
        },
        splitLine: {
          lineStyle: {
            color: "#333",
          },
        },
        ...(config.yAxisMax && { max: config.yAxisMax }),
      },
      series: [
        {
          name: config.title,
          type: "bar",
          data: data.map((item) => item[config.dataKey] || 0),
          itemStyle: {
            color: config.color || "#5470c6",
          },
          emphasis: {
            itemStyle: {
              color: "#3c5aa6",
            },
          },
          barWidth: "25%",
        },
      ],
    };

    // 设置配置项
    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data, config]);

  return (
    <div
      ref={chartRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#1a1a1a",
      }}
    />
  );
};

export default LatencyChart;
