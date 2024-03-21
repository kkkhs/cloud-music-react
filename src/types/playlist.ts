// 歌单详情

import { Song } from './song';

export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  description: string;
  shareCount: number;
  commentCount: number;
  subscribedCount: number;
  tracks: Song[];
  updateFrequency: string;
  score: string;
  trackCount: number;
  playCount: number;
  officialTags: string[];
  recommendText: string;
  creator: {
    nickname: string;
    avatarUrl: string;
  };
  top3: Song[];
}
