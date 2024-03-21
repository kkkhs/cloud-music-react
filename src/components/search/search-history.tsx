import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import useSearchHistory from './use-search-history';
import { useEffect } from 'react';
import { Modal, Toast } from 'antd-mobile';
import { DeleteOutlined } from '@ant-design/icons';

export const SearchHistory = () => {
  const searchState = useSelector((state: RootState) => state.searchState);
  const searchHistory = searchState.searchHistory;
  const dispatch = useDispatch();
  const { clearSearch } = useSearchHistory();

  const addQuery = (s: string) => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        query: s,
      },
    });
    dispatch({
      type: 'SET_IS_SEARCH',
      payload: {
        isSearch: true,
      },
    });
  };

  // 清空搜索历史
  const clear = () => {
    Modal.confirm({
      content: '是否清空搜索历史?',

      onConfirm() {
        dispatch({
          type: 'SET_SEARCH_HISTORY',
          payload: {
            searchHistory: [],
          },
        });
        clearSearch();
        Toast.show({
          content: '搜索历史已清空',
          position: 'top',
        });
      },
    });
  };

  return (
    <div>
      <div className="w-full flex justify-between">
        <span className="font-semibold text-base">搜索历史</span>
        <DeleteOutlined onClick={clear} className=" opacity-50 text-xl flex items-center" />
      </div>
      <div className="flex flex-wrap pl-2 w-full">
        {searchHistory.map((item, index) => (
          <div
            key={index}
            className="mr-2 my-2 rounded-3xl px-3 opacity-80 bg-white py-[2px] max-w-40 truncate text-sm"
            onClick={() => addQuery(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
