import types from '../types';

interface AccountState {
  loggedIn: boolean
  error: string
}

const AccountInitialState: AccountState = {
  loggedIn: false,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.REGISTER_SUCCESS:
      return { } as AccountState
    case types.REGISTTER_FAILURE:
      return { error: action.error } as AccountState
    default: return state;
  }
}
