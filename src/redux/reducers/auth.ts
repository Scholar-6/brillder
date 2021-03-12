import types from '../types';
import { isAuthenticated } from 'model/brick';
import { UserLoginType } from 'model/auth';
import { UserType } from 'model/user';


export interface AuthState {
  isAuthenticated: isAuthenticated;
  userType: UserLoginType;
  isRedirectedToProfile: boolean;
  defaultPreference?: UserType;
  error: string;
}

const AccountInitialState: AuthState = {
  isAuthenticated: isAuthenticated.None,
  userType: UserLoginType.None,
  isRedirectedToProfile: false,
  defaultPreference: undefined,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.AUTH_PROFILE_REDIRECT:
      return {...state, isRedirectedToProfile: true } as AuthState;
    case types.AUTH_DEFAULT_PREFERENCE:
      return {...state, defaultPreference: action.defaultPreference } as AuthState;
    case types.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: isAuthenticated.True, userType: action.userType } as AuthState
    case types.LOGIN_FAILURE:
      return { isAuthenticated: isAuthenticated.False, error: action.error } as AuthState
    case types.LOGOUT_SUCCESS:
      return { isAuthenticated: isAuthenticated.False } as AuthState
    case types.AUTHORIZED_SUCCESS:
      return { ...state, isAuthenticated: isAuthenticated.True } as AuthState;
    case types.AUTHORIZED_FAILURE: 
      return { isAuthenticated: isAuthenticated.False} as AuthState;
    default: return state;
  }
}
