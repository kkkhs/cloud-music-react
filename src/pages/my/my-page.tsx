import { TopNavBar } from '../../components/top-nav-bar';
import { useAuth } from '../../context/auth-context';
import { ClockCircleFilled } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

export const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={'h-full w-full'}>
      <div className={'absolute text-white'}>
        <TopNavBar></TopNavBar>
      </div>
      {user !== undefined ? (
        <div className={'h-full w-full'}>
          <img className={'absolute w-full -z-10'} src={user.backgroundUrl} />
          <div className={'text-white flex flex-col items-center mb-5'}>
            <img className={'rounded-full w-24 h-24 mt-24 mb-5'} src={user.avatarUrl} />
            <div className={'text-2xl mb-4'}>{user.nickname}</div>
            <div className={'opacity-60 mb-5'}>
              <span>关注</span>
              <span className={'mx-5'}>粉丝</span>
              <span>等级</span>
            </div>
            <div className={'flex'}>
              <div
                className={'bg-white py-2 px-2 bg-opacity-20 rounded-lg flex items-center mr-4'}
                onClick={() => navigate('/playHistory')}
              >
                <ClockCircleFilled className={'text-lg flex items-center'} />
                <span className={'ml-1'}>最近播放</span>
              </div>
              <div
                className={'bg-white py-2 px-2 bg-opacity-20 rounded-lg flex items-center'}
                onClick={() => navigate('/playHistory')}
              >
                <ClockCircleFilled className={'text-lg flex items-center'} />
                <span className={'ml-1'}>最近播放</span>
              </div>
            </div>
          </div>
          <div className={'h-full w-full bg-white rounded-t-2xl'}></div>
        </div>
      ) : (
        <div className={'h-full w-full'}>
          <img
            className={'absolute w-full -z-10'}
            src={'http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg'}
          />
          <div className={'text-white flex flex-col items-center mb-5'}>
            <img
              className={'rounded-full w-24 h-24 mt-24 mb-5'}
              src={'http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg'}
            />
            <div className={'text-2xl mb-4'}>游客</div>
            <div className={'opacity-60 mb-5'}>
              <span>关注</span>
              <span className={'mx-5'}>粉丝</span>
              <span>等级</span>
            </div>
            <div className={'flex'}>
              <div
                onClick={() => navigate('/playHistory')}
                className={'bg-white py-2 px-2 bg-opacity-20 rounded-lg flex items-center mr-4'}
              >
                <ClockCircleFilled className={'text-lg flex items-center'} />
                <span className={'ml-1'}>最近播放</span>
              </div>
              <div
                onClick={() => navigate('/playHistory')}
                className={'bg-white py-2 px-2 bg-opacity-20 rounded-lg flex items-center'}
              >
                <ClockCircleFilled className={'text-lg flex items-center'} />
                <span className={'ml-1'}>最近播放</span>
              </div>
            </div>
          </div>
          <div className={'h-full w-full bg-white rounded-t-2xl'}></div>
        </div>
      )}
    </div>
  );
};
