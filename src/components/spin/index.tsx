/** @jsxImportSource @emotion/react */
import React from "react";
import { css, keyframes } from "@emotion/react";

interface SpinProps {
  size?: "small" | "default" | "large";
  style?: React.CSSProperties;
}

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const spinContainer = (spinSize: number) => css`
  display: inline-block;
  position: relative;
  width: ${spinSize}px;
  height: ${spinSize}px;
`;

const spinDot = css`
  width: 100%;
  height: 100%;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Spin: React.FC<SpinProps> = ({ size = "default", style }) => {
  const sizeMap = {
    small: 16,
    default: 20,
    large: 24,
  };

  const spinSize = sizeMap[size];

  return (
    <div css={spinContainer(spinSize)} style={style}>
      <div css={spinDot} />
    </div>
  );
};

export default Spin;
