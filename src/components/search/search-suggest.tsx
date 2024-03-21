import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import React, { useEffect, useState } from 'react';
import { fetchSearchSuggestData } from '../../api/search';
import { SearchOutlined } from '@ant-design/icons';
import { Mark } from '../../utils/mark';
import { SpinLoading } from 'antd-mobile';

interface suggest {
  keyword: string;
}

export const SearchSuggest = () => {
  const searchState = useSelector((state: RootState) => state.searchState);
  const query = searchState.query;
  const dispatch = useDispatch();

  const [suggests, setSuggests] = useState<suggest[] | undefined>([]);

  useEffect(() => {
    fetchSearchSuggestData(query).then((v) => {
      setSuggests(v.data.result.allMatch);
    });
  }, [query]);

  const handleClick = (word: string) => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        query: word,
      },
    });
    dispatch({
      type: 'SET_IS_SEARCH',
      payload: {
        isSearch: true,
      },
    });
  };

  const back = () => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        query: '',
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      {suggests?.length === 0 ? (
        <SpinLoading
          color="primary"
          className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        />
      ) : suggests === undefined ? (
        <div className="ml-6 text-lg mt-3">暂无搜索建议...</div>
      ) : (
        <div>
          {suggests.map((item, index) => (
            <div>
              <div
                className=" h-12 flex items-center"
                key={item.keyword}
                onClick={() => handleClick(item.keyword)}
              >
                <SearchOutlined className={'mr-2 text-lg  opacity-60 flex items-center'} />
                <span className=" flex-1 border-solid border-t-0 border-l-0 border-r-0 border-slate-300 border-b-[1px] text-base leading-10 line-clamp-1">
                  <Mark name={item.keyword} keyWord={query} />
                </span>
              </div>
              <div className="w-full flex-1" onClick={back}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
