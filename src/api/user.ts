import axios from './base';

// 登陆信息
export const fetchUserData = () => {
  return axios.get('user/account');
};

// 用户详情
export const fetchUserDetailData = (uid: number) => {
  return axios.get('user/detail', { params: { uid } });
};

// 用户歌单
export const fetchUserPlaylistData = (uid: number) => {
  return axios.get('user/playlist', { params: { uid } });
};

// 每日推荐歌曲
export const fetchDailySongsData = () => {
  return axios.get('recommend/songs');
};
