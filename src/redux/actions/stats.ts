import axios from 'axios';
import { Action, Dispatch } from 'redux';

import types from '../types';

const getClassStatsSuccess = (stats: any) => ({
    type: types.GET_CLASS_STATS_SUCCESS,
    stats
});

const getClassStatsFailure = (error: string) => ({
    type: types.GET_CLASS_STATS_FAILURE,
    error
});

const getClassStats = (classroomId: number) => (dispatch: Dispatch) => {
    axios.get(
        `${process.env.REACT_APP_BACKEND_HOST}/stats/classroom/${classroomId}`,
        { withCredentials: true }
    ).then(response => {
        const {data} = response;
        dispatch(getClassStatsSuccess(data));
    }).catch(error => {
        dispatch(getClassStatsFailure(error.message));
    });
}

export default { getClassStats };