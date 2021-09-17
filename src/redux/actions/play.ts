import types from '../types';
import { Action, Dispatch } from 'redux';

const setImageHover = (fileName: string, imageSource: string) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.PLAY_ON_HOVER,
      fileName,
      imageSource
    } as Action);
  }
}

const setImageBlur = () => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.PLAY_ON_BLUR,
      fileName: '',
      imageSource: ''
    } as Action);
  }
}

const storeLiveStep = (liveStep: number, brickId: number) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.LIVE_STEP,
      brickId,
      liveStep,
    } as Action);
  }
}

export default { setImageHover, setImageBlur, storeLiveStep }
