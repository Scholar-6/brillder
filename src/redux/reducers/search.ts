import types from '../types';

export interface SearchState {
  value: string;
}

const SearchInitialState: SearchState = {
  value: "",
}

export default (state = SearchInitialState, action: any) => {
  switch (action.type) {
    case types.CLEAR_SEARCH:
      return { ...state, value: "" } as SearchState;
    case types.SET_SEARCH_VALUE:
      return { ...state, value: action.value } as SearchState;
    default: return state;
  }
}
