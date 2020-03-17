
import React from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import './PairMatch.scss';
import { Question } from "components/model/question";
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/brick/model/model';
import { HintStatus } from 'components/build/baseComponents/Hint/Hint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';
import DenimCrossRect from 'components/play/components/DenimCrossRect';
import DenimTickRect from 'components/play/components/DenimTickRect';


interface PairMatchChoice {
  value: string;
  index: number;
  hint: string;
  option: string;
}

interface PairMatchComponent {
  type: number;
  list: PairMatchChoice[];
  choices: any[];
  options: any[];
}

interface PairMatchProps {
  question: Question;
  component: PairMatchComponent;
  attempt?: ComponentAttempt;
  answers: number;
}

interface PairMatchState {
  userAnswers: any[];
}

class PairMatch extends CompComponent<PairMatchProps, PairMatchState> {
  constructor(props: PairMatchProps) {
    super(props);

    this.state = {
      userAnswers: props.component.choices
    };
  }

  setUserAnswers(userAnswers: any[]) {
    this.setState({ userAnswers });
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  getState(entry: number): number {
    if (this.props.attempt?.answer[entry]) {
      if (this.props.attempt.answer[entry].toLowerCase().replace(/ /g, '') === this.props.component.list[entry].value.toLowerCase().replace(/ /g, '')) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;
    attempt.answer.forEach((answer: any, index: number, array: any[]) => {
      attempt.maxMarks += 5;
      if(answer.index === this.props.component.list[index].index) {
        if(!prev) {
          attempt.marks += markIncrement;
        } else if (prev.answer[index].index !== this.props.component.list[index].index) {
          attempt.marks += markIncrement;
        }
      } else {
        attempt.correct = false;
      }
    })
    if(attempt.marks === 0 && !prev) attempt.marks = 1;
    return attempt;
  }

  renderIcon(index: number) {
    if (this.props.attempt) {
      return (
        <ListItemIcon>
          {
            (this.props.attempt.answer[index].index === index) ? <DenimTickRect/> : <DenimCrossRect />
          }
        </ListItemIcon>
      );
    }
    return "";
  }

  render() {
    return (
      <div className="pair-match-play">
        <Grid container justify="center">
          <List style={{padding: 0}}>
          {
            this.props.component.list.map((item, i) => (
              <ListItem key={i} className="pair-match-play-option">
                {this.renderIcon(i)}
                <ListItemText>
                  {
                    (this.props.attempt?.correct === false && this.props.question.hint.status === HintStatus.Each && this.props.question.hint.list.length > 0) ?
                      <span className="question-hint">{item.hint}</span>
                      : ""
                   }
                </ListItemText>
                <ListItemText><span className="pair-match-play-option-text">{item.option}</span></ListItemText>
              </ListItem>
            ))
          }
          </List>
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            style={{display:"inline-block"}}
            group={{ name: "cloning-group-name" }}
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {
              this.state.userAnswers.map((answer, i) => (
                <div style={{display: "block"}} key={i} className="pair-match-play-choice">
                  <Grid container direction="row">
                    <Grid item xs={1} container justify="center" alignContent="center" style={{width: '100%', height: '100%'}}>
                      <DragIndicatorIcon/>
                    </Grid>
                    <Grid item xs={11} container justify="center" alignContent="center" style={{width: '100%', height: '24px'}}>
                      {answer.value}
                    </Grid>
                  </Grid>
                </div>
              ))
            }
          </ReactSortable>
        </Grid>
        <ReviewGlobalHint attempt={this.props.attempt} hint={this.props.question.hint} />
      </div>
    );
  }
}

export default PairMatch;
