/** @jsxImportSource @emotion/react */
import React, { createContext, useContext, useState } from 'react';
import { css } from '@emotion/react';

// Radio Group Context
interface RadioGroupContextValue {
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  name?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// Radio Props
export interface RadioProps {
  value?: any;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Radio Group Props
export interface RadioGroupProps {
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  name?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: 'horizontal' | 'vertical';
}

// Radio Styles
const radioWrapperStyle = css`
  display: inline-flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: opacity 0.15s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const hiddenInputStyle = css`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
`;

const radioIconStyle = (checked: boolean, disabled: boolean) => css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${checked ? 'rgb(68, 147, 248)' : 'rgba(255, 255, 255, 0.9)'};
  background: ${checked ? 'rgb(68, 147, 248)' : 'transparent'};
  position: relative;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  &:hover {
    border-color: ${disabled ? (checked ? 'rgb(68, 147, 248)' : 'rgba(255, 255, 255, 0.9)') : 'rgb(68, 147, 248)'};
    ${!checked && !disabled ? 'background-color: rgba(68, 147, 248, 0.1);' : ''}
  }
  
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    opacity: ${checked ? 1 : 0};
    transition: opacity 0.15s ease;
  }
`;

const radioLabelStyle = css`
  font-size: 13px;
  color: #e5e7eb;
  font-weight: 400;
  line-height: 1.4;
  user-select: none;
`;

const radioGroupWrapperStyle = (direction: 'horizontal' | 'vertical') => css`
  display: flex;
  flex-direction: ${direction === 'vertical' ? 'column' : 'row'};
  gap: ${direction === 'vertical' ? '8px' : '4px 8px'};
  align-items: ${direction === 'vertical' ? 'flex-start' : 'center'};
`;

// Radio Component
export const Radio: React.FC<RadioProps> & { Group: React.FC<RadioGroupProps> } = ({
  value,
  checked: checkedProp,
  defaultChecked,
  disabled: disabledProp,
  onChange,
  children,
  className,
  style,
}) => {
  const groupContext = useContext(RadioGroupContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  
  // Determine if controlled by group or individual props
  const isControlledByGroup = groupContext && value !== undefined;
  const checked = isControlledByGroup 
    ? groupContext.value === value 
    : checkedProp !== undefined 
      ? checkedProp 
      : internalChecked;
  
  const disabled = disabledProp || groupContext?.disabled || false;
  const name = groupContext?.name;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (isControlledByGroup) {
      groupContext?.onChange?.(value);
    } else {
      if (checkedProp === undefined) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    }
  };
  
  return (
    <label 
      css={radioWrapperStyle} 
      className={`${className || ''} ${disabled ? 'disabled' : ''}`}
      style={style}
    >
      <input
        type="radio"
        css={hiddenInputStyle}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        name={name}
        value={value}
      />
      <span css={radioIconStyle(checked, disabled)} />
      {children && <span css={radioLabelStyle}>{children}</span>}
    </label>
  );
};

// Radio Group Component
const RadioGroup: React.FC<RadioGroupProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  disabled,
  name,
  children,
  className,
  style,
  direction = 'horizontal',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const value = valueProp !== undefined ? valueProp : internalValue;
  
  const handleChange = (newValue: any) => {
    if (valueProp === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const contextValue: RadioGroupContextValue = {
    value,
    onChange: handleChange,
    disabled,
    name,
  };
  
  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div 
        css={radioGroupWrapperStyle(direction)} 
        className={className}
        style={style}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Attach Group to Radio
Radio.Group = RadioGroup;

export default Radio;