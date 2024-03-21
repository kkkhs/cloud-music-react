import axios from './base';

export const fetchArtistDetailData = (id: number) => {
  return axios.get('artist/detail', { params: { id } });
};

export const fetchArtistFollowCount = (id: number) => {
  return axios.get('artist/follow/count', { params: { id } });
};

export const fetchArtistTopSong = (id: number) => {
  return axios.get('artist/top/song', { params: { id } });
};
