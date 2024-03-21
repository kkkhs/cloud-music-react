import axios from './base';
import { AxiosResponse } from 'axios';

export const fetchBannerData = (type: number = 0): Promise<AxiosResponse<any, any>> => {
  return axios.get('banner', { params: { type } });
};
