import axios from './base';

// 热搜
export const fetchSearchHotData = () => {
  return axios.get('search/hot/detail');
};

// 搜索建议
export const fetchSearchSuggestData = (keywords: string) => {
  return axios.get('search/suggest', { params: { keywords, type: 'mobile' } });
};

// 搜索结果
export const fetchSearchResultData = (
  keywords: string,
  type: number,
  offset: number,
  limit = 15,
) => {
  return axios.get('search/', {
    params: {
      keywords,
      limit,
      offset,
      type,
    },
  });
};

// 搜索建议
export const fetchSearchDefaultData = () => {
  return axios.get('search/default');
};
