import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';

import './PairMatch.scss';
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/model';
import {QuestionValueType} from 'components/build/buildQuestions/questionTypes/types';
import {Answer} from 'components/build/buildQuestions/questionTypes/pairMatchBuild/types';
import { PairMatchProps, PairMatchState, DragAndDropStatus, PairMatchAnswer, PairMatchComponent } from './interface';
import MathInHtml from '../../baseComponents/MathInHtml';
import { Hint, HintStatus } from 'model/question';
import PairMatchOption from './PairMatchOption';
import PairMatchImageContent from './PairMatchImageContent';


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

        if (this.props.isBookPreview) {
          userAnswers = this.props.answers as any;
        }
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
    if (props.isBookPreview === true) {
      if (this.state.userAnswers !== props.answers as any) {
        this.setState({userAnswers: this.props.answers as any});
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
      if (this.props.attempt.answer[entry].index === this.props.component.list[entry].index) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  getBookState(entry: number): number {
    const answers = this.props.answers as any;
    if (
      answers[entry].value.toLowerCase().replace(/ /g, '') ===
      this.props.component.list[entry].value.toLowerCase().replace(/ /g, '')
    ) {
      return 1;
    } else { return -1; }
  }

  prepareAttempt(component: PairMatchComponent, attempt: ComponentAttempt<PairMatchAnswer>) {
    if (this.state.status === DragAndDropStatus.Changed) {
      attempt.dragged = true;
    }

    return attempt;
  }

  renderAnswerContent(answer: Answer) {
    if (answer.answerType && answer.answerType === QuestionValueType.Image) {
      return (
        <PairMatchImageContent fileName={answer.valueFile} imageCaption={answer.imageCaption} />
      );
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

  renderEachHint(hint: Hint, i: number) {
    if (hint.status === HintStatus.Each) {
      let value = hint.list[i];
      return (
        <div className="question-hint">
          <MathInHtml value={value} />
        </div>
      );
    }
    return '';
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
    if (this.props.isBookPreview) {
      try {
        let state = this.getBookState(answer.index);
        if (state === 1) {
          className += " correct";
        } else {
          className += " wrong";
        }
      } catch {
        console.log('can`t find pair match answer');
      }
    }
    return (
      <div key={i} className={className}>
        <div className="MuiListItem-root" style={{height: '100%', textAlign: 'center'}}>
          <div style={{width: '100%'}}>
            {this.renderAnswerContent(answer)}
            {this.props.isPreview ?
              this.renderEachHint(this.props.question.hint, i)
              : this.props.isReview &&
              this.renderEachHint(this.props.question.hint, answer.index)
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="question-unique-play pair-match-play">
        <p><span className="help-text">Drag to rearrange.</span></p>
        <Grid container justify="center">
          <List style={{padding: 0}} className="answers-list">
          {
            this.props.component.list.map((item:any, i) => <PairMatchOption item={item} index={i} />)
          }
          </List>
          {
            this.props.isBookPreview || this.props.isPreview ? 
            <div className="answers-list">
              {this.state.userAnswers.map((a: Answer, i: number) => this.renderAnswer(a, i))}
            </div>
            :
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
          }
        </Grid>
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default PairMatch;
