import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import { Brick } from 'model/brick';
import comments from './comments';
import service, { getPublicBrickById } from 'services/axios/brick';
import { Question } from 'model/question';

const fetchBrickSuccess = (data:any) => {
  return {
    type: types.FETCH_BRICK_SUCCESS,
    payload: data
  } as Action
}

const fetchBrickFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBrick = (id: number) => {
  return function (dispatch: any) {
    return axios.get(process.env.REACT_APP_BACKEND_HOST + '/brick/' + id, {withCredentials: true})
      .then(res => {
        const brick = res.data as Brick;
        brick.questions.sort((q1, q2) => q1.order - q2.order);
        dispatch(fetchBrickSuccess(brick));
        dispatch(comments.getComments(brick.id));
        return { status: res.status };
      })
      .catch((error) => {
        dispatch(fetchBrickFailure(error.message));
        return { status: error.request?.status }
      });
  }
}

const fetchPublicBrick = (id: number) => {
  return function (dispatch: any) {
    return getPublicBrickById(id).then(brick => {
      if (brick) {
        brick.questions.sort((q1, q2) => q1.order - q2.order);
        dispatch(fetchBrickSuccess(brick));
      } else {
        dispatch(fetchBrickFailure("failed to load"));
      }
    });
  }
}

const saveBrickSuccess = (brick: Brick) => {
  return {
    type: types.SAVE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const saveBrickFailure = (errorMessage:string) => {
  return {
    type: types.SAVE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const saveBrick = (brick:any) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.put(
      process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true, timeout: 10000}
    ).then(response => {
      const savedBrick = response.data as Brick;
      // response brick don`t have author object
      savedBrick.author = brick.author;
      dispatch(saveBrickSuccess(savedBrick));
      return savedBrick;
    }).catch(error => {
      dispatch(saveBrickFailure(error.message))
      return null;
    });
  }
}

const saveQuestionSuccess = (question: Question) => ({
  type: types.SAVE_QUESTION_SUCCESS,
  payload: question,
});

const saveQuestionFailure = (errorMessage: string) => ({
  type: types.SAVE_QUESTION_FAILURE,
  error: errorMessage,
});

const saveQuestion = (question: any) => {
  return function (dispatch: Dispatch) {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/question`, question, { withCredentials: true, timeout: 10000 }
    ).then(response => {
      const savedQuestion = response.data as Question;
      dispatch(saveQuestionSuccess(savedQuestion));
      return savedQuestion;
    }).catch(error => {
      dispatch(saveQuestionFailure(error.message));
      return null;
    })
  }
}

const forgetBrick = () => {
  return function (dispatch: Dispatch) {
    dispatch({ type: types.FORGET_BRICK })
  }
}

const createBrickSuccess = (brick: Brick) => {
  return {
    type: types.CREATE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const createBrickFailure = (errorMessage:string) => {
  return {
    type: types.CREATE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const createBrick = (brick:any) => {
  return function (dispatch: any) {
    brick.type = 1;
    return axios.post(process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true}).then(response => {
      const brick = response.data as Brick;
      dispatch(createBrickSuccess(brick));
      dispatch(comments.getComments(brick.id));
      return brick;
    })
    .catch(error => {
      dispatch(createBrickFailure(error.message))
    });
  }
}

const assignEditorSuccess = (brick: Brick) => {
  return {
    type: types.ASSIGN_EDITOR_SUCCESS,
    payload: brick,
  } as Action
}

const assignEditorFailure = (errorMessage:string) => {
  return {
    type: types.ASSIGN_EDITOR_FAILURE,
    error: errorMessage
  } as Action
}

const assignEditor = (brick: any, editorIds?: number[]) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignEditor`,
      { brickId: brick.id, editorIds }, {withCredentials: true}
    ).then(response => {
      const brick = response.data as Brick;
      dispatch(assignEditorSuccess(brick));
      return true;
    }).catch(error => {
      dispatch(assignEditorFailure(error.message))
      return false;
    });
  }
}

const sendToPublisher = (brickId: number) => {
  return async function (dispatch: Dispatch) {
    const res = await service.sendToPublisher(brickId);
    if (res) {
      dispatch({ type: types.SEND_TO_PUBLISHER_SUCCESS } as Action);
    } else {
      dispatch({ type: types.SEND_TO_PUBLISHER_FAILURE } as Action);
    }
    return res;
  }
}

const sendToPublisherConfirmed = () => {
  return async function (dispatch: Dispatch) {
    dispatch({ type: types.SEND_TO_PUBLISHER_CONFIRMED } as Action);
  }
}

export default {
  fetchBrick, fetchPublicBrick, forgetBrick,
  createBrick, saveBrick, saveQuestion,
  assignEditor, sendToPublisher, sendToPublisherConfirmed
}
