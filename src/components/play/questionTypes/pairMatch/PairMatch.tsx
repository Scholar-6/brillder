import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import './PairMatch.scss';
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/model';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import {QuestionValueType} from 'components/build/buildQuestions/questionTypes/types';
import {Answer} from 'components/build/buildQuestions/questionTypes/pairMatchBuild/types';
import { PairMatchProps, PairMatchState, DragAndDropStatus } from './interface';
import {mark} from './service';
import MathInHtml from '../../baseComponents/MathInHtml';


class PairMatch extends CompComponent<PairMatchProps, PairMatchState> {
  constructor(props: PairMatchProps) {
    super(props);
    let status = DragAndDropStatus.None;
    let userAnswers = [];

    const {component} = props;
    if (props.isPreview === true) {
      userAnswers = component.list ? component.list : [];
    } else {
      if (this.props.attempt) {
        let choices = this.props.attempt.answer;
        userAnswers = Object.assign([], choices);
      } else {
        userAnswers =  component.choices ? component.choices : [];
      }
    }
    this.state ={ status, userAnswers };
  }

  UNSAFE_componentWillUpdate(props: PairMatchProps) {
    if (props.isPreview === true && props.component) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({userAnswers: props.component.list});
      }
    }
  }

  setUserAnswers(userAnswers: any[]) {
    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }
    if (status === DragAndDropStatus.Changed && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ status, userAnswers });
  }

  getAnswer(): any[] { return this.state.userAnswers; }

  getState(entry: number): number {
    if (this.props.attempt?.answer[entry]) {
      if (
        this.props.attempt.answer[entry].value.toLowerCase().replace(/ /g, '') ===
        this.props.component.list[entry].value.toLowerCase().replace(/ /g, '')
      ) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: ComponentAttempt<any>, prev: ComponentAttempt<any>) {
    return mark(this.props.component.list, attempt, prev, this.state.status, this.props.isReview);
  }

  renderOptionContent(answer: Answer) {
    if (answer.optionType && answer.optionType === QuestionValueType.Image) {
      return <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.optionFile}`} width="100%" />;
    }
    return <MathInHtml value={answer.option} />;
  }

  renderAnswerContent(answer: Answer) {
    if (answer.answerType && answer.answerType === QuestionValueType.Image) {
      return <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.valueFile}`} width="100%"/>;
    } else {
      return (
        <div
          className="MuiListItemText-root"
          style={{width: '100%', textAlign: 'center'}}
        >
          <MathInHtml value={answer.value} />
        </div>
      );
    }
  }

  renderAnswer(answer: any, i: number) {
    let className = "pair-match-play-choice";
    if (answer.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }
    if (this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        let state = this.getState(answer.index);
        if (state === 1) {
          className += " correct";
        } else {
          className += " wrong";
        }
      }
    }
    return (
      <div key={i} className={className}>
        <div className="MuiListItem-root" style={{height: '100%', textAlign: 'center'}}>
          {this.renderAnswerContent(answer)}
        </div>
      </div>
    );
  }

  renderOption(item: any, i: number) {
    let className = "pair-match-play-option";
    if (item.optionType === QuestionValueType.Image || item.answerType === QuestionValueType.Image) {
      className += " pair-match-image-choice";
    }
    if (item.optionType === QuestionValueType.Image) {
      className += " image-choice";
    }
    return (
      <ListItem key={i} className={className}>
        <div className="option-container">
					{this.renderOptionContent(item as any)}
        </div>
      </ListItem>
    );
  }

  render() {
    return (
      <div className="pair-match-play">
        <p className="help-text">Drag to rearrange.</p>
        <Grid container justify="center">
          <List style={{padding: 0}} className="answers-list">
          {
            this.props.component.list.map((item:any, i) => this.renderOption(item, i))
          }
          </List>
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            group={{ name: "cloning-group-name" }}
            className="answers-list"
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {
              this.state.userAnswers.map((a: Answer, i: number) => this.renderAnswer(a, i))
            }
          </ReactSortable>
        </Grid>
        <ReviewGlobalHint
          isReview={this.props.isReview}
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default PairMatch;
