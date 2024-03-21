import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Toast } from 'antd-mobile';

const Icons = ['mdi-reload', 'mdi-sync', 'mdi-all-inclusive'];
const Text = ['顺序播放', '随机播放', '单曲循环'];

export default function useMode() {
  const dispatch = useDispatch();
  const playMode = useSelector((state: RootState) => state.playState.playMode);

  const modeText = Text[playMode];

  function changeMode() {
    const nextMode = (playMode + 1) % 3;
    Toast.show({
      content: Text[nextMode],
      position: 'top',
    });
    dispatch({
      type: 'SET_PLAY_MODE',
      payload: {
        playMode: nextMode,
      },
    });
  }

  return {
    playMode,
    modeText,
    changeMode,
  };
}
