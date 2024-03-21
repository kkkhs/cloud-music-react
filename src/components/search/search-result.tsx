import React, { useEffect, useRef, useState } from 'react';
import { Song } from '../../types/song';
import { Playlist } from '../../types/playlist';
import { Artist, Singer } from '../../types/singer';
import { fetchSongDetailData } from '../../api/song';
import { fetchSearchHotData, fetchSearchResultData } from '../../api/search';
import { InfiniteScroll, PullToRefresh, SpinLoading, Swiper, Tabs } from 'antd-mobile';
import { SwiperRef } from 'antd-mobile/es/components/swiper';
import { MusicList } from '../music-list';
import { Playlists } from '../playlists';
import { SingerLists } from '../singerlists';
import { sleep } from 'antd-mobile/es/utils/sleep';

const tabItems = [
  { key: '1', title: '单曲' },
  { key: '1000', title: '歌单' },
  { key: '100', title: '歌手' },
  // { key: '1002', title: '用户' },
];

export const SearchResult = ({ query }: { query: string }) => {
  const [tab, setTab] = useState(0);
  const [offset, setOffset] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlayLists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Singer[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  const getData = () => {
    fetchSearchResultData(query, Number(tabItems[tab].key), offset).then((v) => {
      //歌曲详情数据
      if (tabItems[tab].key === '1') {
        let songIds = '';
        for (let index = 0; index < v.data.result.songs.length; index++) {
          const id = v.data.result.songs[index].id + '';
          if (index === 0) {
            songIds += id;
          } else {
            songIds += ',' + id;
          }
        }
        fetchSongDetailData(songIds).then((hv) => {
          setSongs(hv.data.songs);
        });
      } else if (tabItems[tab].key === '1000') {
        setPlayLists(v.data.result.playlists);
      } else if (tabItems[tab].key === '100') {
        setArtists(v.data.result.artists);
      }

      // 获取hasMore的值
      setHasMore(v.data.result.hasMore);
    });
  };

  useEffect(() => {
    setOffset(0);
    getData();
  }, [tab]);

  async function loadMore() {
    await sleep(3000);
    if (!hasMore) {
      return;
    }
    setOffset(offset + 1);
    await fetchSearchResultData(query, Number(tabItems[tab].key), offset).then((res) => {
      if (tabItems[tab].key === '1') {
        let songIds = '';
        console.log(res.data.result.songs);
        for (let index = 0; index < res.data.result.songs.length; index++) {
          const id = res.data.result.songs[index].id + '';
          if (index === 0) {
            songIds += id;
          } else {
            songIds += ',' + id;
          }
        }
        fetchSongDetailData(songIds).then((hv) => {
          setSongs(songs.concat(hv.data.songs));
        });
      } else if (tabItems[tab].key === '1000') {
        setPlayLists(playlists.concat(res.data.result.playlists));
      } else if (tabItems[tab].key === '100') {
        setArtists(artists.concat(res.data.result.artists));
      }
      setHasMore(res.data.result.hasMore);
    });
  }

  return (
    <div className={'h-full w-full'}>
      {songs.length !== 0 ? (
        <div className={'h-full w-full fixed'}>
          <Tabs
            style={{ '--title-font-size': '14px' }}
            activeKey={tabItems[tab].key}
            onChange={(key) => {
              const index = tabItems.findIndex((item) => item.key === key);
              setTab(index);
              swiperRef.current?.swipeTo(index);
            }}
          >
            {tabItems.map((item) => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>
          <div className={'h-full w-full'}>
            <Swiper
              style={{ '--height': '100%' }}
              direction="horizontal"
              loop
              indicator={() => null}
              ref={swiperRef}
              defaultIndex={tab}
              onIndexChange={(index) => {
                setTab(index);
              }}
            >
              <Swiper.Item>
                <div className={'h-full w-full overflow-y-scroll pb-24'}>
                  <PullToRefresh
                    onRefresh={async () => {
                      await sleep(1000);
                      getData();
                    }}
                  >
                    <div className="pl-5 pr-0 ">
                      <MusicList
                        songs={songs}
                        hasIndex={false}
                        isHighLight={true}
                        keyWord={query}
                      />
                    </div>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                  </PullToRefresh>
                </div>
              </Swiper.Item>
              <Swiper.Item>
                <div className={'h-full w-full overflow-y-scroll pb-24'}>
                  <PullToRefresh
                    onRefresh={async () => {
                      await sleep(1000);
                      getData();
                    }}
                  >
                    <div className="pl-2 pr-0">
                      <Playlists playlists={playlists} />
                    </div>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                  </PullToRefresh>
                </div>
              </Swiper.Item>
              <Swiper.Item>
                <div className={'h-full w-full overflow-y-scroll pb-24'}>
                  <PullToRefresh
                    onRefresh={async () => {
                      await sleep(1000);
                      getData();
                    }}
                  >
                    <div className="pl-2 pr-0">
                      <SingerLists singers={artists} />
                    </div>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                  </PullToRefresh>
                </div>
              </Swiper.Item>
            </Swiper>
          </div>
        </div>
      ) : (
        <SpinLoading
          color="primary"
          className={'absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </div>
  );
};
