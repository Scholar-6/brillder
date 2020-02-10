import types from '../types';

interface AuthState {
  isAuthenticated: boolean
  error: string
}

const AccountInitialState: AuthState = {
  isAuthenticated: false,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { isAuthenticated: true } as AuthState
    case types.LOGIN_FAILURE:
      return { error: action.error } as AuthState
    case types.LOGOUT_SUCCESS:
      return { isAuthenticated: false } as AuthState
    default: return state;
  }
}
