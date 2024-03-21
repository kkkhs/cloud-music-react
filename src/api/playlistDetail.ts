import axios from './base';

export const fetchPlaylistDetailData = (id: number) => {
  return axios.get('playlist/detail', { params: { id } });
};
