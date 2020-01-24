import React, { Component } from 'react'
import Dustbin from './DragDustbin'
import Box from './DragBox'
import { connect } from 'react-redux';
import actions from '../../redux/actions/proFormActions';
import brickActions from '../../redux/actions/brickActions';

const mapState = (state: any) => {
    return {
      data: state
    }
  }
  
  const mapDispatch = (dispatch: any) => {
    return {
      fetchBrick: (brickId: number) => dispatch(brickActions.fetchBrick(brickId)),
      fetchProForma: () => dispatch(actions.fetchBrickBuildData())
    }
  }
  
  const connector = connect(
    mapState,
    mapDispatch
  )

class Container extends Component {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <div>
    <div style={{ overflow: 'hidden', clear: 'both' }}>
      <Dustbin allowedDropEffect="any" />
      <Dustbin allowedDropEffect="copy" />
      <Dustbin allowedDropEffect="move" />
    </div>
    <div style={{ overflow: 'hidden', clear: 'both' }}>
      <Box name="Glass" />
      <Box name="Banana" />
      <Box name="Paper" />
    </div>
  </div>
        )
    }
}

export default connector(Container);
