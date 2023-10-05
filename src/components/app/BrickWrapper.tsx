import React from 'react';
import { Brick, isAuthenticated } from "model/brick";
import { connect } from 'react-redux';

import actions from "redux/actions/brickActions";
import { ReduxCombinedState } from 'redux/reducers';
import PageLoader from 'components/baseComponents/loaders/pageLoader';


interface StudentRouteProps {
  component: any;
  brick: Brick;
  isRedirectedToProfile: boolean;
  match: any;
  isAuthenticated: isAuthenticated;
  fetchBrickWithoutComments(brickId: number): void;
  fetchPublicBrick(brickId: number): void;
}

const BrickWrapper: React.FC<StudentRouteProps> = ({ component: Component, ...props }) => {
  const brickId = parseInt(props.match.params.brickId);
  const {brick} = props;
  if (brick && brick.id && brick.id === brickId && brick.author) {
    return <Component {...props} />
  } else {
    if (props.isAuthenticated === isAuthenticated.False) {
      props.fetchPublicBrick(brickId);
    } else {
      props.fetchBrickWithoutComments(brickId);
    }
    return <PageLoader content="...Forbidden..." />;
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrickWithoutComments: (id: number) => dispatch(actions.fetchBrickWithoutComments(id)),
  fetchPublicBrick: (id: number) => dispatch(actions.fetchPublicBrick(id))
});

const connector = connect(mapState, mapDispatch)

export default connector(BrickWrapper);
