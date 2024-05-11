import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentSong } from '../../store/reducers/playReducer';
import { fetchLyricData } from '../../api/song';
import Lyric from 'lyric-parser';
import { Song } from '../../types/song';

interface UseLyricProps {
  songReady: boolean;
  currentTime: number;
}

export const useLyric = ({ songReady, currentTime }: UseLyricProps) => {
  console.log('useLyric');
  const [currentLyric, setCurrentLyric] = useState<null | Lyric>(null);
  const [currentLineNum, setCurrentLineNum] = useState(0);
  const [playingLyric, setPlayingLyric] = useState(''); // 正在播放的歌词

  const currentSong: Song = useSelector(getCurrentSong);
  let lyric = '';

  const lyricContainerRef = useRef<HTMLDivElement>(null);

  // 歌词滚动
  useEffect(() => {
    if (lyricContainerRef.current && currentLineNum !== 0) {
      const currentLineElement = lyricContainerRef.current.querySelector(
        `[data-line="${currentLineNum}"]`,
      ) as HTMLElement;
      if (currentLineElement) {
        const containerHeight = lyricContainerRef.current.offsetHeight; //获取歌词容器的高度
        const lineHeight = currentLineElement.offsetHeight; //获取当前行的高度
        const scrollOffset = currentLineElement.offsetTop - containerHeight / 2 + lineHeight / 2;
        lyricContainerRef.current.scrollTo({
          top: scrollOffset,
          behavior: 'smooth',
        });
      }
    }
    console.log('currentLienNum：', currentLineNum);
  }, [currentLineNum]);

  // 初始化
  useEffect(() => {
    // 防止切歌歌词跳动:
    stopLyric();
    setCurrentLyric(null);
    setCurrentLineNum(0);
    setPlayingLyric('');

    if (currentSong !== null) {
      fetchLyricData(currentSong.id).then((v) => {
        lyric = v.data.lrc.lyric;
        const l = new Lyric(lyric, handleLyric);
        setCurrentLyric(l); // 使用lyric-parser库解析歌词
        const hasLyric = currentLyric?.lines.length; //判断是否有歌词
        if (hasLyric && songReady) {
          //当歌曲准备好
          playLyric();
        }
      });
    }
  }, [currentSong]);

  //歌词滚动函数
  function playLyric() {
    if (currentLyric) {
      console.log(currentTime * 1000);
      currentLyric.seek(currentTime * 1000); //找到对应的歌词
    }
  }

  function stopLyric() {
    if (currentLyric) {
      currentLyric.stop();
    }
  }

  // 歌词处理函数
  function handleLyric({ lineNum, txt }: { lineNum: number; txt: string }) {
    console.log('lineNum:', lineNum);
    setCurrentLineNum(lineNum);
    setPlayingLyric(txt); //当前播放歌词
  }

  return {
    currentLyric,
    currentLineNum,
    playingLyric,
    lyricContainerRef,
    playLyric,
    stopLyric,
  };
};
