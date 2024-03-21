import { RootState } from '../index';
import { Song } from '../../types/song';
import { PLAY_KEY, PLAY_MODE } from '../../utils/const';
import { load } from '../../utils/array-store';

interface PlayState {
  sequenceList: Song[];
  playList: Song[];
  playing: boolean;
  playMode: number;
  currentIndex: number;
  fullScreen: boolean;
  favoriteList: Song[];
  playHistory: Song[];
}

const initialState: PlayState = {
  sequenceList: [], //原始列表
  playList: [], //播放列表
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0, //当前播放索引
  fullScreen: false, //是否全屏
  favoriteList: [], //喜欢列表
  playHistory: load(PLAY_KEY), // 历史播放列表
};

interface SetPlayModeAction {
  type: 'SET_PLAY_MODE';
  payload: {
    playMode: number;
  };
}

interface SetPlayingAction {
  type: 'SET_PLAYING';
  payload: {
    playing: number;
  };
}

interface SetCurrentIndexAction {
  type: 'SET_CURRENT_INDEX';
  payload: {
    index: number;
  };
}
interface SetFullScreenAction {
  type: 'SET_FULL_SCREEN';
  payload: {
    bool: boolean;
  };
}
interface SetPlayHistoryAction {
  type: 'SET_PLAY_HISTORY';
  payload: {
    songs: Song[];
  };
}

interface SelectPlayAction {
  type: 'SELECT_PLAY';
  payload: {
    list: Song[];
    index: number;
  };
}

interface RandomPlayAction {
  type: 'RANDOM_PLAY';
  payload: {
    list: Song[];
  };
}

interface ChangeModeAction {
  type: 'CHANGE_MODE';
  payload: {
    mode: number;
  };
}

interface RemoveSongAction {
  type: 'REMOVE_SONG';
  payload: {
    song: Song;
  };
}

interface AddSongAction {
  type: 'ADD_SONG';
  payload: {
    song: Song;
  };
}

interface ClearSongListAction {
  type: 'CLEAR_SONG_LIST';
}

type Action =
  | SetPlayHistoryAction
  | SetFullScreenAction
  | SetCurrentIndexAction
  | SetPlayingAction
  | SetPlayModeAction
  | SelectPlayAction
  | RandomPlayAction
  | ChangeModeAction
  | RemoveSongAction
  | AddSongAction
  | ClearSongListAction;

const PlayReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'SET_PLAY_HISTORY':
      return {
        ...state,
        playHistory: action.payload.songs,
      };
    case 'SET_FULL_SCREEN':
      return {
        ...state,
        fullScreen: action.payload.bool,
      };
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentIndex: action.payload.index,
      };
    case 'SET_PLAYING':
      return {
        ...state,
        playing: action.payload.playing,
      };
    case 'SET_PLAY_MODE':
      return {
        ...state,
        playMode: action.payload.playMode,
      };
    case 'SELECT_PLAY':
      return {
        ...state,
        sequenceList: action.payload.list,
        playList: action.payload.list,
        playing: true,
        playMode: PLAY_MODE.sequence,
        currentIndex: action.payload.index,
        fullScreen: true,
      };
    case 'RANDOM_PLAY':
      return {
        ...state,
        sequenceList: action.payload.list,
        playList: shuffle(action.payload.list),
        playing: true,
        playMode: PLAY_MODE.random,
        currentIndex: 0,
        fullScreen: true,
      };
    case 'CHANGE_MODE':
      const currentId = state.playList[state.currentIndex].id;
      const newPlayList =
        action.payload.mode === PLAY_MODE.random ? shuffle(state.sequenceList) : state.sequenceList;
      const index = newPlayList.findIndex((song) => song.id === currentId);
      return {
        ...state,
        playList: newPlayList,
        currentIndex: index,
        playMode: action.payload.mode,
      };
    case 'REMOVE_SONG':
      const sequenceList = state.sequenceList.slice();
      const playList = state.playList.slice();
      const sequenceIndex = findIndex(sequenceList, action.payload.song);
      const playIndex = findIndex(playList, action.payload.song);
      if (sequenceIndex > -1 && playIndex > -1) {
        sequenceList.splice(sequenceIndex, 1);
        playList.splice(playIndex, 1);
        let currentIndex = state.currentIndex;
        if (playIndex < currentIndex || currentIndex === playList.length) {
          currentIndex--;
        }
        return {
          ...state,
          sequenceList,
          playList,
          currentIndex,
          playing: playList.length > 0,
        };
      }
      return state;
    case 'ADD_SONG':
      const newPlaylist = state.playList.slice();
      const newSequenceList = state.sequenceList.slice();
      let newCurrentIndex = state.currentIndex;
      const newPlayIndex = findIndex(newPlaylist, action.payload.song);
      if (newPlayIndex > -1) {
        newCurrentIndex = newPlayIndex;
      } else {
        newPlaylist.push(action.payload.song);
        newCurrentIndex = newPlaylist.length - 1;
      }
      const newSequenceIndex = findIndex(newSequenceList, action.payload.song);
      if (newSequenceIndex === -1) {
        newSequenceList.push(action.payload.song);
      }
      return {
        ...state,
        sequenceList: newSequenceList,
        playList: newPlaylist,
        currentIndex: newCurrentIndex,
        playing: true,
        fullScreen: true,
      };
    case 'CLEAR_SONG_LIST':
      return {
        ...state,
        sequenceList: [],
        playList: [],
        currentIndex: 0,
        playing: false,
      };
    default:
      return state;
  }
};

// 辅助函数，用于打乱数组顺序
function shuffle(arr: any[]): any[] {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// 辅助函数，用于查找歌曲在列表中的索引
function findIndex(list: any[], song: any) {
  return list.findIndex((item) => item.id === song.id);
}

export const getCurrentSong = (state: RootState) => {
  if (
    state.playState.currentIndex !== -1 &&
    state.playState.playList[state.playState.currentIndex]
  ) {
    return state.playState.playList[state.playState.currentIndex];
  } else {
    return null; // 或者返回其他默认值，表示没有当前播放歌曲
  }
};

export default PlayReducer;
