import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';

import './VerticalShuffle.scss';
import {CompQuestionProps} from '../types';
import CompComponent from '../Comp';
import {ComponentAttempt} from 'components/play/brick/model/model';
import ReviewEachHint from 'components/play/brick/baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import MathInHtml from '../../baseComponents/MathInHtml';


interface VerticalShuffleChoice {
  value: string;
  index: number;
  checked: boolean;
}

interface VerticalShuffleComponent {
  type: number;
  list: VerticalShuffleChoice[];
}

interface VerticalShuffleProps extends CompQuestionProps {
  isTimeover: boolean;
  component: VerticalShuffleComponent;
  answers: number;
}

enum DragAndDropStatus {
  None,
  Init,
  Changed
}

interface VerticalShuffleState {
  status: DragAndDropStatus;
  userAnswers: any[];
}

class VerticalShuffle extends CompComponent<VerticalShuffleProps, VerticalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = this.props.component.list;

    let {attempt} = this.props;

    if (attempt) {
      if (attempt.answer) {
        userAnswers = attempt.answer;
      }
    }

    this.state = {
      status: DragAndDropStatus.None,
      userAnswers: userAnswers
    };
  }

  setUserAnswers(userAnswers: any[]) {
    if (this.props.isTimeover) { return; }
    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }
    if (this.state.status === DragAndDropStatus.Changed && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ status, userAnswers });
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }
    
    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({userAnswers: props.component.list});
      }
    }
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
          else if (prev.answer[index] - prev.answer[index-1] !== 1) {
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

    if (this.state.status === DragAndDropStatus.Changed) {
      attempt.dragged = true;
    }
    return attempt;
  }

  checkAttemptAnswer(index: number) {
    if (this.props.attempt && this.props.attempt.answer) {
      let answer = this.props.attempt.answer[index];
      if (answer.index - index === 0) {
        return true;
      }
    }
    return false;
  }

  renderAnswer(answer:any, i: number) {
    let isCorrect = this.checkAttemptAnswer(i);
    let className = "vertical-shuffle-choice";

    if (!this.props.isPreview && this.props.attempt) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        if (isCorrect === true) {
          className += " correct";
        } else {
          className += " wrong";
        }
      }
    }
    
    return (
      <div key={i} className={className}>
        <Grid container direction="row" justify="center">
          <MathInHtml value={answer.value} />
        </Grid>
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            attempt={this.props.attempt}
            isCorrect={isCorrect}
            index={i}
            hint={this.props.question.hint}
          />
        </Grid>
      </div>
    );
  }

  render() {
    return (
      <div className="vertical-shuffle-play">
        <p className="help-text">Drag to rearrange.</p>
        <ReactSortable
          list={this.state.userAnswers}
          animation={150}
          className="verical-shuffle-sort-list"
          style={{display:"inline-block"}}
          group={{ name: "cloning-group-name" }}
          setList={(choices) => this.setUserAnswers(choices)}
        >
          {
            this.state.userAnswers.map((answer, i) => (
              this.renderAnswer(answer, i)
            ))
          }
        </ReactSortable>
        <ReviewGlobalHint
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default VerticalShuffle;
