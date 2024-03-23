import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getCurrentSong } from '../../store/reducers/playReducer';
import useMode from './use-mode';
import { Song } from '../../types/song';
import { Popup, Divider, Modal, Toast } from 'antd-mobile';
import {
  CloseOutlined,
  DashOutlined,
  DeleteOutlined,
  HeartFilled,
  HeartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { HistogramOutline, UndoOutline } from 'antd-mobile-icons';
import { useLike } from './use-like';

interface PlayListProps {
  showPlaylist: boolean;
  setShowPlaylist: (value: React.SetStateAction<boolean>) => void;
}

export const PlayList = ({ showPlaylist, setShowPlaylist }: PlayListProps) => {
  const { modeText, changeMode } = useMode();
  const playMode = useSelector((state: RootState) => state.playState.playMode);
  const currentSong = useSelector(getCurrentSong);
  const playList = useSelector((state: RootState) => state.playState.playList);
  const dispatch = useDispatch();

  const { isLiked, toggleLike } = useLike();

  // 点击切歌
  const selectItem = (song: Song) => {
    const index = playList.findIndex((item) => {
      return item.id === song.id;
    });
    dispatch({
      type: 'SET_CURRENT_INDEX', //修改当前播放序号
      payload: {
        index: index,
      },
    });
    dispatch({
      type: 'SET_PLAYING',
      payload: {
        playing: true,
      },
    });
  };

  const removeSong = (song: Song) => {
    dispatch({
      type: 'REMOVE_SONG',
      payload: {
        song: song,
      },
    });
    if (!playList.length) {
      setShowPlaylist(false);
    }
  };

  const clear = () => {
    Modal.confirm({
      content: '是否清空播放列表?',

      onConfirm() {
        dispatch({
          type: 'CLEAR_SONG_LIST',
        });
        // dialog.value = false;
        setShowPlaylist(false);
        Toast.show({
          content: '播放列表已清空',
          position: 'top',
        });
      },
    });
  };

  return (
    <>
      <Popup
        visible={showPlaylist && !!playList.length}
        onMaskClick={() => {
          setShowPlaylist(false);
        }}
        stopPropagation={['click']}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '50vh',
          maxHeight: '50vh',
        }}
      >
        <div className="list-header relative pt-5 pr-8 pb-3 pl-5">
          <div className="title flex items-center">
            <span onClick={changeMode} className={'flex items-center text-2xl'}>
              {playMode === 0 ? (
                <UndoOutline />
              ) : playMode === 1 ? (
                <DashOutlined />
              ) : (
                <ThunderboltOutlined />
              )}
            </span>
            <span className="text flex-1 ml-2 text-lg">{modeText}</span>
            <DeleteOutlined className={'text-xl'} onClick={clear} />
          </div>
        </div>
        <div className={'h-[350px] overflow-y-scroll'}>
          <div className={'h-fit'}>
            {playList.map((song, index) => (
              <div key={index}>
                <li
                  className={' flex list-none ml-3 mr-5 items-center'}
                  key={song.id}
                  onClick={() => selectItem(song)}
                >
                  {song.id === currentSong.id ? (
                    <HistogramOutline className={'text-red-400 text-2xl mr-4'} />
                  ) : null}
                  <span
                    className={`text flex-1 text-base truncate ${song.id === currentSong.id ? 'text-red-400' : ''}`}
                  >
                    {song.fee == 1 ? (
                      <span className=" text-red-400 border-solid border text-xs rounded px-0.5 mr-1">
                        VIP
                      </span>
                    ) : null}
                    <span className="opacity-80">{song.name}</span>
                    <span className="text-center text-sm leading-5 font-normal opacity-60">
                      {' '}
                      - {song.ar[0].name}
                    </span>
                  </span>
                  <span
                    className="mr-4 text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                  >
                    {isLiked(song.id) ? (
                      <HeartFilled className={'text-red-500'} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </span>
                  <span
                    className="delete text-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSong(song);
                    }}
                  >
                    <CloseOutlined />
                  </span>
                </li>
                <hr className={'my-2'} />
              </div>
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};
