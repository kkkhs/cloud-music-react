import { load } from '../../utils/array-store';
import { SEARCH_KEY } from '../../utils/const';

interface SearchReducer {
  query: string;
  isSearch: boolean;
  searchHistory: string[];
}

const initialState: SearchReducer = {
  query: '',
  isSearch: false,
  searchHistory: load(SEARCH_KEY),
};

interface SET_QUERY_ACTION {
  type: 'SET_QUERY';
  payload: {
    query: string;
  };
}

interface SET_IS_SEARCH_ACTION {
  type: 'SET_IS_SEARCH';
  payload: {
    isSearch: boolean;
  };
}

interface SET_SEARCH_HISTORY_ACTION {
  type: 'SET_SEARCH_HISTORY';
  payload: {
    searchHistory: string[];
  };
}

type Action = SET_QUERY_ACTION | SET_IS_SEARCH_ACTION | SET_SEARCH_HISTORY_ACTION;

const searchReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload.query };
    case 'SET_IS_SEARCH':
      return {
        ...state,
        isSearch: action.payload.isSearch,
      };
    case 'SET_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: action.payload.searchHistory,
      };
    default:
      return state;
  }
};

export default searchReducer;
