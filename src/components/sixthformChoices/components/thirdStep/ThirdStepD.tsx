import React, { Component } from "react";
import { SixthformSubject } from "services/axios/sixthformChoices";

export enum ThirdStepDChoice {
  First,
  Second,
  Third,
  Forth
}

interface ThirdProps {
  subjects: SixthformSubject[];
  answer: any;
  onChange(answer: any): void;
}

interface ThirdQuestionState {
  choice: ThirdStepDChoice | null;
}

class ThirdStepD extends Component<ThirdProps, ThirdQuestionState> {
  constructor(props: ThirdProps) {
    super(props);

    this.state = {
      choice: null
    }
  }

  render() {
    return (
      <div className="drag-container-r23">
        <div className="container-r23 first font-12 bold">
          <div>
            <div>If the right T-level for me is available, I’d be interested.</div>
            <div>I’d prefer to do a variety of shorter VAP courses if they were available.</div>
            <div>I’d consider a mix of shorter VAPs and A-levels rather than a T-level.</div>
            <div>I’m really not sure what to do yet.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdStepD;
