import types from '../types';


export interface PlayState {
  imageHovered: boolean;
  fileName: string;
  imageSource?: string;

  brickId: number;
  liveStep: number;
}

const AccountInitialState: PlayState = {
  imageHovered: false,
  fileName: '',
  imageSource: '',

  brickId: -1,
  liveStep: -1,
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.PLAY_ON_HOVER:
      return {...state, imageHovered: true , fileName: action.fileName, imageSource: action.imageSource} as PlayState;
    case types.PLAY_ON_BLUR: 
      return { ...state, imageHovered: false, fileName: '', imageSource: '' } as PlayState;
    case types.LIVE_STEP:
      return { ...state, liveStep: action.liveStep, brickId: action.brickId } as PlayState;
    default: return state;
  }
}

