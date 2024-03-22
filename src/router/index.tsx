import * as React from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { BottomTabBar } from '../components/bottom-tab-bar';
import { FindPage } from '../pages/find/find-page';
import { FollowPage } from '../pages/follow/follow-page';
import { MyPage } from '../pages/my/my-page';
import { CommunityPage } from '../pages/community/community-page';
import { RecommendList } from '../pages/find/recommend/reccommend-list';
import { ArtistDetail } from '../components/artist-detail';
import { PlaylistDetail } from '../components/playlist-detail';
import { Search } from '../components/search/search';
import { LoginPage } from '../pages/login/login-page';
import { useAuth } from '../context/auth-context';
import { useEffect } from 'react';
import { Toast } from 'antd-mobile';
import { Navigate } from 'react-router';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useCookies } from 'react-cookie';
import * as path from 'path';
import { MyPlayHistory } from '../pages/my/my-play-history';
import { MainPage } from '../pages/main-page';

export const BaseRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['__csrf']);

  // 鉴权
  useEffect(() => {
    // console.log(location.pathname);
    const isLoggedIn = !!cookies['__csrf'];

    if (!isLoggedIn && location.pathname !== '/login') {
      Toast.show({
        content: '请先登陆!',
        position: 'top',
      });
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const element = useRoutes([
    // 默认路由
    {
      path: '*',
      element: <Navigate to="/find" />,
    },
    {
      path: '/',
      element: <MainPage />,
      children: [
        {
          path: '/find',
          element: <FindPage />,
        },
        {
          path: '/my',
          element: <MyPage />,
        },
        {
          path: '/follow',
          element: <FollowPage />,
        },
        {
          path: '/community',
          element: <CommunityPage />,
        },
      ],
    },
    {
      path: 'recommendedList',
      element: <RecommendList />,
    },
    {
      path: 'artist/:id',
      element: <ArtistDetail />,
    },
    {
      path: 'playlist/detail/:id',
      element: <PlaylistDetail />,
    },
    {
      path: 'search',
      element: <Search />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'playHistory',
      element: <MyPlayHistory />,
    },
  ]);

  return element;
};
