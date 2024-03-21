import React, { useRef, useState } from 'react';

interface Style {
  opacity?: number;
  transform?: string;
  transitionDuration?: string;
}

export default function useMiddleInteractive() {
  const [currentShow, setCurrentShow] = useState('cd');
  const [middleLStyle, setMiddleLStyle] = useState<Style>();
  const [middleRStyle, setMiddleRStyle] = useState<Style>();

  const touch = {
    startX: 0,
    startY: 0,
    directionLocked: '',
    percent: 0,
  };
  let currentView = 'cd';

  function onMiddleTouchStart(e: React.TouchEvent) {
    touch.startX = e.touches[0].pageX;
    touch.startY = e.touches[0].pageY; //禁止纵向滚动
    touch.directionLocked = ''; // 定义方向锁
    console.log(touch);
  }
  function onMiddleTouchMove(e: React.TouchEvent) {
    const deltaX = e.touches[0].pageX - touch.startX; // 拖动偏移量
    const deltaY = e.touches[0].pageY - touch.startY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'; // 横向或纵向
    }

    if (touch.directionLocked === 'v') {
      // y向禁止
      return; //只有当x偏移量大于y，该次滑动才有效
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth; // 0或屏幕宽度
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)); // 歌词列表层偏移量
    touch.percent = Math.abs(offsetWidth / window.innerWidth); //  偏移比例

    // 判断currentShow的改变
    if (currentView === 'cd') {
      console.log(touch.percent);
      if (touch.percent > 0.02) {
        setCurrentShow('lyric');
      } else {
        setCurrentShow('cd');
      }
    } else {
      if (touch.percent < 0.08) {
        setCurrentShow('cd');
      } else {
        setCurrentShow('lyric');
      }
    }

    setMiddleLStyle({
      opacity: 1 - touch.percent,
      transitionDuration: '0ms',
    });

    setMiddleRStyle({
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0ms',
    });
  }
  function onMiddleTouchEnd() {
    let offsetWidth;
    let opacity;
    if (currentShow === 'cd') {
      currentView = 'cd';
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = 'lyric';
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    const duration = 300;
    setMiddleLStyle({
      opacity,
      transitionDuration: `${duration}ms`,
    });

    setMiddleRStyle({
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
    });
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
