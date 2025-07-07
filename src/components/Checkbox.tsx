/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

// Checkbox 组件的 Props 类型
export interface CheckboxProps {
  checked?: boolean
  disabled?: boolean
  value?: string | number
  children?: React.ReactNode
  onChange?: (checked: boolean, value?: string | number) => void
}

// CheckboxGroup 组件的 Props 类型
export interface CheckboxGroupProps {
  options: Array<{ label: string; value: string | number; disabled?: boolean }>
  value?: Array<string | number>
  onChange?: (checkedValues: Array<string | number>) => void
  disabled?: boolean
}

// 样式定义
const checkboxWrapperStyle = (disabled?: boolean) => css`
  display: inline-flex;
  align-items: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  opacity: ${disabled ? 0.5 : 1};
  user-select: none;
  margin-right: 12px;
  margin-bottom: 6px;
  transition: opacity 0.15s ease;
`

const hiddenInputStyle = css`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`

const checkboxIconStyle = (checked?: boolean, disabled?: boolean) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid ${checked ? 'rgb(68, 147, 248)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 3px;
  background-color: ${checked ? 'rgb(68, 147, 248)' : 'transparent'};
  transition: all 0.15s ease;
  margin-right: 6px;
  
  &:hover {
    border-color: ${disabled ? 'rgba(255, 255, 255, 0.9)' : 'rgb(68, 147, 248)'};
    ${!checked && !disabled ? 'background-color: rgba(255, 255, 255, 0.1);' : ''}
  }
  
  svg {
    width: 12px;
    height: 12px;
    opacity: ${checked ? 1 : 0};
    transition: opacity 0.15s ease;
  }
`

const checkboxLabelStyle = css`
  font-size: 13px;
  color: #e5e7eb;
  font-weight: 400;
  line-height: 1.4;
`

const checkboxGroupWrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: flex-start;
`

// 单个 Checkbox 组件
export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  value,
  children,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked, value)
    }
  }

  return (
    <label css={checkboxWrapperStyle(disabled)}>
      <input
        css={hiddenInputStyle}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span css={checkboxIconStyle(checked, disabled)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="none" stroke="white" strokeWidth="3" d="M1.73 12.91l6.37 6.37L22.79 4.59" />
        </svg>
      </span>
      {children && <span css={checkboxLabelStyle}>{children}</span>}
    </label>
  )
}

// CheckboxGroup 组件
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  disabled = false
}) => {
  const handleCheckboxChange = (checked: boolean, checkboxValue?: string | number) => {
    if (!onChange || checkboxValue === undefined) return
    
    let newValue: Array<string | number>
    
    if (checked) {
      // 添加到选中列表
      newValue = [...value, checkboxValue]
    } else {
      // 从选中列表移除
      newValue = value.filter(v => v !== checkboxValue)
    }
    
    onChange(newValue)
  }

  return (
    <div css={checkboxGroupWrapperStyle}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={value.includes(option.value)}
          disabled={disabled || option.disabled}
          value={option.value}
          onChange={handleCheckboxChange}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  )
}

export default CheckboxGroup