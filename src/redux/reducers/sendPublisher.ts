import types from '../types';

export interface SendPublisherState {
  success: boolean;
  confirmed: boolean;
}

const SendPublisherInitState: SendPublisherState = {
  success: false,
  confirmed: false,
}

export default (state = SendPublisherInitState, action: any) => {
  switch (action.type) {
    case types.SEND_TO_PUBLISHER_SUCCESS:
      return { success: true, confirmed: false };
    case types.SEND_TO_PUBLISHER_CONFIRMED:
      return { success: state.success, confirmed: true };
    case types.SEND_TO_PUBLISHER_FAILURE:
      return { success: false, confirmed: state.confirmed };
    default: return state;
  }
}
