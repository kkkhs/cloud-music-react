import axios from './base';

export const fetchCommentMusicData = (id: number, offset: number, limit = 20) => {
  return axios.get('comment/music', { params: { id, limit, offset } });
};
