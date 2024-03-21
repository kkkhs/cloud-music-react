import { Link } from 'react-router-dom';
import {
  CalendarOutline,
  ContentOutline,
  HistogramOutline,
  ShopbagOutline,
  StarFill,
} from 'antd-mobile-icons';
import React from 'react';
import { useDispatch } from 'react-redux';

const selects = [
  {
    name: '每日推荐',
    url: '/recommendedList',
    icon: <CalendarOutline />,
  },
  {
    name: '歌单',
    url: '/recommendedList',
    icon: <ContentOutline />,
  },
  {
    name: '排行榜',
    url: '#',
    icon: <HistogramOutline />,
  },
  {
    name: '有声书',
    url: '#',
    icon: <ShopbagOutline />,
  },
];

export const SelectLine = () => {
  const dispatch = useDispatch();
  const setActiveIndex = (index: number) => {
    dispatch({
      type: 'SET_WINDOW',
      payload: {
        index,
      },
    });
  };

  const HandleClick = (name: string) => {
    if (name === '排行榜') {
      setActiveIndex(2);
    }
  };

  return (
    <>
      <div className={' flex justify-between items-center'}>
        {selects.map((select) => {
          return (
            <Link
              key={select.name}
              onClick={() => HandleClick(select.name)}
              to={select.url}
              className={' flex text-4xl flex-col items-center'}
            >
              <span>{select.icon}</span>
              <span className={'text-xs mt-1 text-black'}>{select.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
