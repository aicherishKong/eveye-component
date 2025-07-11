/** @jsxImportSource @emotion/react */
import React, { useState, useMemo, useRef, useCallback } from "react";
import { Global } from "@emotion/react";
import RcSelect from "rc-select";
import type { SelectProps as RcSelectProps } from "rc-select";
import Avatar from "../avatar";
import Spin from "../spin";
import { customSelectStyles, selectOptionItem } from "./styles";
import {
  withErrorHandling,
  withRetry,
  debounce,
  handleKeyboardNavigation,
  type FetchError,
} from "./utils";
import "rc-select/assets/index.css";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<RcSelectProps<ValueType>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  // 错误处理相关
  onError?: (error: FetchError) => void;
  retryCount?: number;
  timeout?: number;
  fallbackOptions?: ValueType[];
  // 键盘导航相关
  enableKeyboardNavigation?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// 样式已移至 ./styles.ts 文件

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    avatar?: string;
  } = any
>({
  fetchOptions,
  debounceTimeout = 300,
  onError,
  retryCount = 2,
  timeout = 10000,
  fallbackOptions = [],
  enableKeyboardNavigation = true,
  onKeyDown,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const [error, setError] = useState<FetchError | null>(null);
  const fetchRef = useRef(0);

  // 错误处理回调
  const handleError = useCallback(
    (fetchError: FetchError) => {
      setError(fetchError);
      onError?.(fetchError);
      console.warn("DebounceSelect fetch error:", fetchError);
    },
    [onError]
  );

  // 增强的数据获取函数
  const enhancedFetchOptions = useCallback(
    async (search: string): Promise<ValueType[]> => {
      return withRetry(
        () =>
          withErrorHandling(
            () => fetchOptions(search),
            fallbackOptions,
            handleError
          ),
        retryCount
      );
    },
    [fetchOptions, fallbackOptions, handleError, retryCount]
  );

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      setError(null);

      try {
        const newOptions = await enhancedFetchOptions(value);

        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
      } catch (err) {
        if (fetchId === fetchRef.current) {
          setOptions(fallbackOptions);
        }
      } finally {
        if (fetchId === fetchRef.current) {
          setFetching(false);
        }
      }
    };

    return debounce(loadOptions, debounceTimeout);
  }, [enhancedFetchOptions, debounceTimeout, fallbackOptions]);

  // 键盘导航处理
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (enableKeyboardNavigation) {
        handleKeyboardNavigation(event.nativeEvent, {
          onEscape: () => {
            // 清空搜索并关闭下拉框
            const selectElement = event.currentTarget as HTMLElement;
            const input = selectElement.querySelector("input");
            if (input) {
              input.blur();
            }
          },
          onEnter: () => {
            // Enter 键行为由 rc-select 内部处理
          },
          onArrowUp: () => {
            // 箭头键行为由 rc-select 内部处理
          },
          onArrowDown: () => {
            // 箭头键行为由 rc-select 内部处理
          },
          onBackspace: () => {
            // 退格键行为由 rc-select 内部处理
          },
        });
      }

      // 调用用户自定义的键盘事件处理
      onKeyDown?.(event);
    },
    [enableKeyboardNavigation, onKeyDown]
  );

  // 生成错误提示内容
  const getNotFoundContent = () => {
    if (fetching) {
      return <Spin size="small" />;
    }
    if (error) {
      return (
        <div
          style={{
            padding: "8px 12px",
            color: "var(--debounce-select-text-danger, #f85149)",
            textAlign: "center" as const,
            fontSize: "12px",
          }}
        >
          {error.message}
        </div>
      );
    }
    return "暂无数据";
  };

  return (
    <>
      <Global styles={customSelectStyles} />
      <RcSelect
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={getNotFoundContent()}
        onKeyDown={handleKeyDown}
        {...props}
        options={options}
        optionRender={(option) => (
          <div
            css={selectOptionItem}
            tabIndex={enableKeyboardNavigation ? 0 : -1}
            role="option"
            aria-selected={false}
          >
            {option.data.avatar && (
              <div className="user-avatar">
                <Avatar src={option.data.avatar} size={24} />
              </div>
            )}
            <span className="user-name">{option.label}</span>
          </div>
        )}
        className={`custom-select ${props.className || ""}`}
        // 增强无障碍性
        aria-label={props["aria-label"] || "搜索选择器"}
        aria-describedby={error ? "debounce-select-error" : undefined}
      />
      {/* 错误信息的无障碍描述 */}
      {error && (
        <div
          id="debounce-select-error"
          style={{ display: "none" }}
          aria-live="polite"
        >
          {error.message}
        </div>
      )}
    </>
  );
}

export default DebounceSelect;
