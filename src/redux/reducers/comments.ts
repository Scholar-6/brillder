import types from '../types';
import { Comment } from 'model/comments';
import comments from 'redux/actions/comments';
import { stat } from 'fs';

export interface CommentsState {
    comments: Comment[] | null;
    mostRecentComment: Comment | null;
    error: string;
}

const CommentsInitialState = {
    comments: null,
    mostRecentComment: null,
    error: ""
};

export default (state = CommentsInitialState, action: any): CommentsState => {
    switch(action.type) {
        case types.GET_COMMENTS_SUCCESS:
            return { comments: action.comments } as CommentsState;
        case types.GET_COMMENTS_FAILURE:
            return { error: action.error } as CommentsState;
        case types.CREATE_COMMENT_SUCCESS:
            return { comments: [ ...state.comments ?? [], action.newComment ], mostRecentComment: action.newComment } as CommentsState;
        case types.CREATE_COMMENT_FAILURE:
            return { ...state, error: action.error } as CommentsState;
        case types.EDIT_COMMENT:
            return {
                comments: (state.comments ?? []).map((comment: Comment) => {
                    if(comment.id == action.commentId) {
                        return { ...comment, text: action.newText }
                    } else {
                        return comment;
                    }
                })
            } as CommentsState;
        default:
            return state;
    }
}