import axios from 'axios';
import { Action, Dispatch } from 'redux';
import { Comment } from 'model/comments';

import types from '../types';

const getCommentsSuccess = (comments: any) => ({
    type: types.GET_COMMENTS_SUCCESS,
    comments
} as Action);

const getCommentsFailure = (errorMessage: string) => ({
    type: types.GET_COMMENTS_FAILURE,
    error: errorMessage
} as Action);

const getComments = (brickId: number) => {
    return (dispatch: Dispatch) => {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/bricks/comments/${brickId}`,
            { withCredentials: true }
        ).then(response => {
            const {data} = response;
            dispatch(getCommentsSuccess(data));
        }).catch(error => {
            dispatch(getCommentsFailure(error.message));
        });
    }
}

export default { getComments };