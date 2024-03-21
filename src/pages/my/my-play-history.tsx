import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MusicList } from '../../components/music-list';

export const MyPlayHistory = () => {
  const playHistory = useSelector((state: RootState) => state.playState.playHistory);
  const navigate = useNavigate();

  const back = () => {
    navigate(-1);
  };
  return (
    <div className={'fixed top-0 bottom-0 left-0 right-0'}>
      <NavBar onBack={back}>最近播放</NavBar>
      <div className={'h-full w-full overflow-y-scroll'}>
        <div className={'ml-5 pb-20'}>
          <MusicList songs={playHistory} />
        </div>
      </div>
    </div>
  );
};
