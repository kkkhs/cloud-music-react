import React, { useEffect, useState } from 'react';
import { fetchTopListData } from '../api/top-list';
import { Playlist } from '../types/playlist';
import { fetchPlaylistDetailData } from '../api/playlistDetail';
import { useNavigate } from 'react-router-dom';
import { TwitterOutlined } from '@ant-design/icons';
import { SpinLoading } from 'antd-mobile';

export const TopList = () => {
  const [topLists, setTopLists] = useState<Playlist[]>([]);
  const history = useNavigate();

  const gotoDetail = (id: number) => {
    history(`/playlist/detail/${id}`);
  };

  useEffect(() => {
    fetchTopListData().then((v) => {
      const updatedTopLists = [...v.data.list]; // 创建副本
      for (let i = 0; i < updatedTopLists.length; i++) {
        fetchPlaylistDetailData(updatedTopLists[i].id).then((item) => {
          updatedTopLists[i] = {
            ...updatedTopLists[i],
            top3: item.data.playlist.tracks.slice(0, 3),
          };
          setTopLists(updatedTopLists); // 更新状态
        });
      }
    });
  }, []);

  return (
    <div className={'fixed top-0 bottom-[50px] w-full overflow-y-scroll'}>
      <div className=" w-full bg-slate-100 px-4 pb-1 h-fit ">
        {topLists.length ? (
          <>
            <div className=" py-3 flex items-center">
              <TwitterOutlined className={'text-3xl text-red-500'} />
              <span className=" text-lg ml-2">官方榜</span>
            </div>
            {topLists.map((list, index) => (
              <div
                className="flex flex-col mb-4 bg-white rounded-2xl px-6 py-2"
                key={list.id}
                onClick={() => gotoDetail(list.id)}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xl"> {list.name}</span>
                  <span className="text-xs opacity-60">{list.updateFrequency}</span>
                </div>
                <div className=" flex">
                  <img className=" h-20 w-20 rounded-2xl mr-5" src={list.coverImgUrl} />
                  <div className=" flex flex-col justify-center ">
                    {list.top3?.map((song, index) => (
                      <div className="my-1 line-clamp-1 max-w-52" key={song.id}>
                        <span className=" mx-2 font-bold">{index + 1}</span>
                        <span className="">
                          {song.name}
                          <span className="text-center text-sm leading-5 font-normal opacity-60">
                            {' '}
                            - {song?.ar[0]?.name}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <SpinLoading
            color="primary"
            className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
          />
        )}
      </div>
    </div>
  );
};
