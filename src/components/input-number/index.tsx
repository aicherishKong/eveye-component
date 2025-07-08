/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from "react";
import { css } from "@emotion/react";

// InputNumber Props
export interface InputNumberProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  onChange?: (value: number | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  stringMode?: boolean;
}

// Size configurations
const sizeConfig = {
  small: {
    height: "24px",
    fontSize: "12px",
    padding: "0 7px",
    controlWidth: "16px",
  },
  middle: {
    height: "32px",
    fontSize: "14px",
    padding: "0 11px",
    controlWidth: "20px",
  },
  large: {
    height: "40px",
    fontSize: "16px",
    padding: "0 15px",
    controlWidth: "24px",
  },
};

// Styles
const inputNumberWrapperStyle = (
  size: "small" | "middle" | "large",
  disabled: boolean,
  focused: boolean
) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 120px;
  height: ${sizeConfig[size].height};
  background: ${disabled
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${focused ? "rgb(68, 147, 248)" : "rgba(255, 255, 255, 0.3)"};
  border-radius: 6px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "rgb(68, 147, 248)"};
  }

  ${disabled ? "cursor: not-allowed; opacity: 0.6;" : ""}
`;

const inputStyle = (
  size: "small" | "middle" | "large",
  disabled: boolean,
  hasControls: boolean
) => css`
  flex: 1;
  height: 100%;
  padding: ${sizeConfig[size].padding};
  padding-right: ${hasControls
    ? `${parseInt(sizeConfig[size].controlWidth) + 8}px`
    : sizeConfig[size].padding.split(" ")[1]};
  font-size: ${sizeConfig[size].fontSize};
  color: ${disabled ? "#666" : "#e5e7eb"};
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const controlsStyle = (size: "small" | "middle" | "large") => css`
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  width: ${sizeConfig[size].controlWidth};
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const controlButtonStyle = (disabled: boolean) => css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${disabled ? "#666" : "rgba(255, 255, 255, 0.7)"};
  cursor: ${disabled ? "not-allowed" : "pointer"};
  transition: all 0.15s ease;
  font-size: 10px;

  &:hover {
    background: ${disabled ? "transparent" : "rgba(255, 255, 255, 0.1)"};
    color: ${disabled ? "#666" : "#fff"};
  }

  &:active {
    background: ${disabled ? "transparent" : "rgba(255, 255, 255, 0.2)"};
  }

  &:first-of-type {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

// Helper functions
const formatNumber = (value: number, precision?: number): number => {
  if (precision !== undefined) {
    return Number(value.toFixed(precision));
  }
  return value;
};

const isValidNumber = (value: any): boolean => {
  return !isNaN(value) && isFinite(value);
};

const clampValue = (value: number, min?: number, max?: number): number => {
  let result = value;
  if (min !== undefined && result < min) {
    result = min;
  }
  if (max !== undefined && result > max) {
    result = max;
  }
  return result;
};

// InputNumber Component
const InputNumber: React.FC<InputNumberProps> = ({
  value: valueProp,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  disabled = false,
  placeholder,
  size = "middle",
  onChange,
  onBlur,
  onFocus,
  onPressEnter,
  className,
  style,
  controls = true,
  stringMode = false,
}) => {
  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue ?? null
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = valueProp !== undefined ? valueProp : internalValue;

  // Update input display value when value changes
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setInputValue(String(value));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    if (inputVal === "" || inputVal === "-") {
      updateValue(null);
      return;
    }

    const numValue = Number(inputVal);
    if (isValidNumber(numValue)) {
      updateValue(numValue);
    }
  };

  const updateValue = (newValue: number | null) => {
    if (newValue !== null) {
      const clampedValue = clampValue(newValue, min, max);
      const formattedValue = formatNumber(clampedValue, precision);

      if (valueProp === undefined) {
        setInternalValue(formattedValue);
      }
      onChange?.(formattedValue);
    } else {
      if (valueProp === undefined) {
        setInternalValue(null);
      }
      onChange?.(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    // Format the input value on blur
    if (value !== null && value !== undefined) {
      const formattedValue = formatNumber(value, precision);
      setInputValue(String(formattedValue));
    }

    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onPressEnter?.(e);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleStep(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleStep(false);
    }
  };

  const handleStep = (up: boolean) => {
    if (disabled) return;

    const currentValue = value ?? 0;
    const newValue = up ? currentValue + step : currentValue - step;
    updateValue(newValue);
  };

  const canStepUp = () => {
    if (disabled) return false;
    if (max === undefined) return true;
    return (value ?? 0) < max;
  };

  const canStepDown = () => {
    if (disabled) return false;
    if (min === undefined) return true;
    return (value ?? 0) > min;
  };

  return (
    <div
      css={inputNumberWrapperStyle(size, disabled, focused)}
      className={className}
      style={style}
    >
      <input
        ref={inputRef}
        css={inputStyle(size, disabled, controls)}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      {controls && (
        <div css={controlsStyle(size)}>
          <button
            css={controlButtonStyle(!canStepUp())}
            disabled={!canStepUp()}
            onMouseDown={(e) => {
              e.preventDefault();
              handleStep(true);
            }}
            type="button"
          >
            ▲
          </button>
          <button
            css={controlButtonStyle(!canStepDown())}
            disabled={!canStepDown()}
            onMouseDown={(e) => {
              e.preventDefault();
              handleStep(false);
            }}
            type="button"
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
};

export default InputNumber;
