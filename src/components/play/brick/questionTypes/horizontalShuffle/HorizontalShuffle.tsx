
import React from 'react';

import './HorizontalShuffle.scss';
import { Question } from "components/model/question";
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/brick/model/model';
import BlueCrossRectIcon from 'components/play/components/BlueCrossRectIcon';
import { HintStatus } from 'components/build/baseComponents/Hint/Hint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';


interface HorizontalShuffleChoice {
  value: string;
  checked: boolean;
}

interface HorizontalShuffleComponent {
  type: number;
  list: HorizontalShuffleChoice[];
}

interface VerticalShuffleProps {
  question: Question;
  component: HorizontalShuffleComponent;
  attempt?: ComponentAttempt;
  answers: number;
}

interface HorizontalShuffleState {
  userAnswers: any[];
}

class HorizontalShuffle extends CompComponent<VerticalShuffleProps, HorizontalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    this.state = {
      userAnswers: props.component.list
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
    // If the question is answered in review phase, add 2 to the mark and not 5.
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;
    // For every item in the answer...
    
    attempt.answer.forEach((answer: any, index: number, array: any[]) => {
      // except the first one...
      if (index !== 0) {
        // increase the max marks by 5,
        attempt.maxMarks += 5;
        // and if this item and the one before it are in the right order and are adjacent...
        if(answer.index - array[index-1].index === 1) {
          // and the program is in live phase...
          if(!prev) {
            // increase the marks by 5.
            attempt.marks += markIncrement;
          }
          // or the item wasn't correct in the live phase...
          else if (prev.answer[index] - prev.answer[index-1] != 1) {
            // increase the marks by 2.
            attempt.marks += markIncrement;
          }
        }
        // if not...
        else {
          // the answer is not correct.
          attempt.correct = false;
        }
      }
    })
    // Then, if the attempt scored no marks and the program is in live phase, then give the student a mark.
    if(attempt.marks === 0 && !prev) attempt.marks = 1;
    return attempt;
  }

  render() {
    return (
      <div className="vertical-shuffle-play">
        {
          (this.props.attempt?.correct === false) ?  <BlueCrossRectIcon /> : ""
        }
        <ReactSortable
          list={this.state.userAnswers}
          animation={150}
          direction="horizontal"
          group={{ name: "cloning-group-name" }}
          setList={(choices) => this.setUserAnswers(choices)}
        >
          {
            this.state.userAnswers.map((answer, i) => (
              <Card style={{display: "inline-block", padding: '10px', margin: '2px', fontSize: '10px'}} key={i}>
                <div style={{display: "block"}}>{answer.value}</div>
                <div style={{display: "block"}}>
                  {
                    (this.props.attempt?.correct === false && this.props.question.hint.status === HintStatus.Each && this.props.question.hint.list.length > 0) ?
                      <span className="question-hint">{answer.hint}</span>
                      : ""
                  }
                </div>
              </Card>
            ))
          }
        </ReactSortable>
        <ReviewGlobalHint attempt={this.props.attempt} hint={this.props.question.hint} />
      </div>
    );
  }
}

export default HorizontalShuffle;
