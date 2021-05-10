import types from '../types';


export interface PlayState {
  imageHovered: boolean;
  fileName: string;
}

const AccountInitialState: PlayState = {
  imageHovered: false,
  fileName: ''
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.PLAY_ON_HOVER:
      return {...state, imageHovered: true , fileName: action.fileName} as PlayState;
    case types.PLAY_ON_BLUR: 
      return { ...state, imageHovered: false, fileName: '' } as PlayState;
    default: return state;
  }
}

