import axios from './base';

// 登陆信息
export const fetchUserData = () => {
  return axios.get('user/account');
};

// 用户详情
export const fetchUserDetailData = (uid: number) => {
  return axios.get('user/detail', { params: uid });
};
