import types from '../types';

export interface RequestFailedState {
  failed: boolean;
  error: string;
}

const AccountInitialState: RequestFailedState = {
  failed: false,
  error: ""
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.REQUEST_FAILED:
      return { failed: true, error: action.error } as RequestFailedState;
    case types.REQUEST_FAILTURE_FORGOTTEN:
      return { failed: false, error: '' } as RequestFailedState;
    default: return state;
  }
}
