import './proFormaPage.scss';
import React, { Component } from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import actions from 'redux/actions/proFormActions';
import brickActions from 'redux/actions/brickActions';
import bricksActions from 'redux/actions/bricksActions';
import EditorRowComponent from './editorRow/editorRow';
import { ProFormaProps, ProFormaSubmitData } from './model';
import ProFormComponent from './proForm/proForm';
import MainMenu from '../base-components/main-menu';

const mapState = (state: any) => {
  return {
    submitted: state.proForm.submitted,
    data: state.proForm.data,
    bricks: state.bricks.bricks,
    brick: state.brick.brick,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchProForm: (brickId: string) => dispatch(actions.fetchBrickBuildData(brickId)),
    submitProForm: (data: ProFormaSubmitData) => dispatch(brickActions.saveBrick(data)),
    fetchBricks: () => dispatch(bricksActions.fetchBricks()),
    fetchBrick: (brickId: number) => dispatch(brickActions.fetchBrick(brickId)),
  }
}

const connector = connect(mapState, mapDispatch);

class ProFormaPage extends Component<ProFormaProps, any> {
  constructor(props: ProFormaProps) {
    super(props)
    const brickId: number = props.match.params.brickId;
    props.fetchProForm(brickId);

    if (brickId) {
      this.props.fetchBrick(brickId);
    }
    
    this.moveToInvestigationBuild = this.moveToInvestigationBuild.bind(this);
  }

  moveToInvestigationBuild() {
    if (this.props.submitted === true) {
      const {id} = this.props.brick;
      if (id) {
        this.props.history.push(`/build/brick/${id}/build/investigation/question`);
      }
    }
  }

  render() {
    this.moveToInvestigationBuild();
    let brick = null;
    const { brickId } = this.props.match.params;
    if (brickId) {
      brick = this.props.brick;
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
      <div>
        <MainMenu></MainMenu>
        <div className="create-brick-page">
          <EditorRowComponent />
          <ProFormComponent parent={this.props} brick={brick} />
        </div>
      </div>
    )
  }
}

export default connector(ProFormaPage);
