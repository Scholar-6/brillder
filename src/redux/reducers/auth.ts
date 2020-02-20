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
      return { isAuthenticated: false, error: action.error } as AuthState
    case types.LOGOUT_SUCCESS:
      return { isAuthenticated: false } as AuthState
    case types.AUTHORIZED_SUCCESS:
      return { isAuthenticated: true} as AuthState;
    case types.AUTHORIZED_FAILURE: 
      return { isAuthenticated: false} as AuthState;
    default: return state;
  }
}
