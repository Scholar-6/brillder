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

const setUnauthReturnBrick = (brickId: number) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.UNAUTH_BRICK,
      brickId,
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

const setAssignPopup = (open: boolean) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.ASSIGN_OPEN,
      assignPopup: open
    } as Action);
  }
}

const setQuickAssignPopup = (open: boolean) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: types.QUICK_ASSIGN_OPEN,
      quickAssignPopup: open 
    } as Action);
  }
}

export default { setImageHover, setImageBlur, storeLiveStep, setUnauthReturnBrick, setAssignPopup, setQuickAssignPopup }
