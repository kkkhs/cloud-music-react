import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { Artist, Follows, Singer } from '../types/singer';
import { Song } from '../types/song';
import {
  fetchArtistDetailData,
  fetchArtistFollowCount,
  fetchArtistTopSong,
} from '../api/artistDetail';
import { useNavigate } from 'react-router-dom';
import { Image, NavBar, SpinLoading } from 'antd-mobile';
import { MusicList } from './music-list';
import { useScrollListener } from '../utils/use-listen-scroll';

export const ArtistDetail = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [follows, setFollows] = useState<Follows | null>(null);
  const [TopSong, setTopSong] = useState<Song[]>([]);
  const { scrollY, titleChange, scrollRef } = useScrollListener(140);

  useEffect(() => {
    fetchArtistDetailData(Number(id)).then((v) => {
      setArtist(v.data.data);
      console.log(artist);
    });
    fetchArtistFollowCount(Number(id)).then((v) => setFollows(v.data.data));
    fetchArtistTopSong(Number(id)).then((v) => setTopSong(v.data.songs));
  }, []);

  const back = () => history(-1);

  return (
    <div
      ref={scrollRef}
      className={'fixed top-0 bottom-0 left-0 right-0 z-10 bg-gray-white overflow-scroll'}
    >
      <NavBar
        className={`fixed z-20 w-full transition-all ease-in-out duration-1000  ${titleChange ? 'bg-white text-black rounded-b-lg' : 'text-white'}`}
        onBack={back}
      >
        {titleChange ? <span>{artist?.artist?.name}</span> : null}
      </NavBar>
      {artist ? (
        <>
          <div className={'w-full  min-h-80'}>
            <Image fit={'cover'} src={artist?.artist?.cover} />
          </div>
          <div className="relative z-10 bg-white shadow-lg border-solid border-2 border-black border-opacity-15 flex flex-nowrap flex-col items-center rounded-xl mx-3 py-4 mb-3 -mt-10 bg-opacity-90">
            <div className="text-2xl font-medium"> {artist?.artist?.name}</div>
            <div className="text-sm">{artist?.artist?.alias?.[0]} </div>
            <div className="text-base">
              {follows?.fansCnt} <span className="text-sm">粉丝</span>
            </div>
          </div>
          <div className="bg-white pr-2 pl-4 rounded-2xl">
            <MusicList songs={TopSong} hasIndex={true}></MusicList>
          </div>
        </>
      ) : (
        <SpinLoading
          color="primary"
          className={'absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </div>
  );
};
