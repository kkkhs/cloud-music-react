import { fetchCommentMusicData } from '../../api/comment';
import React, { useEffect, useState } from 'react';
import { Comment, CommentContent } from '../../types/comment';
import { Divider, Image, InfiniteScroll, NavBar, Popup, PullToRefresh } from 'antd-mobile';
import { Song } from '../../types/song';
import { formatArtistName } from '../../utils/format-artist-name';
import { FireFilled, LikeOutlined } from '@ant-design/icons';

interface CommentMusicProps {
  visible: boolean;
  setVisible: (b: boolean) => void;
  song: Song;
}
export const CommentMusic = ({ visible, setVisible, song }: CommentMusicProps) => {
  const [comment, setComment] = useState<Comment>();
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async () => {
    await fetchCommentMusicData(song.id, offset).then((res) => {
      setHasMore(res.data.more);
      if (offset === 0) {
        setComment(res.data);
      } else {
        // @ts-ignore
        setComment((prevComment) => ({
          ...prevComment,
          hotComments: prevComment?.hotComments?.concat(res.data.comments),
        }));
      }
    });
  };

  useEffect(() => {
    setOffset(0);
    fetchComments();
  }, []);

  return (
    <Popup position="right" visible={visible}>
      <div className={'h-screen w-screen bg-slate-100'}>
        <NavBar className={'bg-white'} onBack={() => setVisible(false)}>
          <span className={'font-semibold'}>评论({comment?.total})</span>
        </NavBar>
        <div className={'h-full w-full overflow-y-scroll'}>
          <PullToRefresh
            onRefresh={async () => {
              setOffset(0);
              await fetchComments();
            }}
          >
            <div className={'text-black flex items-center bg-white h-14 w-full pr-4 pl-1'}>
              <div className={'h-14 w-14'}>
                <div className={`flex items-center justify-center h-full w-full `}>
                  <img className="h-10 w-10 rounded-full mx-0 my-auto" src={song?.al?.picUrl} />
                </div>
              </div>
              <p className="text-base flex-1 leading-5 font-normal line-clamp-1">
                {song.name}
                <span className="text-center text-sm leading-5 font-normal opacity-60">
                  {' '}
                  - {formatArtistName(song.ar)}
                </span>
              </p>
            </div>
            <div className={'w-full bg-white mt-2 px-3 pb-8'}>
              <div
                className={
                  'sticky -top-1 text-base leading-7 py-2 bg-white z-10 flex justify-between'
                }
              >
                <span>评论区</span>
                <span className='flex items-center'>
                  最热 <FireFilled className={'text-red-500 ml-2'} />
                </span>
              </div>
              <div>
                {comment?.hotComments?.map((item) => (
                  <div className={'flex'} key={item.commentId}>
                    <Image
                      lazy={true}
                      src={item?.user?.avatarUrl}
                      height={48}
                      width={48}
                      className={'rounded-full'}
                    />
                    <div className={'flex-1 ml-2'}>
                      <div className={'flex justify-between mb-2'}>
                        <div className={'flex flex-col '}>
                          <span className={'text-base font-semibold'}>{item?.user?.nickname}</span>
                          <span className={'opacity-70'}>{item.timeStr}</span>
                        </div>
                        <div className={'text-sm flex items-start pt-1'}>
                          {item.likedCount} <LikeOutlined className='ml-1 text-base flex items-center'/>
                        </div>
                      </div>
                      <div className={'text-sm'}>{item.content}</div>
                      <Divider />
                    </div>
                  </div>
                ))}
              </div>
              <InfiniteScroll
                loadMore={async () => {
                  setOffset((prev) => prev + 1);
                  await fetchComments();
                }}
                hasMore={hasMore}
              />
            </div>
          </PullToRefresh>
        </div>
      </div>
    </Popup>
  );
};
