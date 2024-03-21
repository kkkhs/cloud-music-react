import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { RootState } from '../../store';

export default function useCd() {
  const playing = useSelector((state: RootState) => state.playState.playing);
  const cdWrapperRef = useRef(null);
  const cdRef = useRef(null);
  const [cdCls, setCdCls] = useState(!!playing);

  useEffect(() => {
    if (!playing && cdWrapperRef.current && cdRef.current) {
      syncTransform(cdWrapperRef.current, cdRef.current);
    }
    setCdCls(!!playing);
  }, [playing, cdWrapperRef, cdRef]);

  function syncTransform(wrapper: HTMLElement, inner: HTMLElement) {
    const wrapperTransform = getComputedStyle(wrapper).transform; // 获取外层旋转角度
    const innerTransform = getComputedStyle(inner).transform; // 内层相对外层旋转角度
    wrapper.style.transform = // 同步外层旋转角度
      wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform); // 字符串角度叠加
  }

  return {
    cdWrapperRef,
    cdRef,
    cdCls,
  };
}
