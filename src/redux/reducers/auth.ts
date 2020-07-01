import types from '../types';
import { isAuthenticated } from 'model/brick';
import { UserLoginType } from 'model/auth';


export interface AuthState {
  isAuthenticated: isAuthenticated;
  userType: UserLoginType;
  isRedirected: boolean;
  error: string;
}

const AccountInitialState: AuthState = {
  isAuthenticated: isAuthenticated.None,
  userType: UserLoginType.None,
  isRedirected: false,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { isAuthenticated: isAuthenticated.True, userType: action.userType, isRedirected: state.isRedirected } as AuthState
    case types.LOGIN_FAILURE:
      return { isAuthenticated: isAuthenticated.False, error: action.error } as AuthState
    case types.LOGOUT_SUCCESS:
      return { isAuthenticated: isAuthenticated.False } as AuthState
    case types.AUTHORIZED_SUCCESS:
      return { isAuthenticated: isAuthenticated.True} as AuthState;
    case types.AUTHORIZED_FAILURE: 
      return { isAuthenticated: isAuthenticated.False} as AuthState;
    default: return state;
  }
}
