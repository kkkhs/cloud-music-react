import axios from './base';
import { AxiosResponse } from 'axios';

export const fetchSongUrl = (id: number) => {
  return axios.get('song/url', { params: { id } });
};

export const fetchSongDetailData = (ids: string) => {
  return axios.get('song/detail', { params: { ids } });
};

// 获取歌词数据
export const fetchLyricData = (id: number) => {
  return axios.get('lyric', { params: { id } });
};
