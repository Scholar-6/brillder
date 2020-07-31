import types from '../types';
import { Comment } from 'model/comments';
//import comments from 'redux/actions/comments';
//import { stat } from 'fs';

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
            return state as CommentsState;
        case types.CREATE_COMMENT_FAILURE:
            return { ...state, error: action.error } as CommentsState;
        case types.EDIT_COMMENT:
            return {
                comments: (state.comments ?? []).map((comment: Comment) => {
                    /*eslint-disable-next-line*/
                    if(comment.id == action.commentId) {
                        return { ...comment, text: action.newText }
                    } else {
                        return comment;
                    }
                })
            } as CommentsState;
        case types.NEW_COMMENT:
            if(!action.comment.parent) {
                return {
                    ...state, 
                    comments: [ ...(state.comments ?? []), action.comment ],
                    mostRecentComment: action.comment
                } as CommentsState;
            } else {
                return {
                    ...state,
                    comments: (state.comments ?? []).map((comment: Comment) => {
                        if(comment.id === action.comment.parent.id) {
                            return { ...comment, children: [ ...(comment.children ?? []), { ...action.comment, parent: undefined } ] }
                        } else return comment;
                    }),
                    mostRecentComment: action.comment
                }
            }
        default:
            return state;
    }
}