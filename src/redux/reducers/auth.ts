import types from '../types';
import { isAuthenticated } from 'model/brick';
import { UserType } from 'model/user';


export interface AuthState {
  isAuthenticated: isAuthenticated;
  isActivated: boolean;
  isRedirectedToProfile: boolean;
  defaultPreference?: UserType;
  defaultSubject?: number;
  intendedPath: string;
  referralId?: string;
  error: string;
}

const AccountInitialState: AuthState = {
  isAuthenticated: isAuthenticated.None,
  isActivated: false,
  isRedirectedToProfile: false,
  defaultPreference: undefined,
  defaultSubject: undefined,
  intendedPath: "/home",
  referralId: undefined,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.AUTH_PROFILE_REDIRECT:
      return {...state, isRedirectedToProfile: true } as AuthState;
    case types.AUTH_DEFAULT_USER_PROPERTIES:
      return {...state, defaultPreference: action.defaultPreference, defaultSubject: action.defaultSubject } as AuthState;
    case types.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: isAuthenticated.True } as AuthState;
    case types.LOGIN_FAILURE:
      return { ...state, isAuthenticated: isAuthenticated.False, error: action.error } as AuthState;
    case types.LOGOUT_SUCCESS:
      return { ...state, isAuthenticated: isAuthenticated.False } as AuthState;
    case types.AUTHORIZED_SUCCESS:
      return { ...state, isAuthenticated: isAuthenticated.True } as AuthState;
    case types.AUTHORIZED_FAILURE: 
      return { ...state, isAuthenticated: isAuthenticated.False} as AuthState;
    case types.SET_INTENDED_PATH:
      return { ...state, intendedPath: action.path } as AuthState;
    case types.SET_REFERRAL_ID:
      return { ...state, referralId: action.referralId } as AuthState;
    default: return state;
  }
}
