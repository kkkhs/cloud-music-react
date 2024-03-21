import { Button, NavBar, Popup, Swiper, SwiperRef, Tabs, Toast } from 'antd-mobile';
import { SearchOutline, SmileOutline } from 'antd-mobile-icons';
import React, { useEffect, useRef, useState } from 'react';
import { RecommendTab } from './recommend/recommend-tab';
import { SingerList } from '../../components/singer-list';
import { TopList } from '../../components/top-list';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SearchInput } from '../../components/search/search-input';
import { Link } from 'react-router-dom';
import { CloseCircleFilled, MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchSearchDefaultData } from '../../api/search';
import { fetchLogoutData } from '../../api/login';
import { TopNavBar } from '../../components/top-nav-bar';

const tabItems = [
  { key: 'recommend', title: '推荐' },
  { key: 'singerList', title: '歌手列表' },
  { key: 'top', title: '排行榜' },
];

export const FindPage = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const activeIndex = useSelector((state: RootState) => state.windowState.index);
  const dispatch = useDispatch();
  const [placeholder, setPlaceholder] = useState('');

  const setActiveIndex = (index: number) => {
    dispatch({
      type: 'SET_WINDOW',
      payload: {
        index,
      },
    });
  };

  useEffect(() => {
    swiperRef.current?.swipeTo(activeIndex);
    fetchSearchDefaultData().then((v) => setPlaceholder(v.data.data.showKeyword));
  }, [activeIndex]);

  return (
    <div>
      <TopNavBar>
        <Link to={'/search'}>
          <div className="bg-slate-100 h-8 items-center rounded-2xl px-3 flex w-72 -ml-3">
            <SearchOutlined className={'text-black mr-2  text-xl opacity-30 flex items-center'} />
            <input
              className="flex-1 box-border outline-none text-base bg-slate-100"
              placeholder={placeholder}
            />
          </div>
        </Link>
      </TopNavBar>
      <Tabs
        style={{ '--title-font-size': '14px' }}
        activeKey={tabItems[activeIndex].key}
        onChange={(key) => {
          const index = tabItems.findIndex((item) => item.key === key);
          setActiveIndex(index);
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      <Swiper
        direction="horizontal"
        loop
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={(index) => {
          setActiveIndex(index);
        }}
      >
        <Swiper.Item className={'h-full w-full'}>
          <div className={'h-full w-full px-3'}>
            <RecommendTab />
          </div>
        </Swiper.Item>
        <Swiper.Item className={'h-full w-full'}>
          <div>
            <SingerList />
          </div>
        </Swiper.Item>
        <Swiper.Item className={'h-full w-full'}>
          <div>
            <TopList />
          </div>
        </Swiper.Item>
      </Swiper>
    </div>
  );
};
