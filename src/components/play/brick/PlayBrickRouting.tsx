import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { connect } from "react-redux";

import actions from 'redux/actions/brickActions';
import Introduction from './Introduction';


const BrickRouting: React.FC<any> = (props) => {
  if (!props.brick) {
    let brickId = props.match.params.brickId;
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }
  return (
    <Switch>
      <Route exac path="/play/brick/:brickId/intro">
        <Introduction brick={props.brick} />
      </Route>
    </Switch>
  );
}


const mapState = (state: any) => {
  return {
    brick: state.brick.brick,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (id:number) => dispatch(actions.fetchBrick(id)),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);