/*
    处理异步操作的简单的 React Hook
*/
import { useEffect, useState } from 'react';

interface useAsyncProps<T> {
  asyncFn: () => Promise<T>;
  initValue: T;
  immediate?: boolean;
}

export function useAsync<T>({ asyncFn, initValue, immediate = true }: useAsyncProps<T>) {
  const [isLoading, setIsLoading] = useState(false); //表示异步操作是否进行中的布尔值
  const [data, setData] = useState<T>(initValue); //保存异步操作的结果数据
  const [error, setError] = useState<Error | null>(null); //保存异步操作的错误信息

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []); // 确保只在组件挂载时执行一次

  const execute = async function () {
    setIsLoading(true);
    setError(null);
    try {
      const res = await asyncFn();
      setData(res);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    data,
    error,
    execute,
  };
}
