/** @jsxImportSource @emotion/react */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { css } from "@emotion/react";

// Types
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  avatar?: string;
  [key: string]: any;
}

export interface SelectProps {
  value?: any | any[];
  defaultValue?: any | any[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  multiple?: boolean;
  size?: "small" | "middle" | "large";
  options?: SelectOption[];
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  onSearch?: (value: string) => void;
  onChange?: (value: any, option: SelectOption | SelectOption[]) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onDropdownVisibleChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  maxTagCount?: number;
  notFoundContent?: React.ReactNode;
  searchValue?: string;
  onClear?: () => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  renderTag?: (option: SelectOption) => React.ReactNode;
}

// Size configurations
const sizeConfig = {
  small: {
    height: "24px",
    fontSize: "12px",
    padding: "0 7px",
  },
  middle: {
    height: "32px",
    fontSize: "14px",
    padding: "0 11px",
  },
  large: {
    height: "40px",
    fontSize: "16px",
    padding: "0 15px",
  },
};

// Styles
const selectWrapperStyle = (
  size: "small" | "middle" | "large",
  disabled: boolean,
  focused: boolean,
  multiple: boolean
) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 120px;
  min-height: ${sizeConfig[size].height};
  ${multiple ? "height: auto;" : `height: ${sizeConfig[size].height};`}
  background: ${disabled
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${focused ? "rgb(68, 147, 248)" : "rgba(255, 255, 255, 0.3)"};
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: ${disabled ? "not-allowed" : "pointer"};

  &:hover {
    border-color: ${disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "rgb(68, 147, 248)"};
  }

  ${disabled ? "opacity: 0.6;" : ""}
`;

const selectContentStyle = (
  size: "small" | "middle" | "large",
  multiple: boolean
) => css`
  flex: 1;
  display: flex;
  align-items: center;
  ${multiple ? "flex-wrap: wrap;" : ""}
  padding: ${multiple ? "2px 4px" : sizeConfig[size].padding};
  min-height: ${multiple
    ? "calc(" + sizeConfig[size].height + " - 4px)"
    : "auto"};
  gap: ${multiple ? "4px" : "0"};
  overflow: hidden;
`;

const selectInputStyle = (
  size: "small" | "middle" | "large",
  multiple: boolean = false
) => css`
  flex: 1;
  min-width: 4px;
  height: ${multiple ? "20px" : "auto"};
  font-size: ${sizeConfig[size].fontSize};
  color: #e5e7eb;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const selectTagStyle = css`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  background: rgba(68, 147, 248, 0.2);
  border: 1px solid rgba(68, 147, 248, 0.4);
  border-radius: 3px;
  font-size: 12px;
  color: #e5e7eb;
  white-space: nowrap;

  .tag-close {
    margin-left: 4px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: #fff;
    }
  }
`;

const selectArrowStyle = (open: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease;
  transform: ${open ? "rotate(180deg)" : "rotate(0deg)"};
  font-size: 12px;
`;

const selectClearStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
  }
`;

const dropdownStyle = css`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 4px;
  max-height: 256px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const optionStyle = (
  selected: boolean,
  highlighted: boolean,
  disabled: boolean
) => css`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  color: ${disabled ? "#666" : selected ? "rgb(68, 147, 248)" : "#e5e7eb"};
  background: ${highlighted ? "rgba(68, 147, 248, 0.1)" : "transparent"};
  cursor: ${disabled ? "not-allowed" : "pointer"};
  transition: all 0.15s ease;

  &:hover {
    background: ${disabled ? "transparent" : "rgba(68, 147, 248, 0.1)"};
  }

  ${selected ? "font-weight: 500;" : ""}
`;

const loadingStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const emptyStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
`;

// Helper functions
const defaultFilterOption = (input: string, option: SelectOption): boolean => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const getOptionLabel = (option: SelectOption): string => {
  return option.label || String(option.value);
};

const isOptionSelected = (
  option: SelectOption,
  value: any,
  multiple: boolean
): boolean => {
  if (multiple) {
    return Array.isArray(value) && value.some((v) => v === option.value);
  }
  return value === option.value;
};

// Select Component
const Select: React.FC<SelectProps> = ({
  value: valueProp,
  defaultValue,
  placeholder = "请选择",
  disabled = false,
  loading = false,
  allowClear = false,
  showSearch = false,
  multiple = false,
  size = "middle",
  options = [],
  filterOption = true,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  onDropdownVisibleChange,
  className,
  style,
  dropdownStyle: dropdownStyleProp,
  maxTagCount,
  notFoundContent = "无数据",
  searchValue: searchValueProp,
  onClear,
  renderOption,
  renderTag,
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (multiple ? [] : undefined)
  );
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const value = valueProp !== undefined ? valueProp : internalValue;
  const currentSearchValue =
    searchValueProp !== undefined ? searchValueProp : searchValue;

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!currentSearchValue || !filterOption) {
      return options;
    }

    if (typeof filterOption === "function") {
      return options.filter((option) =>
        filterOption(currentSearchValue, option)
      );
    }

    return options.filter((option) =>
      defaultFilterOption(currentSearchValue, option)
    );
  }, [options, currentSearchValue, filterOption]);

  // Get selected options for display
  const selectedOptions = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return value
        .map((v) => options.find((opt) => opt.value === v))
        .filter(Boolean) as SelectOption[];
    }
    if (!multiple && value !== undefined) {
      return options.find((opt) => opt.value === value);
    }
    return multiple ? [] : undefined;
  }, [value, options, multiple]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Handle dropdown visibility change
  useEffect(() => {
    onDropdownVisibleChange?.(open);
  }, [open, onDropdownVisibleChange]);

  // Handle search
  const handleSearch = useCallback(
    (searchVal: string) => {
      if (searchValueProp === undefined) {
        setSearchValue(searchVal);
      }
      onSearch?.(searchVal);
    },
    [onSearch, searchValueProp]
  );

  // Handle option select
  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;

    let newValue: any;
    let newOption: SelectOption | SelectOption[];

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);

      if (isSelected) {
        newValue = currentValues.filter((v) => v !== option.value);
        newOption = (selectedOptions as SelectOption[]).filter(
          (opt) => opt.value !== option.value
        );
      } else {
        newValue = [...currentValues, option.value];
        newOption = [...(selectedOptions as SelectOption[]), option];
      }
    } else {
      newValue = option.value;
      newOption = option;
      setOpen(false);
    }

    if (valueProp === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue, newOption);

    // Clear search after selection
    if (!multiple) {
      handleSearch("");
    }
  };

  // Handle tag remove
  const handleTagRemove = (optionValue: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((v) => v !== optionValue);
      const newOption = (selectedOptions as SelectOption[]).filter(
        (opt) => opt.value !== optionValue
      );

      if (valueProp === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue, newOption);
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    const newValue = multiple ? [] : undefined;
    const newOption = multiple ? [] : undefined;

    if (valueProp === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue, newOption as any);
    onClear?.();
    handleSearch("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;

      case "Enter":
        e.preventDefault();
        if (
          open &&
          highlightedIndex >= 0 &&
          filteredOptions[highlightedIndex]
        ) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (!open) {
          setOpen(true);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;

      case "Backspace":
        if (
          multiple &&
          Array.isArray(value) &&
          value.length > 0 &&
          !currentSearchValue
        ) {
          const lastValue = value[value.length - 1];
          handleTagRemove(lastValue, e as any);
        }
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    handleSearch(inputValue);

    if (!open) {
      setOpen(true);
    }
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent) => {
    setFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent) => {
    setFocused(false);
    onBlur?.(e);
  };

  // Render selected value
  const renderSelectedValue = () => {
    if (multiple) {
      const tags = selectedOptions as SelectOption[];
      const visibleTags = maxTagCount ? tags.slice(0, maxTagCount) : tags;
      const hiddenCount =
        maxTagCount && tags.length > maxTagCount
          ? tags.length - maxTagCount
          : 0;

      return (
        <>
          {visibleTags.map((option) => (
            <span key={option.value} css={selectTagStyle}>
              {renderTag ? renderTag(option) : getOptionLabel(option)}
              <span
                className="tag-close"
                onClick={(e) => handleTagRemove(option.value, e)}
              >
                ×
              </span>
            </span>
          ))}
          {hiddenCount > 0 && <span css={selectTagStyle}>+{hiddenCount}</span>}
        </>
      );
    }

    if (selectedOptions && !multiple) {
      return renderTag && !Array.isArray(selectedOptions)
        ? renderTag(selectedOptions as SelectOption)
        : getOptionLabel(selectedOptions as SelectOption);
    }

    return null;
  };

  // Check if should show placeholder
  const shouldShowPlaceholder = () => {
    if (multiple) {
      return Array.isArray(value) && value.length === 0;
    }
    return value === undefined || value === null;
  };

  // Check if should show clear button
  const shouldShowClear = () => {
    if (!allowClear || disabled) return false;

    if (multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== null;
  };

  return (
    <div
      ref={selectRef}
      css={selectWrapperStyle(size, disabled, focused, multiple)}
      className={className}
      style={style as any}
      onClick={() => {
        if (!disabled) {
          setOpen(!open);
          inputRef.current?.focus();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div css={selectContentStyle(size, multiple)}>
        {renderSelectedValue()}

        {(showSearch || open) && (
          <input
            ref={inputRef}
            css={selectInputStyle(size, multiple)}
            value={currentSearchValue}
            placeholder={shouldShowPlaceholder() ? placeholder : ""}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={
              {
                width: shouldShowPlaceholder() ? "100%" : "auto",
              } as any
            }
          />
        )}

        {!showSearch && !open && shouldShowPlaceholder() && (
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
            {placeholder}
          </span>
        )}
      </div>

      {shouldShowClear() && (
        <span css={selectClearStyle} onClick={handleClear}>
          ×
        </span>
      )}

      <span css={selectArrowStyle(open)}>▼</span>

      {open && (
        <div ref={dropdownRef} css={[dropdownStyle, dropdownStyleProp]}>
          {loading ? (
            <div css={loadingStyle}>加载中...</div>
          ) : filteredOptions.length === 0 ? (
            <div css={emptyStyle}>{notFoundContent}</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                css={optionStyle(
                  isOptionSelected(option, value, multiple),
                  index === highlightedIndex,
                  option.disabled || false
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(option);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {renderOption ? renderOption(option) : getOptionLabel(option)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
