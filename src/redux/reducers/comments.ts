import types from '../types';
import { Comment } from 'model/comments';

export interface CommentsState {
    comments: Comment[] | null;
    error: string;
}

const CommentsInitialState = {
    comments: null,
    error: ""
};

export default (state = CommentsInitialState, action: any) => {
    switch(action.type) {
        case types.GET_COMMENTS_SUCCESS:
            return { comments: action.comments } as CommentsState;
        case types.GET_COMMENTS_FAILURE:
            return { error: action.error } as CommentsState;
        default:
            return state;
    }
}