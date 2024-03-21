import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import { Player } from './player/player';
import { TopNavBar } from './top-nav-bar';

export const tabs = [
  {
    key: '/find',
    title: '发现',
    icon: <AppOutline />,
  },
  {
    key: '/follow',
    title: '关注',
    icon: <UnorderedListOutline />,
  },
  {
    key: '/community',
    title: '社区',
    icon: <MessageOutline />,
  },
  {
    key: '/my',
    title: '我的',
    icon: <UserOutline />,
  },
];

export const BottomTabBar = () => {
  const history = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    history(value);
  };

  return (
    <div className={'h-full w-full'}>
      <Outlet></Outlet>
      <div className={'absolute bottom-0 w-full'}>
        <TabBar
          className={'bg-white'}
          activeKey={pathname}
          onChange={(value) => {
            setRouteActive(value);
          }}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
};
