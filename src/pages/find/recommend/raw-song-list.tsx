import React, { useEffect, useState } from 'react';
import { fetchRecommendedPlayListData } from '../../../api/song-list';
import { SongList } from '../../../types/songList';
import { RightOutline } from 'antd-mobile-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Image, SpinLoading } from 'antd-mobile';
import { MyLoading } from '../../../components/my-loading';

export const RawSongList = () => {
  const [songLists, setSongLists] = useState<SongList[]>([]);

  const history = useNavigate();
  const gotoDetail = (id: number) => {
    history(`/playlist/detail/${id}`);
  };

  useEffect(() => {
    fetchRecommendedPlayListData(6)
      .then((response) => {
        setSongLists(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []); // 仅在组件挂载时执行一次

  return (
    <>
      <div className={'w-full'}>
        <Link to={'/recommendedList'} className={'text-lg mb-1 flex items-center text-black'}>
          推荐歌单
          <RightOutline fontSize={16} />
        </Link>
        <div className={'overflow-x-scroll flex'}>
          <div className={'flex'}>
            {songLists.map((songList: SongList) => (
              <div
                onClick={() => gotoDetail(songList.id)}
                onTouchStart={(evt) => evt.stopPropagation()}
                className={'h-50 w-32 flex flex-col mr-5 justify-center pb-3'}
                key={songList.id}
              >
                <Image
                  height={128}
                  width={128}
                  className={'rounded-xl mb-1 relative'}
                  src={songList.picUrl}
                  placeholder={<MyLoading />}
                  fit={'cover'}
                  lazy={true}
                />
                <span className={'h-9 text-[12px] line-clamp-2 '}>{songList.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
