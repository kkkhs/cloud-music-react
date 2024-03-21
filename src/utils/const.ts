import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh';

export const SEARCH_KEY = '__search__'; // 搜索历史数据
export const PLAY_KEY = '__play__'; // 播放历史数据

export const PLAY_MODE = {
  sequence: 0, //顺序播放
  loop: 1, //循环播放
  random: 2, //随机播放
};

export const statusRecord: Record<PullStatus, string> = {
  pulling: '用力拉',
  canRelease: '松开吧',
  refreshing: '玩命加载中...',
  complete: '好啦',
};
