import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentSong } from '../../store/reducers/playReducer';
import { fetchLyricData } from '../../api/song';
import Lyric from 'lyric-parser';
import { Song } from '../../types/song';
import BetterScroll, { BScrollInstance } from 'better-scroll';

interface UseLyricProps {
  songReady: boolean;
  currentTime: number;
  wrapperRef: React.RefObject<HTMLDivElement>;
  bsObj: BScrollInstance | undefined;
}

export const useLyric = ({ songReady, currentTime, wrapperRef, bsObj }: UseLyricProps) => {
  const [currentLyric, setCurrentLyric] = useState<null | Lyric>(null);
  const [currentLineNum, setCurrentLineNum] = useState(0);
  const [playingLyric, setPlayingLyric] = useState('');
  const lyricScrollRef = wrapperRef;
  const lyricListRef = useRef(null);

  const playState = useSelector((state: RootState) => state.playState);
  const currentSong: Song = useSelector(getCurrentSong);
  let lyric = '';

  useEffect(() => {
    //防止切歌歌词跳动:
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
    console.log(lineNum);
    setCurrentLineNum(lineNum);
    setPlayingLyric(txt); //当前播放歌词
    const listEl: HTMLElement | null = lyricListRef.current; // 拿到list dom实例
    if (listEl === null) {
      return;
    } else {
      if (lineNum > 7) {
        const lineEl = (listEl as HTMLElement).children[lineNum - 7];
        if (lineEl instanceof HTMLElement) {
          // @ts-ignore
          // bsObj.scrollToElement(lineEl, 1000);
        }
      } else {
        // @ts-ignore
        // bsObj.scrollTo(0, 0, 1000);
      }
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playingLyric,
    playLyric,
    stopLyric,
  };
};
