import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Simulate } from 'react-dom/test-utils';
import click = Simulate.click;
import useSearchHistory from './use-search-history';
import { flatten } from '@reduxjs/toolkit/dist/query/utils';

export const SearchInput = () => {
  const searchState = useSelector((state: RootState) => state.searchState);
  const query = searchState.query;
  const isSearch = searchState.isSearch;
  const dispatch = useDispatch();
  const history = useNavigate();
  const [inputValue, setInputValue] = useState(query);
  const { saveSearch } = useSearchHistory();

  // 保存搜索历史
  useEffect(() => {
    if (isSearch === true) {
      saveSearch(query);
    }
  }, [isSearch]);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    dispatch({
      type: 'SET_QUERY',
      payload: {
        query: event.target.value,
      },
    });
  };

  const clear = () => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        query: '',
      },
    });
    dispatch({
      type: 'SET_IS_SEARCH',
      payload: {
        isSearch: false,
      },
    });

    setInputValue('');
  };

  const search = () => {
    if (inputValue) {
      dispatch({
        type: 'SET_IS_SEARCH',
        payload: {
          isSearch: true,
        },
      });
    }
  };

  const onClickLeft = () => {
    if (!inputValue) {
      history(-1);
      dispatch({
        type: 'SET_IS_SEARCH',
        payload: {
          isSearch: false,
        },
      });
    } else {
      clear();
    }
  };

  const handleFocus = () => {
    dispatch({
      type: 'SET_IS_SEARCH',
      payload: {
        isSearch: false,
      },
    });
  };

  return (
    <div className="flex h-full w-full items-center">
      <div className={'w-fit pl-2'}>
        <ArrowLeftOutlined onClick={onClickLeft} className={'text-2xl flex items-center'} />
      </div>
      <div className="bg-white ml-2 h-9 items-center rounded-2xl px-3 border-solid border-[1px] border-slate-300 flex">
        <SearchOutlined className={'mr-2  text-xl opacity-60'} />
        <input
          className="flex-1 box-border outline-none text-lg"
          placeholder="搜索歌曲、歌手"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        {inputValue ? (
          <span>
            <CloseCircleFilled className={'text-xl opacity-60'} onClick={clear} />
          </span>
        ) : (
          <span className={'w-[20px]'}></span>
        )}
      </div>
      <span className="text-lg ml-2 " onClick={search}>
        搜索
      </span>
    </div>
  );
};
