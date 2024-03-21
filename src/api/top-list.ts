import axios from './base';

export const fetchTopListData = () => {
  return axios.get('toplist');
};
