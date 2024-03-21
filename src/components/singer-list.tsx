import React, { useEffect, useState } from 'react';
import { Image, IndexBar, List, SpinLoading } from 'antd-mobile';
import { pinyin } from 'pinyin-pro';
import { Singer } from '../types/singer';
import { fetchSingerListData } from '../api/singer-list';
import { useNavigate } from 'react-router-dom';
import { MyLoading } from './my-loading';

export interface Group {
  title: string;
  list: Singer[];
}

interface SingerMap {
  [key: string]: {
    title: string;
    list: Singer[];
  };
}

export const SingerList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const history = useNavigate();

  useEffect(() => {
    fetchSingerListData()
      .then((v) => {
        const singers: Singer[] = v.data.artists;
        // 构造歌手 Map 数据结构
        const HOT_NAME = '热';
        const singerMap: SingerMap = {
          hot: {
            title: HOT_NAME,
            list: singers.slice(0, 10),
          },
        };

        singers.forEach((item: Singer) => {
          // 获取歌手名拼音的首字母
          const p = pinyin(item.name, { toneType: 'none' }).toUpperCase().slice(0, 1);
          if (!p || !p.length) {
            return;
          }
          // 获取歌手名拼音的首字母
          const key = p;
          if (key) {
            if (!singerMap[key]) {
              singerMap[key] = {
                title: key,
                list: [],
              };
            }
            // 每个字母下面会有多名歌手
            singerMap[key].list.push(item);
          }
        });

        // 热门歌手
        const hot = [];
        // 字母歌手
        const letter = [];

        // 遍历处理 singerMap，让结果有序
        for (const key in singerMap) {
          if (singerMap[key].title.match(/[a-zA-Z]/)) {
            letter.push(singerMap[key]);
          } else if (singerMap[key].title === HOT_NAME) {
            hot.push(singerMap[key]);
          }
        }

        // 按字母顺序排序
        letter.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        setGroups(hot.concat(letter));
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []);

  const gotoDetail = (id: number) => {
    history(`/artist/${id}`);
  };

  return (
    <div style={{ height: window.innerHeight }} className={'pb-36'}>
      {groups.length ? (
        <IndexBar>
          {groups.map((group) => {
            const { title, list } = group;
            return (
              <IndexBar.Panel index={title} title={title} key={title}>
                <List>
                  {list.map((item, index) => (
                    <List.Item key={index} onClick={() => gotoDetail(item.id)}>
                      <div className={'flex items-center'}>
                        <Image
                          placeholder={<MyLoading />}
                          fit={'cover'}
                          height={56}
                          width={56}
                          className=" rounded-full relative"
                          src={item.img1v1Url}
                          lazy={true}
                        />
                        <span className="py-0 ml-4 text-sm">{item.name}</span>
                      </div>
                    </List.Item>
                  ))}
                </List>
              </IndexBar.Panel>
            );
          })}
        </IndexBar>
      ) : (
        <SpinLoading
          color="white"
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      )}
    </div>
  );
};
