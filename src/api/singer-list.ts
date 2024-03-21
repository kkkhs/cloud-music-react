import axios from './base';
import { AxiosResponse } from 'axios';

export const fetchSingerListData = (limit = 100): Promise<AxiosResponse<any, any>> => {
  return axios.get('artist/list', { params: { type: -1, area: -1, limit } });
};
