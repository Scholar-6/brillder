import types from '../types';


interface UserState {
  user: any
  error: string
}

const AccountInitialState: UserState = {
  user: null,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.GET_USER_SUCCESS:
      return { user: action.user } as UserState
    case types.GET_USER_FAILURE:
      return { error: action.error } as UserState
    default: return state;
  }
}
