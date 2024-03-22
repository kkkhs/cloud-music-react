import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentSong } from '../../store/reducers/playReducer';
import useMode from './use-mode';
import useCd from './use-cd';
import { fetchSongUrl } from '../../api/song';
import { PLAY_MODE } from '../../utils/const';
import { DownOutline, HeartOutline, UndoOutline } from 'antd-mobile-icons';
import { formatArtistName } from '../../utils/format-artist-name';
import { formatTime } from '../../utils/format-time';
import { Song } from '../../types/song';
import cdImage from 'assets/R.png';
import { Slider } from 'antd-mobile';
import { CSSTransition } from 'react-transition-group';
import {
  BugOutlined,
  DashOutlined,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  StepBackwardOutlined,
  StepForwardOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useLyric } from './use-lyric';
import BetterScroll, { BScrollInstance } from 'better-scroll';
import useMiddleInteractive from './use-middle-interactive';
import { MiniPlayer } from './mini-player';
import usePlayHistory from './use-play-history';
import { PlayList } from './play-list';
import { useLike } from './use-like';

interface BarRef {
  setOffset: (offset: number) => void;
}

export const Player = () => {
  const audioRef: RefObject<HTMLAudioElement> = useRef(null);
  const barRef: RefObject<BarRef> = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [songReady, setSongReady] = useState(false);
  const [progressChanging, setProgressChanging] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // redux
  const playState = useSelector((state: RootState) => state.playState);
  const fullScreen = useSelector((state: RootState) => state.playState.fullScreen);
  const currentSong: Song = useSelector(getCurrentSong);
  const playing = useSelector((state: RootState) => state.playState.playing);
  const currentIndex = useSelector((state: RootState) => state.playState.currentIndex);
  const playList = useSelector((state: RootState) => state.playState.playList);
  const playMode = useSelector((state: RootState) => state.playState.playMode);
  const dispatch = useDispatch();

  // hooks
  const { changeMode } = useMode();
  const { cdWrapperRef, cdRef, cdCls } = useCd();
  const { currentLyric, currentLineNum, playingLyric, lyricContainerRef, playLyric, stopLyric } =
    useLyric({ songReady, currentTime });
  const {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  } = useMiddleInteractive();
  const { savePlay } = usePlayHistory();
  const { isLiked, toggleLike } = useLike();

  // console.log(currentLineNum);

  // 进度 0-1
  const progress = currentTime / (currentSong?.dt / 1000);

  useEffect(() => {
    if (currentSong && currentSong.id) {
      fetchSongUrl(currentSong.id).then((v) => {
        const songUrl = v.data.data[0].url;
        setCurrentTime(0);
        setSongReady(false);
        const audioEl = audioRef.current;
        if (audioEl) {
          audioEl.src = songUrl;
          audioEl.play();
        }
        dispatch({
          type: 'SET_PLAYING',
          payload: {
            playing: true,
          },
        });
      });
    }
  }, [currentSong]);

  useEffect(() => {
    if (!songReady) {
      return;
    }

    const audioEl = audioRef.current;
    if (audioEl) {
      if (playing) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    }
  }, [playing, songReady, audioRef]);

  // 全屏刷新进度条
  useEffect(() => {
    if (fullScreen) {
      const timerId = setTimeout(() => {
        barRef.current?.setOffset(progress);
      }, 0);

      return () => clearTimeout(timerId);
    }
  }, [fullScreen, progress, barRef]);

  //播放暂停切换
  const togglePlay = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!songReady) {
      return;
    }
    dispatch({
      type: 'SET_PLAYING',
      payload: {
        playing: !playing,
      },
    });
    // console.log(playState);
  };

  //当audio被强迫关闭(待机...)
  const pause = () => {
    dispatch({
      type: 'SET_PLAYING',
      payload: {
        playing: false,
      },
    });
  };

  // 单曲循环
  const loop = () => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }
    dispatch({
      type: 'SET_PLAYING',
      payload: {
        playing: true,
      },
    });
  };

  // 前一首歌
  const prev = () => {
    const list = playList;
    console.log(playState);
    console.log(songReady);
    if (!songReady || !list.length) {
      return;
    }

    if (list.length === 1) {
      loop();
    } else {
      let index = currentIndex - 1;
      if (index === -1) {
        index = list.length - 1;
      }
      dispatch({
        type: 'SET_CURRENT_INDEX', //修改当前播放序号
        payload: {
          index: index,
        },
      });
      if (!playing) {
        //如果当前暂停
        dispatch({
          type: 'SET_PLAYING', //修改为播放
          payload: {
            playing: true,
          },
        });
      }
    }
  };

  // 下一首歌
  const next = () => {
    const list = playList;
    if (!songReady || !list.length) {
      return;
    }

    if (list.length === 1) {
      loop();
    } else {
      let index = currentIndex + 1;
      if (index === list.length) {
        index = 0;
      }
      dispatch({
        type: 'SET_CURRENT_INDEX', //修改当前播放序号
        payload: {
          index: index,
        },
      });
      if (!playing) {
        //当前暂停
        dispatch({
          type: 'SET_PLAYING', //修改为播放
          payload: {
            playing: true,
          },
        });
      }
    }
  };

  // 控制audio的canplay属性
  const ready = () => {
    console.log('ready');
    if (songReady) {
      //避免多次ready
      return;
    }
    setSongReady(true);
    playLyric();
    savePlay(currentSong); // 保存最近播放
  };

  //播放出现问题
  const error = () => {
    setSongReady(true);
  };

  //更新播放时间
  const updateTime = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    if (!progressChanging) {
      setCurrentTime(e.currentTarget.currentTime);
    }
  };

  // 进度条拖动ing
  const onProgressChanging = (value: number | number[]) => {
    setProgressChanging(true);
    // 左侧实时改变
    if (typeof value === 'number') {
      setCurrentTime((currentSong.dt / 100000) * value);
      playLyric(); //歌词实时同步
      stopLyric();
    }
  };

  //歌曲播放时间改变后
  const onProgressChanged = (value: number | number[]) => {
    setProgressChanging(false);
    if (typeof value === 'number') {
      if (audioRef.current) {
        audioRef.current.currentTime = (currentSong.dt / 100000) * value;
        setCurrentTime((currentSong.dt / 100000) * value);
      }
      if (!playing) {
        dispatch({
          type: 'SET_PLAYING', //修改为播放
          payload: {
            playing: true,
          },
        });
      }
      playLyric();
    }
  };

  // 播放结束
  const end = () => {
    setCurrentTime(0);
    if (playMode === PLAY_MODE.loop) {
      loop();
    } else {
      next();
    }
  };

  const setFullScreen = (bool: boolean) => {
    dispatch({
      type: 'SET_FULL_SCREEN',
      payload: {
        bool: bool,
      },
    });
  };

  return (
    <>
      {playList.length ? (
        <div className={'text-white'}>
          {fullScreen ? (
            <div className={'fixed left-0 right-0 top-0 bottom-0 z-[9999] bg-black opacity-100'}>
              {currentSong ? (
                <div>
                  <div
                    className={'absolute left-0 top-0 w-full h-full -z-10 blur-[90px] scale-150'}
                  >
                    {currentSong.al ? (
                      <img alt={'#'} className="w-full h-full" src={currentSong.al.picUrl} />
                    ) : null}
                  </div>
                  <div
                    onClick={() => setFullScreen(!fullScreen)}
                    className="text-xl absolute top-3 left-3"
                  >
                    <DownOutline />
                  </div>
                  <div className="top">
                    <h1 className="text-center text-xl font-normal mt-2 max-w-72 line-clamp-1 mx-auto">
                      {currentSong?.name}
                    </h1>
                    <h2 className=" text-center text-lg font-normal opacity-60">
                      {formatArtistName(currentSong.ar)}
                    </h2>
                  </div>
                  <div
                    className="middle fixed w-full top-20 bottom-40 whitespace-nowrap"
                    onTouchStart={onMiddleTouchStart}
                    onTouchMove={onMiddleTouchMove}
                    onTouchEnd={onMiddleTouchEnd}
                  >
                    <div
                      style={middleLStyle}
                      className="middle-l inline-block relative w-full h-0 pt-[80%] mt-24"
                    >
                      <div
                        ref={cdWrapperRef}
                        className="absolute left-[10%] top-0 w-4/5 box-border h-full"
                      >
                        <div
                          ref={cdRef}
                          className={`w-full h-full rounded-full ${cdCls ? 'animate-spin-slow' : ''}`}
                        >
                          <img
                            alt={'#'}
                            className="absolute left-0 top-0  w-full h-full box-border rounded-full  border-solid border-opacity-10  border-[10px] border-slate-50"
                            src={cdImage}
                          />
                          <img
                            alt={'#'}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  w-3/5 h-3/5 box-border rounded-full border-solid border-opacity-20  border-8 border-black"
                            src={currentSong.al.picUrl}
                          />
                        </div>
                      </div>
                      <div className=" w-4/5 mt-20 mr-auto mb-0 ml-auto overflow-hidden text-center">
                        <div className=" h-5 leading-5 text-white/50 text-lg">{playingLyric}</div>
                      </div>
                    </div>
                    <div
                      ref={lyricContainerRef}
                      style={middleRStyle}
                      className="inline-block align-top w-full h-full overflow-y-scroll"
                    >
                      <div className="w-4/5 my-0 mx-auto text-center">
                        {currentLyric ? (
                          <div>
                            {currentLyric.lines.map((line, index) => (
                              <div
                                className={`leading-8 text-lg my-2 ${currentLineNum === index ? 'text-white' : ' text-white/50'}`}
                                key={line.time}
                                data-line={index} //自定义数据存储
                              >
                                {line.txt}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="botom absolute bottom-6 w-full">
                    <div className="text-center">
                      <span
                        className={`inline-block align-middle my-0 mx-1 w-2 h-2 rounded-full bg-opacity-50 bg-white ${currentShow === 'cd' ? 'w-4 bg-opacity-80' : ''}`}
                      ></span>
                      <span
                        className={`inline-block align-middle my-0 mx-1 w-2 h-2 rounded-full bg-opacity-50 bg-white ${currentShow === 'lyric' ? 'w-4 bg-opacity-80' : ''}`}
                      ></span>
                    </div>
                    <div className={'flex text-2xl justify-between items-center px-14 mt-4 mb-2'}>
                      <HeartOutlined />
                      <BugOutlined />
                      <MessageOutlined />
                      <MoreOutlined />
                    </div>
                    <div className=" flex items-center w-full my-0 mx-auto py-2 px-4">
                      <span className=" w-11 grow-0 shrink-0 basis-11 text-sm text-left">
                        {formatTime(currentTime)}
                      </span>
                      <div className="flex-1">
                        <Slider
                          value={progress * 100}
                          icon={<HeartOutline className={'opacity-0'} />}
                          onChange={onProgressChanging}
                          onAfterChange={onProgressChanged}
                        />
                      </div>
                      <span className=" w-11 grow-0 shrink-0  basis-11 text-right text-sm">
                        {formatTime(currentSong.dt / 1000)}
                      </span>
                    </div>
                    <div className="operators flex text-4xl justify-between items-center px-12 mt-4">
                      <span onClick={changeMode} className={'flex items-center text-2xl'}>
                        {playMode === 0 ? (
                          <UndoOutline />
                        ) : playMode === 1 ? (
                          <DashOutlined />
                        ) : (
                          <ThunderboltOutlined />
                        )}
                      </span>
                      <StepBackwardOutlined onClick={prev} />
                      <span onClick={togglePlay} className={'flex items-center'}>
                        {playing ? <PauseCircleFilled /> : <PlayCircleFilled />}
                      </span>
                      <StepForwardOutlined onClick={next} />
                      <UnorderedListOutlined
                        onClick={() => setShowPlaylist(true)}
                        className=" ml-2 text-2xl"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <MiniPlayer
              progress={progress}
              togglePlay={togglePlay}
              prev={prev}
              next={next}
              setShowPlaylist={setShowPlaylist}
            />
          )}
          <PlayList showPlaylist={showPlaylist} setShowPlaylist={setShowPlaylist} />
          <audio
            ref={audioRef}
            onPause={pause}
            onCanPlay={ready}
            onError={error}
            onTimeUpdate={updateTime}
            onEnded={end}
          ></audio>
        </div>
      ) : null}
    </>
  );
};
