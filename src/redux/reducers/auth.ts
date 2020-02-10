import types from '../types';

interface AccountState {
  isAuthenticated: boolean
  error: string
}

const AccountInitialState: AccountState = {
  isAuthenticated: false,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { isAuthenticated: true } as AccountState
    case types.LOGIN_FAILURE:
      return { error: action.error } as AccountState
    default: return state;
  }
}
