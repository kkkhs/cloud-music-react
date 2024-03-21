import axios from './base';
import { AxiosResponse } from 'axios';

export const fetchRecommendedPlayListData = (limit = 30): Promise<AxiosResponse<any, any>> => {
  return axios.get('personalized', { params: { limit } });
};
