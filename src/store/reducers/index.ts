// 合并各个Reducer分支
import { combineReducers } from 'redux';

import counterReducer from './counterReducer';
import playReducer from './playReducer';
import windowReducer from './windowReducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  counter: counterReducer,
  playState: playReducer,
  windowState: windowReducer,
  searchState: searchReducer,
  // Add other reducers here...
});

export default rootReducer;
