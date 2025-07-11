import { css } from "@emotion/react";

// CSS 变量定义 - 便于主题切换
export const cssVariables = css`
  :root {
    /* 基础颜色 */
    --debounce-select-bg-primary: #0d1117;
    --debounce-select-bg-secondary: #161b22;
    --debounce-select-bg-tertiary: #21262d;

    /* 边框颜色 */
    --debounce-select-border-default: #3d444d;
    --debounce-select-border-hover: #58a6ff;
    --debounce-select-border-focus: #1f6feb;
    --debounce-select-border-item: #30363d;

    /* 文本颜色 */
    --debounce-select-text-primary: #f0f6fc;
    --debounce-select-text-secondary: #7d8590;
    --debounce-select-text-disabled: #484f58;
    --debounce-select-text-selected: #58a6ff;
    --debounce-select-text-danger: #f85149;

    /* 阴影和效果 */
    --debounce-select-shadow-focus: 0 0 0 2px rgba(31, 111, 235, 0.15);
    --debounce-select-shadow-dropdown: 0 16px 32px rgba(1, 4, 9, 0.85);

    /* 尺寸 */
    --debounce-select-border-radius: 6px;
    --debounce-select-border-radius-lg: 8px;
    --debounce-select-padding-x: 8px;
    --debounce-select-padding-x-lg: 12px;
    --debounce-select-padding-y: 6px;
    --debounce-select-min-height: 36px;

    /* 过渡动画 */
    --debounce-select-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
`;

// 主选择器样式
export const selectorStyles = css`
  .custom-select .rc-select-selector {
    position: relative;
    background-color: var(--debounce-select-bg-primary);
    border: 1px solid var(--debounce-select-border-default);
    border-radius: var(--debounce-select-border-radius);
    transition: var(--debounce-select-transition);
    padding: var(--debounce-select-padding-y) var(--debounce-select-padding-x);
    min-height: var(--debounce-select-min-height);
    display: flex;
    align-items: center;
    color: var(--debounce-select-text-primary);
  }

  .custom-select .rc-select-selector:hover {
    // border-color: var(--debounce-select-border-hover);
    // background-color: var(--debounce-select-bg-secondary);
  }

  .custom-select.rc-select-focused .rc-select-selector {
    background-color: var(--debounce-select-bg-primary);
    border-color: var(--debounce-select-border-focus) !important;
    outline: 0;
  }

  /* 键盘导航增强 */
  .custom-select.rc-select-focused .rc-select-selector:focus-visible {
    outline: 2px solid var(--debounce-select-border-focus);
    outline-offset: 2px;
  }
`;

// 占位符和箭头样式
export const placeholderAndArrowStyles = css`
  .custom-select .rc-select-selection-placeholder {
    color: var(--debounce-select-text-secondary);
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: var(--debounce-select-padding-x-lg);
    right: 24px;
    transform: translateY(-50%);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    z-index: 1;
  }

  .custom-select .rc-select-arrow {
    color: var(--debounce-select-text-secondary);
    font-size: 12px;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    position: absolute;
    top: 50%;
    right: var(--debounce-select-padding-x);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .custom-select.rc-select-open .rc-select-arrow {
    transform: rotate(180deg);
  }

  .custom-select .rc-select-arrow .rc-select-arrow-icon::after {
    content: "";
    border: 4px solid transparent;
    border-top-color: currentColor;
    display: inline-block;
  }
`;

// 多选标签样式
export const multiSelectStyles = css`
  .custom-select .rc-select-selection-overflow {
    position: relative;
    display: flex;
    flex: auto;
    flex-wrap: wrap;
    max-width: 100%;
    align-items: center;
  }

  .custom-select .rc-select-selection-overflow-item {
    flex: none;
    align-self: center;
    max-width: 100%;
  }

  .custom-select .rc-select-selection-overflow-item-suffix {
    flex: 1;
    min-width: 0;
  }

  .custom-select .rc-select-selection-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 24px;
    margin: 2px 4px 2px 0;
    padding: 0 7px;
    color: #f0f6fc !important;
    font-weight: normal;
    font-size: 12px;
    line-height: 22px;
    background: color-mix(in srgb, #656c76 20%, transparent) !important;
    border: 1px solid var(--debounce-select-border-item);
    border-radius: var(--debounce-select-border-radius);
    cursor: default;
    transition: font-size 0.2s ease, line-height 0.2s ease, height 0.2s ease;
    user-select: none;
    max-width: 100%;
  }

  .custom-select .rc-select-selection-item-content {
    display: inline-block;
    margin-right: 4px;
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
  }

  .custom-select .rc-select-selection-item-remove {
    color: var(--debounce-select-text-secondary);
    font-weight: bold;
    font-size: 10px;
    line-height: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    transition: all 0.2s;
  }

  .custom-select .rc-select-selection-item-remove:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* 键盘导航 - 标签删除按钮 */
  .custom-select .rc-select-selection-item-remove:focus-visible {
    outline: 1px solid var(--debounce-select-border-focus);
    outline-offset: 1px;
  }
`;

// 下拉面板样式
export const dropdownStyles = css`
  .rc-select-dropdown {
    position: absolute;
    top: -9999px;
    left: -9999px;
    z-index: 1050;
    box-sizing: border-box;
    padding: 4px;
    overflow: hidden;
    font-variant: initial;
    background-color: #151b23;
    border: 1px solid color-mix(in srgb, #3d444d 70%, transparent);
    border-radius: 6px;
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    font-size: 14px;
    line-height: 1.5715;
  }

  .rc-select-item {
    position: relative;
    display: block;
    min-height: 20px;
    padding: 2px 8px;
    color: var(--debounce-select-text-primary);
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    box-sizing: border-box;
    cursor: pointer;
    transition: background 0.3s ease;
    border-radius: 6px;
    margin: 1px 4px;
  }

  .rc-select-item:hover {
    background-color: var(--debounce-select-bg-tertiary);
  }

  .rc-select-item-option-active {
    background-color: var(--debounce-select-bg-tertiary);
  }

  .rc-select-item-option-selected {
    color: var(--debounce-select-text-selected);
    font-weight: 500;
    background-color: rgba(88, 166, 255, 0.1);
  }

  .rc-select-item-option-disabled {
    color: var(--debounce-select-text-disabled);
    cursor: not-allowed;
  }

  .rc-select-item-empty {
    color: var(--debounce-select-text-secondary);
    text-align: center;
  }

  /* 键盘导航增强 */
  .rc-select-item:focus-visible {
    outline: 2px solid var(--debounce-select-border-focus);
    outline-offset: -2px;
  }

  /* 加载状态 */
  .rc-select-item-option .rc-select-item-option-state {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

// 搜索框样式
export const searchInputStyles = css`
  .custom-select .rc-select-selection-search {
    position: relative;
    max-width: 100%;
    margin-inline-start: 0;
    flex: 1;
  }

  .custom-select .rc-select-selection-search-input {
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    background: transparent !important;
    border: none;
    outline: none;
    cursor: auto;
    color: var(--debounce-select-text-primary);
    height: 22px;
    min-width: 4px;
    width: 100%;
    box-shadow: none !important;
  }

  .custom-select .rc-select-selection-search-input:focus {
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .custom-select .rc-select-selection-search-input:-webkit-autofill,
  .custom-select .rc-select-selection-search-input:-webkit-autofill:hover,
  .custom-select .rc-select-selection-search-input:-webkit-autofill:focus,
  .custom-select .rc-select-selection-search-input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px var(--debounce-select-bg-primary) inset !important;
    -webkit-text-fill-color: var(--debounce-select-text-primary) !important;
    background-color: transparent !important;
  }

  .custom-select .rc-select-selection-search-input::placeholder {
    color: var(--debounce-select-text-secondary);
  }

  .custom-select .rc-select-selection-search-mirror {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    white-space: pre;
    visibility: hidden;
  }
`;

// 组合所有样式
export const customSelectStyles = css`
  ${cssVariables}
  ${selectorStyles}
  ${placeholderAndArrowStyles}
  ${multiSelectStyles}
  ${dropdownStyles}
  ${searchInputStyles}
`;

// 选项项样式（用于 optionRender）
export const selectOptionItem = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 5px 12px;
  color: var(--debounce-select-text-primary);
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 0;

  &:hover {
    background-color: var(--debounce-select-bg-tertiary);
  }

  .user-avatar {
    margin-right: 8px;
    flex-shrink: 0;
  }

  .user-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 键盘导航支持 */
  &:focus-visible {
    outline: 2px solid var(--debounce-select-border-focus);
    outline-offset: -2px;
  }
`;
