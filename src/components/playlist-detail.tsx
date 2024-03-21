import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchPlaylistDetailData } from '../api/playlistDetail';
import { Playlist } from '../types/playlist';
import { NavBar, SpinLoading } from 'antd-mobile';
import { DiffFilled, MessageFilled, MoreOutlined, ShareAltOutlined } from '@ant-design/icons';
import { MusicList } from './music-list';

export const PlaylistDetail = () => {
  const [playlist, setPlaylist] = useState<Playlist>();
  const { id } = useParams();
  const history = useNavigate();

  useEffect(() => {
    fetchPlaylistDetailData(Number(id)).then((v) => {
      setPlaylist(v.data.playlist);
    });
  }, []);
  const back = () => history(-1);

  return (
    <div className={'bg-gray-300 fixed top-0 bottom-0 left-0 right-0 z-10'}>
      <NavBar
        className={' fixed mt-2 z-10 text-white w-full'}
        onBack={back}
        right={<MoreOutlined className={'text-2xl'} />}
      >
        {playlist ? (
          <span className={'line-clamp-1 text-left'}>{playlist.name}</span>
        ) : (
          <span>歌单</span>
        )}
      </NavBar>
      {playlist ? (
        <>
          <div className={'absolute left-0 top-0 w-full h-full -z-10 blur-[90px] scale-150'}>
            <img alt={'#'} className="w-full h-full" src={playlist.coverImgUrl} />
          </div>
          <div className={'h-full overflow-y-scroll'}>
            <div className="middle pt-20 text-white px-4">
              <div className=" flex mb-3 min-h-28">
                <img className=" h-28 w-28 rounded-2xl" src={playlist.coverImgUrl} />
                <div className=" flex flex-col ml-3">
                  <div className=" mb-3">
                    <span className="line-clamp-2 w-56">{playlist.name}</span>
                  </div>
                  <div className=" flex items-center">
                    <img
                      className="h-8 w-8 rounded-full border-solid mr-2"
                      src={playlist.creator.avatarUrl}
                    />
                    <span className=" text-sm opacity-80">{playlist.creator.nickname}</span>
                  </div>
                </div>
              </div>
              <div className=" line-clamp-1 text-sm opacity-80"> {playlist.description}</div>
              <div className="flex justify-between my-5">
                <div className="h-10 bg-white rounded-full w-[105px] bg-opacity-45 justify-center flex items-center">
                  <ShareAltOutlined className={'text-xl'} />
                  <span className=" text-sm">{playlist.shareCount}</span>
                </div>
                <div className="h-10 bg-white rounded-full  w-[105px] bg-opacity-45 flex items-center justify-center">
                  <MessageFilled className={'text-xl'} />
                  <span className="text-sm ml-1">{playlist.commentCount}</span>
                </div>
                <div className="h-10 bg-red-500 rounded-full  w-[105px] justify-center flex items-center">
                  <DiffFilled className={'text-xl'} />
                  <span className=" text-sm ml-1">{playlist.subscribedCount}</span>
                </div>
              </div>
            </div>
            <div className="bottom h-fit w-full px-3 bg-white rounded-2xl">
              <MusicList songs={playlist.tracks}></MusicList>
            </div>
          </div>
        </>
      ) : (
        <SpinLoading
          color="white"
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </div>
  );
};
