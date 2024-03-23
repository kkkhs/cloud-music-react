import { Song } from '../types/song';
import { PlayOutline } from 'antd-mobile-icons';
import { Button, Divider, Image, List, Popup } from 'antd-mobile';
import { formatArtistName } from '../utils/format-artist-name';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentSong } from '../store/reducers/playReducer';
import { RootState } from '../store';
import { Mark } from '../utils/mark';
import {
  AppstoreAddOutlined,
  FolderAddFilled,
  MoreOutlined,
  PlayCircleFilled,
} from '@ant-design/icons';
import { useState } from 'react';
import { sleep } from 'antd-mobile/es/utils/sleep';

interface MusicListProps {
  songs: Song[];
  hasIndex?: boolean;
  isHighLight?: boolean;
  keyWord?: string;
  hasPic?: boolean;
}

export const MusicList = ({
  songs,
  hasIndex = false,
  isHighLight = false,
  keyWord = '',
  hasPic = false,
}: MusicListProps) => {
  const playState = useSelector((state: RootState) => state.playState);
  const dispatch = useDispatch();
  const currentSong = useSelector(getCurrentSong);
  const [showPop, setShowPop] = useState(false);
  const [selectSong, setSelectSong] = useState<Song>();

  const selectItem = (index: number) => {
    console.log(playState);
    dispatch({
      type: 'SELECT_PLAY',
      payload: {
        list: songs,
        index,
      },
    });
  };

  const selectPlay = () => {
    console.log(playState);
    const action = {
      type: 'SELECT_PLAY',
      payload: {
        list: songs,
        index: 0,
      },
    };
    dispatch(action);
  };

  const current = (song: Song) => {
    return currentSong.id === song.id;
  };

  // 添加歌曲到播放列表
  const addToPlaylist = (song: Song) => {
    const action = {
      type: 'ADD_SONG',
      payload: {
        song,
      },
    };
    dispatch(action);
  };

  return (
    <div className={'bg-white w-full rounded-t-2xl'}>
      <Button
        shape={'rounded'}
        className="flex items-center text-left bg-white text-lg leading-8 font-medium py-2 border-solid border-slate-200 border-t-0 border-l-0 border-r-0 border-[1px]"
        onClick={selectPlay}
      >
        <PlayCircleFilled className={'text-2xl text-red-500'} />
        <span className={'ml-3'}>播放全部</span>
      </Button>
      <div className="min-h-[480px]">
        {songs.map((song, index) => (
          <div
            key={index}
            className="flex items-center mt-2 mb-2 pb-2  border-solid border-slate-200 border-t-0 border-l-0 border-r-0 border-[1px]"
            onClick={() => selectItem(index)}
          >
            {hasIndex ? (
              <div className=" mr-3 opacity-70 text-lg text-left">{index + 1}</div>
            ) : null}
            {hasPic ? (
              <div className={'mx-3'}>
                <Image height={48} width={48} src={song.al.picUrl} className={'rounded-lg'} />
              </div>
            ) : null}

            <div className="flex-1">
              {isHighLight ? (
                <div className="line-clamp-1 max-w-64 text-base">
                  <Mark name={song.name} keyWord={keyWord} />
                </div>
              ) : (
                <div className="line-clamp-1 max-w-64 text-base">{song.name}</div>
              )}
              <div className="line-clamp-1 max-w-60">
                {song.fee === 1 ? (
                  <span className=" text-red-400 border-solid border text-xs rounded px-0.5 mr-1">
                    VIP
                  </span>
                ) : null}
                <span className="text-sm opacity-70 ">
                  {formatArtistName(song.ar)} - {song.al.name}
                </span>
              </div>
              {song.awardName ? (
                <div className="text-orange-600 bg-orange-100 text-[11px] w-fit max-w-[263px] px-1 leading-5 rounded-sm mt-1 text-nowrap overflow-hidden">
                  {song.awardName}
                </div>
              ) : null}
            </div>
            <div className={'mr-2'}>
              <span>
                <MoreOutlined
                  className={'text-2xl'}
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowPop(true);
                    setSelectSong(song);
                  }}
                />
              </span>
            </div>
          </div>
        ))}
      </div>
      <Popup
        visible={showPop}
        onMaskClick={() => {
          setShowPop(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '50vh',
        }}
      >
        {selectSong ? (
          <div className={'h-full w-full py-2'}>
            <div className=" flex mx-4 items-center mb-2">
              <img className="rounded-2xl h-20 w-20 mr-3 ml-2" src={selectSong.al.picUrl} />
              <div className=" flex-1">
                <span className="line-clamp-1 text-left text-base">歌曲： {selectSong.name}</span>
                <div className="line-clamp-1 max-w-60 text-left">
                  {selectSong.fee == 1 ? (
                    <span className=" text-red-400 border-solid border text-xs rounded px-0.5 mr-1">
                      VIP
                    </span>
                  ) : null}
                  <span className="text-sm opacity-70 ">{formatArtistName(selectSong.ar)}</span>
                </div>
              </div>
            </div>
            <List>
              <List.Item
                onClick={() => {
                  addToPlaylist(selectSong);
                  setShowPop(false);
                }}
              >
                <AppstoreAddOutlined className={'text-2xl mr-4'} />
                <span>添加到播放列表</span>
              </List.Item>
              <List.Item>more...</List.Item>
            </List>
          </div>
        ) : null}
      </Popup>
    </div>
  );
};
