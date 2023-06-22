import types from '../types';


export interface PlayState {
  imageHovered: boolean;
  fileName: string;
  imageSource?: string;

  brickId: number;
  liveStep: number;

  assignPopup: boolean;
  quickAssignPopup: boolean;
}

const AccountInitialState: PlayState = {
  imageHovered: false,
  fileName: '',
  imageSource: '',

  brickId: -1,
  liveStep: -1,

  assignPopup: false,
  quickAssignPopup: false
}

export default (state = AccountInitialState, action: any) => {
  switch (action.type) {
    case types.PLAY_ON_HOVER:
      return {...state, imageHovered: true , fileName: action.fileName, imageSource: action.imageSource} as PlayState;
    case types.PLAY_ON_BLUR: 
      return { ...state, imageHovered: false, fileName: '', imageSource: '' } as PlayState;
    case types.LIVE_STEP:
      return { ...state, liveStep: action.liveStep, brickId: action.brickId } as PlayState;
    case types.ASSIGN_OPEN:
      return { ...state, assignPopup: action.assignPopup } as PlayState;
    case types.QUICK_ASSIGN_OPEN:
      return { ...state, quickAssignPopup: action.quickAssignPopup } as PlayState;
    default: return state;
  }
}

