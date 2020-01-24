import './proFormaPage.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions/proFormActions';
import brickActions from '../../redux/actions/brickActions';
import EditorRowComponent from './editorRow/editorRow';
import { ProFormaProps, ProFormaSubmitData } from './model';
import ProFormComponent from './proForm/proForm';

const mapState = (state: any) => {
  return {
    submitted: state.proForm.submitted,
    data: state.proForm.data,
    bricks: state.brick.bricks,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchProForm: (brickId: string) => dispatch(actions.fetchBrickBuildData(brickId)),
    submitProForm: (data:ProFormaSubmitData) =>  dispatch(actions.submitBrickBuildData(data)),
    fetchBricks: () => dispatch(brickActions.fetchBricks()),
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class ProFormaPage extends Component<ProFormaProps, any> {
  constructor(props: ProFormaProps) {
    super(props)
    const {brickId} = props.match.params;
    props.fetchProForm(brickId);
    if (brickId) {
      this.props.fetchBricks();
    }
  }

  render() {
    console.log(55);
    let brick = null;
    const {brickId} = this.props.match.params;
    if (brickId) {
      brick = this.props.bricks.find(b => b.id == brickId);
    }

    if (this.props.data == null) {
      return (
        <div>...Loading...</div>
      )
    }

    if (brickId && brick == null) {
      return (
        <div>...Loading...</div>
      )
    }

    return (
      <div className="create-brick-page">
        <EditorRowComponent />
        <ProFormComponent parent={this.props} brick={brick} />
      </div>
    )
  }
}

export default connector(ProFormaPage);
