import { SearchInput } from './search-input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import React, { useEffect, useState } from 'react';
import { HotList } from '../../types/hot-list';
import { fetchSearchHotData } from '../../api/search';
import { SearchHistory } from './search-history';
import { InfiniteScroll, PullToRefresh, SpinLoading } from 'antd-mobile';
import { SearchSuggest } from './search-suggest';
import { SearchResult } from './search-result';

export const Search = () => {
  const [hotLists, setHotLists] = useState<HotList[]>([]);
  const searchState = useSelector((state: RootState) => state.searchState);
  const query = searchState.query;
  const isSearch = searchState.isSearch;
  const searchHistory = searchState.searchHistory;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSearchHotData().then((v) => setHotLists(v.data.data));
  }, []);

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

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-200 flex flex-col z-10">
      <div className={'h-full w-full'}>
        <div
          className={`fixed left-0 top-0 right-0 h-14 z-50 bg-slate-200 ${query && isSearch ? 'bg-white' : ''}`}
        >
          <SearchInput />
        </div>
        {hotLists.length !== 0 ? (
          <div className={'fixed top-14 bottom-0 left-0 right-0 overflow-y-scroll'}>
            {!query ? (
              <div className={'h-full w-full'}>
                <PullToRefresh
                  onRefresh={async () => {
                    await fetchSearchHotData().then((v) => setHotLists(v.data.data));
                  }}
                >
                  <div className="h-fit pb-2 ">
                    {searchHistory.length ? (
                      <div className="mx-5 ">
                        <SearchHistory />
                      </div>
                    ) : null}
                    <div className="hot bg-white rounded-2xl mx-5 px-4 pb-1 pt-4 mt-4">
                      <div className=" pb-3 border-b-[1px] border-t-0 border-l-0 border-r-0 border-solid border-b-slate-200">
                        <span className=" font-bold text-xl"> 热搜榜 </span>
                      </div>
                      <div>
                        {hotLists.map((list, index) => (
                          <div
                            className=" my-2 flex items-center"
                            key={index}
                            onClick={() => addQuery(list.searchWord)}
                          >
                            <span
                              className={`text-xl text-opacity-80 w-8 ${index < 3 ? 'text-red-500 font-bold' : ''}`}
                            >
                              {index + 1}
                            </span>
                            <span className={`mr-1 text-base ${index < 3 ? 'font-bold' : ''}`}>
                              {list.searchWord}
                            </span>
                            <img className="h-4" src={list.iconUrl} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PullToRefresh>
                <InfiniteScroll
                  loadMore={() => fetchSearchHotData().then((v) => setHotLists(v.data.data))}
                  hasMore={false}
                />
              </div>
            ) : null}
            {query && !isSearch ? (
              <div className="search-suggest h-full w-full px-3">
                <SearchSuggest />
              </div>
            ) : null}
            {isSearch ? (
              <div className="search-result h-full w-full bg-white">
                <SearchResult query={query} />
              </div>
            ) : null}
          </div>
        ) : (
          <SpinLoading
            color="primary"
            className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
          />
        )}
      </div>
    </div>
  );
};
