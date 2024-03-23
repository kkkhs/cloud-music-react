import { useQuery } from 'react-query';
import { fetchDailySongsData } from '../../../api/user';
import { Song } from '../../../types/song';
import { Image, NavBar } from 'antd-mobile';
import { MusicList } from '../../../components/music-list';
import { AppleFilled, CalendarFilled } from '@ant-design/icons';
import { useScrollListener } from '../../../utils/use-listen-scroll';
import { useNavigate } from 'react-router-dom';

export const DailyRecommendSongs = () => {
  const navigate = useNavigate();
  const {
    data: dailySongs,
    isLoading,
    error,
    refetch,
  } = useQuery<Song[]>('dailySongs', () =>
    fetchDailySongsData().then((res) => res.data.data.dailySongs),
  );
  const today = new Date();
  const month = today.getMonth() + 1; // 月份是从0开始的，所以要加1
  const day = today.getDate();
  const { scrollY, titleChange, scrollRef } = useScrollListener(100);

  return (
    <div ref={scrollRef} className={'h-full w-full bg-white overflow-y-scroll '}>
      <NavBar
        onBack={() => navigate(-1)}
        className={`absolute z-10 w-full transition-all ease-in-out duration-1000  ${titleChange ? 'bg-white text-black rounded-b-lg' : 'text-white'}`}
      >
        每日推荐
      </NavBar>
      <div className={'h-1/4 bg-gradient-to-b from-gray-600 via-gray-400 to-white'}>
        <div className="pt-20 text-white pl-5">
          <CalendarFilled className={'text-3xl opacity-80 mr-2'} />
          <span className={'text-3xl font-medium'}>{month}月</span>
          <span className={'text-xl font-medium'}>/{day}日</span>
        </div>
        <AppleFilled className={'absolute top-10 right-10 text-8xl text-white opacity-80'} />
      </div>
      <div>{dailySongs ? <MusicList songs={dailySongs} hasPic={true} /> : null}</div>
    </div>
  );
};
