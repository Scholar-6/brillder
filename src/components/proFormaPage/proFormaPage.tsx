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
    this.state = {
      subject: '',
      topic: '',
      subTopic: '',
      proposedTitle: '',
      alternativeTopics: '',
      investigationBrief: '',
      preparationBrief: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let stateChange = {} as any;
    let name = event.target.name;
    stateChange[name] = event.target.value;
    this.setState(stateChange);
  }

  handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let stateChange = {} as any;
    let name = event.target.name;
    stateChange[name] = event.target.value;
    this.setState(stateChange);
  }

  handleSubmit(event: any) {
    event.preventDefault();
    this.props.submitProForm(this.state);
    this.props.history.push("/brick-build");
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
