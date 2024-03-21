import { Artist, Singer } from '../types/singer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Image } from 'antd-mobile';
import { Mark } from '../utils/mark';

export const SingerLists = ({ singers }: { singers: Singer[] }) => {
  const history = useNavigate();
  const searchState = useSelector((state: RootState) => state.searchState);
  const query = searchState.query;

  const gotoDetail = (id: number) => {
    history(`/artist/${id}`);
  };

  return (
    <div className="flex flex-col">
      {singers.map((singer) => (
        <div
          key={singer.id}
          className="flex items-center my-3"
          onClick={() => gotoDetail(singer.id)}
        >
          <div>
            <Image
              lazy={true}
              height={56}
              width={56}
              className="rounded-full mr-2"
              src={singer.picUrl}
            />
          </div>
          <div className="w-full flex flex-1 justify-between items-center border-solid border-t-0 border-l-0 border-r-0 border-b-[1px] border-slate-200 pb-1">
            <div>
              <span className="text-base font-medium mb-1 line-clamp-1">
                <Mark name={singer.name} keyWord={query} />
              </span>
              {singer?.fansGroup !== null ? (
                <span className=" text-sky-600">{singer?.fansGroup.text} &gt;</span>
              ) : null}
            </div>
            <div>
              <div className="transition-all ease-in-out text-xs border-solid rounded-3xl border-[1px] mr-8 py-1 px-2 text-red-500 border-red-500">
                {' '}
                + 关注
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
