import { Banners } from './banners';
import { SelectLine } from './select-line';
import { Divider } from 'antd-mobile';
import { RawSongList } from './raw-song-list';

export const RecommendTab = () => {
  return (
    <>
      <div className={'mt-2 min-h-36'}>
        <Banners />
      </div>
      <div className={'mt-3 px-3'}>
        <SelectLine />
      </div>
      <Divider className={'mb-1'} />
      <div>
        <RawSongList />
      </div>
    </>
  );
};
