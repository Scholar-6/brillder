import types from '../types';

const MainPageInitialState = {
  data: {
    author: '',
    editor: '',
    comissionTime: '',
    subTitle: '',
    title: ''
  },
}

export default (state = MainPageInitialState, action: any) => {
  switch (action.type) {
    case types.FETCH_PRO_FORMA_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload
      }
    case types.FETCH_PRO_FORMA_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: ''
      }
    default: return state;
  }
}
