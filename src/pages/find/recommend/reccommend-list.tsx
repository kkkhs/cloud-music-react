import React, { useEffect, useState } from 'react';
import { SongList } from '../../../types/songList';
import { fetchRecommendedPlayListData } from '../../../api/song-list';
import { Image, NavBar, SpinLoading } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MyLoading } from '../../../components/my-loading';

export const RecommendList = () => {
  const [songLists, setSongLists] = useState<SongList[]>([]);
  const history = useNavigate();

  useEffect(() => {
    fetchRecommendedPlayListData()
      .then((response) => {
        setSongLists(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []); // 仅在组件挂载时执行一次

  const back = () => history(-1);
  const gotoDetail = (id: number) => {
    history(`/playlist/detail/${id}`);
  };

  return (
    <div className={'fixed top-0 bottom-0 left-0 right-0 z-10 bg-white'}>
      <NavBar onBack={back}>歌单广场</NavBar>
      {songLists.length ? (
        <div className={'px-3 h-full w-full overflow-scroll'}>
          <h2 className={'text-xl font-bold mb-2 mt-2'}>你的宝藏歌单</h2>
          <div className={'flex flex-wrap pb-10'}>
            {songLists.map((songList: SongList) => (
              <div
                onClick={() => gotoDetail(songList.id)}
                className={'h-50 w-28 flex flex-col mr-2 justify-center pb-5'}
                key={songList.id}
              >
                <Image
                  height={112}
                  width={112}
                  className={'rounded-xl mb-1 relative'}
                  src={songList.picUrl}
                  placeholder={<MyLoading />}
                  fit={'cover'}
                  lazy={true}
                />
                <span className={'text-[13px] line-clamp-2 flex-1'}>{songList.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SpinLoading
          color="white"
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </div>
  );
};
