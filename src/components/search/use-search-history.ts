/*
  将searchHistory存储到localStorage
*/

import { SEARCH_KEY } from '../../utils/const';
import { clear, remove, save } from '../../utils/array-store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function useSearchHistory() {
  const maxLen = 10;
  const searchState = useSelector((state: RootState) => state.searchState);
  const dispatch = useDispatch();

  // 保存
  function saveSearch(query: string) {
    const seaches = save(
      query,
      SEARCH_KEY,
      (item) => {
        return item === query;
      },
      maxLen,
    );
    dispatch({
      type: 'SET_SEARCH_HISTORY',
      payload: {
        searchHistory: seaches,
      },
    });
  }

  // 移除某项
  function deleteSearch(query: string) {
    const seaches = remove(SEARCH_KEY, (item) => {
      return item === query;
    });
    dispatch({
      type: 'SET_SEARCH_HISTORY',
      payload: {
        searchHistory: seaches,
      },
    });
  }

  //清空全部
  function clearSearch() {
    clear(SEARCH_KEY);
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch,
  };
}
