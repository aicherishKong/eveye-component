// 错误处理工具函数
export interface FetchError {
  message: string;
  code?: string;
  status?: number;
}

// 创建标准化的错误对象
export const createFetchError = (
  message: string,
  code?: string,
  status?: number
): FetchError => ({
  message,
  code,
  status,
});

// 错误处理包装器
export const withErrorHandling = async <T>(
  fetchFn: () => Promise<T>,
  fallbackValue: T,
  onError?: (error: FetchError) => void
): Promise<T> => {
  try {
    return await fetchFn();
  } catch (error) {
    let fetchError: FetchError;

    if (error instanceof Error) {
      // 网络错误
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        fetchError = createFetchError(
          "网络连接失败，请检查网络设置",
          "NETWORK_ERROR"
        );
      }
      // 超时错误
      else if (error.name === "AbortError") {
        fetchError = createFetchError("请求超时，请稍后重试", "TIMEOUT_ERROR");
      }
      // 其他错误
      else {
        fetchError = createFetchError(
          error.message || "未知错误",
          "UNKNOWN_ERROR"
        );
      }
    }
    // HTTP 状态错误
    else if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as any).status;
      switch (status) {
        case 400:
          fetchError = createFetchError("请求参数错误", "BAD_REQUEST", 400);
          break;
        case 401:
          fetchError = createFetchError("未授权访问", "UNAUTHORIZED", 401);
          break;
        case 403:
          fetchError = createFetchError("访问被拒绝", "FORBIDDEN", 403);
          break;
        case 404:
          fetchError = createFetchError("请求的资源不存在", "NOT_FOUND", 404);
          break;
        case 429:
          fetchError = createFetchError(
            "请求过于频繁，请稍后重试",
            "RATE_LIMIT",
            429
          );
          break;
        case 500:
          fetchError = createFetchError(
            "服务器内部错误",
            "INTERNAL_ERROR",
            500
          );
          break;
        case 502:
          fetchError = createFetchError("网关错误", "BAD_GATEWAY", 502);
          break;
        case 503:
          fetchError = createFetchError(
            "服务暂时不可用",
            "SERVICE_UNAVAILABLE",
            503
          );
          break;
        default:
          fetchError = createFetchError(
            `请求失败 (${status})`,
            "HTTP_ERROR",
            status
          );
      }
    }
    // 兜底错误
    else {
      fetchError = createFetchError(
        "发生未知错误，请稍后重试",
        "UNKNOWN_ERROR"
      );
    }

    // 调用错误回调
    onError?.(fetchError);

    // 返回兜底值
    return fallbackValue;
  }
};

// 带超时的 fetch 包装器
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw { status: response.status, statusText: response.statusText };
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// 重试机制
export const withRetry = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;

      // 如果是最后一次重试，直接抛出错误
      if (i === maxRetries) {
        throw error;
      }

      // 等待一段时间后重试
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }

  throw lastError;
};

// 键盘导航工具函数
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onTab?: () => void;
    onBackspace?: () => void;
  }
) => {
  const { onEnter, onEscape, onArrowUp, onArrowDown, onTab, onBackspace } =
    options;

  switch (event.key) {
    case "Enter":
      event.preventDefault();
      onEnter?.();
      break;
    case "Escape":
      event.preventDefault();
      onEscape?.();
      break;
    case "ArrowUp":
      event.preventDefault();
      onArrowUp?.();
      break;
    case "ArrowDown":
      event.preventDefault();
      onArrowDown?.();
      break;
    case "Tab":
      onTab?.();
      break;
    case "Backspace":
      onBackspace?.();
      break;
  }
};

// 防抖函数增强版
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } => {
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let maxTimeoutId: number | undefined;
  let result: ReturnType<T> | undefined;
  let timerId: number | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = +wait || 0;
  if (typeof options === "object") {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    const maxWait = maxing ? Math.max(+(options.maxWait ?? 0), wait) : 0;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args || []);
    return result;
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, (options.maxWait ?? 0) - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= (options.maxWait ?? 0))
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced as T & {
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
  };
};
