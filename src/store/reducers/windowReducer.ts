import { Reducer } from 'redux';

interface WindowReducer {
  index: number;
}

const initialState: WindowReducer = {
  index: 0,
};

interface SET_WINDOW_ACTION {
  type: 'SET_WINDOW';
  payload: {
    index: number;
  };
}

type Action = SET_WINDOW_ACTION;

const windowReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'SET_WINDOW':
      return { ...state, index: action.payload.index };
    default:
      return state;
  }
};

export default windowReducer;
