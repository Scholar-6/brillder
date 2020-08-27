import types from '../types';


export interface StatsState {
  stats: any;
  error: string;
}

const StatsInitialState: StatsState = {
  stats: null,
  error: ""
}

export default (state = StatsInitialState, action: any) => {
  switch (action.type) {
    case types.GET_CLASS_STATS_SUCCESS:
      return { stats: action.stats } as StatsState
    case types.GET_CLASS_STATS_FAILURE:
      return { error: action.error } as StatsState
    default: return state;
  }
}
