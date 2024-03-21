import { Playlist } from '../types/playlist';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { Mark } from '../utils/mark';
import { Image } from 'antd-mobile';

export const Playlists = ({ playlists }: { playlists: Playlist[] }) => {
  const history = useNavigate();
  const searchState = useSelector((state: RootState) => state.searchState);
  const query = searchState.query;

  const gotoDetail = (id: number) => {
    history(`/playlist/detail/${id}`);
  };

  return (
    <div className="">
      {playlists.length !== 0 ? (
        <>
          {playlists.map((list) => (
            <div className="flex mr-2" key={list.id} onClick={() => gotoDetail(list.id)}>
              <Image
                lazy={true}
                height={64}
                width={64}
                className=" rounded-xl my-2"
                src={list.coverImgUrl}
              />
              <div className=" flex flex-col py-1 ml-3">
                <div className=" text-base my-2 line-clamp-1 font-medium">
                  <Mark name={list.name} keyWord={query} />
                </div>
                <div className="line-clamp-1">
                  {list?.score !== null ? (
                    <span className=" inline-block text-red-500 text-center w-fit border-solid border-[1px]  rounded text-xs font-medium border-red-300 leading-[14px] mr-1">
                      {list?.score}分
                    </span>
                  ) : null}
                  <span className=" text-sm opacity-80">
                    {list.trackCount}首 ,by {list?.creator.nickname} ,播放{list.playCount}次
                  </span>
                </div>
                {list?.officialTags !== null ? (
                  <div>
                    {list.officialTags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-orange-600 bg-orange-100 text-[11px] w-fit max-w-[263px] px-1 leading-5 rounded-sm mt-1 mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : list.recommendText !== null ? (
                  <div className="opacity-80">
                    <Mark name={list?.recommendText} keyWord={query} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};
