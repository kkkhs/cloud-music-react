import { Navigate } from 'react-router';
import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { BottomTabBar } from '../components/bottom-tab-bar';

export const MainPage = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className={'h-full w-full'}>
      {pathname === '/' ? <Navigate to="/find" /> : null}
      <Outlet></Outlet>
      <BottomTabBar />
    </div>
  );
};
