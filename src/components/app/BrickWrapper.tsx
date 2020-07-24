import React from 'react';
import { Brick } from "model/brick";
// @ts-ignore
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import { ReduxCombinedState } from 'redux/reducers';
import PageLoader from 'components/baseComponents/loaders/pageLoader';


interface StudentRouteProps {
  component: any;
  brick: Brick;
  isRedirectedToProfile: boolean;
  match: any;
  getUser():void;
  isAuthorized():void;
}

const BrickWrapper: React.FC<StudentRouteProps> = ({ component: Component, ...props }) => {
  const brickId = parseInt(props.match.params.brickId);
  const {brick} = props;
  if (brick && brick.id && brick.id === brickId && brick.author) {
    return <Component {...props} />
  } else {
    return <PageLoader content="...Forbidden..." />;
  }
}

const mapState = (state: ReduxCombinedState) => ({
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

const connector = connect(mapState, mapDispatch)

export default connector(BrickWrapper);
