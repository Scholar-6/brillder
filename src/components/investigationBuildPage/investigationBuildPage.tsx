import React, { Component } from 'react'
import Dustbin from './DragDustbin'
import Box from './DragBox'
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import actions from '../../redux/actions/proFormActions';
import brickActions from '../../redux/actions/brickActions';


interface InvestigationBuildProps extends RouteComponentProps<any> {
  fetchBrick: Function,
  fetchProForma: Function
}

type InvestigationBuildState = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  proposedTitle: string,
  investigationBrief: string,
  preparationBrief: string
}

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

class InvestigationBuildPage extends Component<InvestigationBuildProps, InvestigationBuildState>  {
  constructor(props: InvestigationBuildProps) {
    super(props)
    this.state = {
      subject: '',
      topic: '',
      subTopic: '',
      proposedTitle: '',
      alternativeTopics: '',
      investigationBrief: '',
      preparationBrief: ''
    }

    const {brickId} = this.props.match.params;
    props.fetchProForma();
    props.fetchBrick(brickId);
  }

  render() {
    return (
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
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
      </div>
    )
  }
}

export default connector(InvestigationBuildPage);
