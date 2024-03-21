/*
  将playHistory存储到localStorage
*/
import { remove, save, clear } from 'utils/array-store';
import { PLAY_KEY } from 'utils/const';
import { Song } from '../../types/song';
import { useDispatch } from 'react-redux';

export default function usePlayHistory() {
  const maxLen = 200;
  const dispatch = useDispatch();

  // 保存
  function savePlay(song: Song) {
    const songs = save(
      song,
      PLAY_KEY,
      (item) => {
        return item.id === song.id;
      },
      maxLen,
    );
    dispatch({
      type: 'SET_PLAY_HISTORY',
      payload: {
        songs,
      },
    });
  }

  // 移除某项
  function deletePlay(song: Song) {
    const songs = remove(PLAY_KEY, (item: Song) => {
      return item.id === song.id;
    });
    dispatch({
      type: 'SET_PLAY_HISTORY',
      payload: {
        songs,
      },
    });
  }

  //清空全部
  function clearPlay() {
    clear(PLAY_KEY);
  }

  return {
    savePlay,
    deletePlay,
    clearPlay,
  };
}
