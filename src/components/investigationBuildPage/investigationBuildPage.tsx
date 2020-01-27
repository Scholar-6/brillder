import React, { Component } from 'react'
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { Route, Switch } from 'react-router-dom';

import './investigationBuildPage.scss'
import BuildPageHeaderComponent from './header/pageHeader';
import actions from '../../redux/actions/proFormActions';
import brickActions from '../../redux/actions/brickActions';
import QuestionComponent from './questionComponent';
import QuestionTypePage from './questionType';


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

const connector = connect(mapState, mapDispatch)

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

    const { brickId } = this.props.match.params;
    props.fetchProForma();
    props.fetchBrick(brickId);
  }

  render() {
    return (
      <div className="investigation-build-page">
        <BuildPageHeaderComponent />
        <Switch>
          <Route exac path={`/build/investigation/question/component`}>
            <QuestionComponent type={1} />
          </Route>
          <Route exac path={`/build/investigation/question`}>
            <QuestionTypePage />
          </Route>
        </Switch>
      </div>
    )
  }
}

export default connector(InvestigationBuildPage);
