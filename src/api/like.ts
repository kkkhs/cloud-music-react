import axios from './base';

// 是否喜欢音乐
export const fetchLikeMusic = (id: number, like = true) => {
  return axios.get('like', { params: { id, like } });
};

// 获取喜欢音乐列表
export const fetchLikeListData = (uid: number) => {
  return axios.get('likelist', { params: { uid } });
};
