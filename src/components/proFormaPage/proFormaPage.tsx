import './proFormaPage.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions/proFormActions';
import EditorRowComponent from './editorRow/editorRow';
import { ProFormaProps, ProFormaState, ProFormaSubmitData } from './model';
import ProFormComponent from './proForm/proForm';

const mapState = (state: any) => {
  return {
    data: state.proForm.data
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    fetchProForm: (brickId: string) => dispatch(actions.fetchBrickBuildData(brickId)),
    submitProForm: (data:ProFormaSubmitData) =>  dispatch(actions.submitBrickBuildData(data)),
  }
}

const connector = connect(
  mapState,
  mapDispatch
)

class ProFormaPage extends Component<ProFormaProps, ProFormaState> {
  constructor(props: ProFormaProps) {
    super(props)
    const {brickId} = props.match.params;
    props.fetchProForm(brickId);
  }

  render() {
    if (this.props.data == null) {
      return (
        <div>...Loading...</div>
      )
    }
    return (
      <div className="create-brick-page">
        <EditorRowComponent />
        <ProFormComponent parent={this.props} />
      </div>
    )
  }
}

export default connector(ProFormaPage);
