import { useEffect, useRef, useState } from 'react';

export const useScrollListener = (scrollThreshold: number) => {
  const scrollRef = useRef<HTMLDivElement>(null); // 修改此行
  const [scrollY, setScrollY] = useState(0);
  const [titleChange, setTitleChange] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && scrollRef.current) {
        // 修改此行
        const scrollTop = scrollRef.current.scrollTop; // 修改此行

        setScrollY(scrollTop);

        // 根据滚动高度改变标题颜色
        if (scrollTop > scrollThreshold) {
          setTitleChange(true);
        } else {
          setTitleChange(false);
        }
      }
    };

    if (scrollRef.current && scrollRef.current) {
      // 修改此行
      scrollRef.current.addEventListener('scroll', handleScroll); // 修改此行
    }

    // 清除监听器
    return () => {
      if (scrollRef.current && scrollRef.current) {
        // 修改此行
        scrollRef.current.removeEventListener('scroll', handleScroll); // 修改此行
      }
    };
  }, [scrollRef, scrollThreshold]);

  return { scrollY, titleChange, scrollRef };
};
