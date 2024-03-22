import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentSong } from '../../store/reducers/playReducer';
import useCd from './use-cd';
import { formatArtistName } from '../../utils/format-artist-name';
import { CaretRightOutlined, PauseOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PlayList } from './play-list';
import { Progress } from 'antd';
import { PlayOutline } from 'antd-mobile-icons';
import { useLocation } from 'react-router-dom';

const validPaths = ['/find', '/my', '/follow', '/community'];

export const MiniPlayer = ({
  progress,
  togglePlay,
  prev,
  next,
  setShowPlaylist,
}: {
  progress: number;
  togglePlay: (e: React.MouseEvent<HTMLElement>) => void;
  prev: () => void;
  next: () => void;
  setShowPlaylist: (b: boolean) => void;
}) => {
  const playlistRef = useRef(null);
  const currentSong = useSelector(getCurrentSong);
  const playing = useSelector((state: RootState) => state.playState.playing);
  const dispatch = useDispatch();
  const miniPlayer = useRef(null);
  const [isIndex, setIsIndex] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  const [leftOffset, setLeftOffset] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchMoveX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null) {
      touchMoveX.current = e.touches[0].clientX;
      const swipeDistance = touchMoveX.current! - touchStartX.current!;
      setLeftOffset(swipeDistance);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchMoveX.current !== null) {
      const swipeDistance = touchMoveX.current - touchStartX.current;
      touchStartX.current = null;
      touchMoveX.current = null;
      setLeftOffset(0);

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // 向右滑动，切换到上一首歌曲
          prev();
        } else {
          // 向左滑动，切换到下一首歌曲
          next();
        }
      }
    }
  };

  useEffect(() => {
    if (validPaths.includes(pathname)) {
      setIsIndex(true);
    } else {
      setIsIndex(false);
    }
  }, [location]);

  // hooks
  const { cdCls, cdWrapperRef, cdRef } = useCd();

  const showNormalPlayer = () => {
    dispatch({
      type: 'SET_FULL_SCREEN',
      payload: {
        bool: true,
      },
    });
  };

  return (
    <>
      <div
        ref={miniPlayer}
        style={{ transform: `translateX(${leftOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`mini-player transition duration-1000 ease-in-out text-black z-50 flex justify-between items-center fixed bottom-0 bg-white shadow-inner h-14 left-0 right-0 pl-4 ${isIndex ? 'bottom-12' : ''} `}
        onClick={showNormalPlayer}
      >
        <div ref={cdWrapperRef} className={'h-14 w-14'}>
          <div
            ref={cdRef}
            className={`flex items-center justify-center h-full w-full ${cdCls ? 'animate-spin-slow' : ''}`}
          >
            <img className="h-11 w-11 rounded-full mx-0 my-auto" src={currentSong?.al?.picUrl} />
          </div>
        </div>
        <p className="text-base flex-1 leading-5 font-normal truncate max-w-52">
          {currentSong.fee == 1 ? (
            <span className=" text-red-400 border-solid border text-xs rounded px-0.5 mr-1">
              VIP
            </span>
          ) : null}
          {currentSong.name}
          <span className="text-center text-sm leading-5 font-normal opacity-60">
            {' '}
            - {formatArtistName(currentSong.ar)}
          </span>
        </p>
        <div className="flex items-center text-2xl pr-8">
          <div className={'relative w-fit h-fit'}>
            <Progress
              className={'scale-[0.5]'}
              size={'small'}
              showInfo={false}
              strokeWidth={6}
              percent={progress * 100}
              type="circle"
              strokeColor={'#000000'}
            />
            <span
              className={
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg flex items-center'
              }
              onClick={togglePlay}
            >
              {playing ? <PauseOutlined /> : <PlayOutline />}
            </span>
          </div>
          <UnorderedListOutlined
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylist(true);
            }}
            className=" ml-2"
          />
        </div>
      </div>
    </>
  );
};
