import './bricksListPage.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapState = (state: any) => {
  return {
  }
}

const mapDispatch = (dispatch: any) => {
  return {
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class BricksListPage extends Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <div className="bricks-list-page">
        List of bricks. Comming soon.
      </div>
    )
  }
}

export default connector(BricksListPage);
