import { Song } from '../types/song';
import { PlayOutline } from 'antd-mobile-icons';
import { Button } from 'antd-mobile';
import { formatArtistName } from '../utils/format-artist-name';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentSong } from '../store/reducers/playReducer';
import { RootState } from '../store';
import { Mark } from '../utils/mark';
import { PlayCircleFilled } from '@ant-design/icons';

interface MusicListProps {
  songs: Song[];
  hasIndex?: boolean;
  isHighLight?: boolean;
  keyWord?: string;
}

export const MusicList = ({
  songs,
  hasIndex = false,
  isHighLight = false,
  keyWord = '',
}: MusicListProps) => {
  const playState = useSelector((state: RootState) => state.playState);
  const dispatch = useDispatch();
  const currentSong = useSelector(getCurrentSong);

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

            <div className="flex-1">
              {isHighLight ? (
                <div className="line-clamp-1 max-w-64">
                  <Mark name={song.name} keyWord={keyWord} />
                </div>
              ) : (
                <div className="line-clamp-1 max-w-64">{song.name}</div>
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
          </div>
        ))}
      </div>
    </div>
  );
};
