import types from '../types';


export interface PlayState {
  imageHovered: boolean;
  fileName: string;
  imageSource?: string;
}

const AccountInitialState: PlayState = {
  imageHovered: false,
  fileName: '',
  imageSource: ''
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.PLAY_ON_HOVER:
      return {...state, imageHovered: true , fileName: action.fileName, imageSource: action.imageSource} as PlayState;
    case types.PLAY_ON_BLUR: 
      return { ...state, imageHovered: false, fileName: '', imageSource: '' } as PlayState;
    default: return state;
  }
}

