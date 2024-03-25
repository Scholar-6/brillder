import React, { Component } from "react";

import ThirdStepWatchStart from "./ThirdStepWatchStart";
import ThirdStepWelcome from "./ThirdStepWelcome";
import ThirdStepWatching from "./ThirdStepWatching";
import ReadingV2 from "./ReadingV2";
import ReadingV1, { ReadingChoice } from "./ReadingV1";
import SixStepWritingA, { WritingChoice } from './SixStepWritingA';
import SixStepWritingB from "./SixStepWritingB";


enum SubStep {
  Welcome,
  ReadingV1,
  ReadingV2,
  WritingA,
  WritingB,
  WatchingStart,
  Watching
}

interface SecondQuestionProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface SecondQuestionState {
  subStep: SubStep;
  readingChoice: any;
  readingChoicesV2: any[];
  writingChoice: WritingChoice | null;
  writingChoices: any[];
  watchingChoices: any[];
}

class ThirdStep extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let subStep = SubStep.Welcome;

    let readingChoice = null;
    let readingChoicesV2 = [];

    let writingChoice = null;

    let writingChoices = [
      {
        name: 'Fiction',
        description: 'Writing stories or imaginative descriptions',
        choice: null
      }, {
        name: 'Essays',
        description: 'Assembling evidence and arguments',
        choice: null
      }, {
        name: 'Poetry',
        description: 'Poems, verse, rap or song lyrics',
        choice: null
      }, {
        name: 'Theatre Pieces',
        description: 'Plays, devised drama and comedy sketches',
        choice: null
      }, {
        name: 'Proposals, Projects & Reports',
        description: 'Pitching ideas, writing up research or experiments',
        choice: null
      }, {
        name: 'Articles & Reviews',
        description: 'For blogs, magazines or newspapers',
        choice: null
      }, {
        name: 'Diary & Correspondence',
        description: 'Keeping up with penpals, or writing a journal',
        choice: null
      }
    ];

    let watchingChoices = [
      {
        label: 'News & Current Affairs',
        choice: null
      }, {
        label: 'Nature, Farming & Environment',
        choice: null
      }, {
        label: 'Other Science (e.g. Astronomy, Technology)',
        choice: null
      }, {
        label: 'Art, Architecture & Design',
        choice: null
      }, {
        label: 'Quiz & Puzzle Shows',
        choice: null
      }, {
        label: 'History, Ancient History & Anthropology',
        choice: null
      }, {
        label: 'Vehicles & Motorsport',
        choice: null
      }, {
        label: 'Classic Old Films',
        choice: null
      }, {
        label: 'Sit-coms, Stand-Ups and Funny Stuff',
        choice: null
      }, {
        label: 'Sport',
        choice: null
      }, {
        label: 'Drama & Box Sets',
        choice: null
      }, {
        label: 'Animated Movies',
        choice: null
      }, {
        label: 'Reality Television',
        choice: null
      }
    ];

    if (props.answer) {
      let answer = props.answer.answer;
      subStep = answer.subStep;
      readingChoice = answer.readingChoice;
      if (answer.readingChoicesV2) {
        readingChoicesV2 = answer.readingChoicesV2;
      }
      if (answer.writingChoice) {
        writingChoice = answer.writingChoice;
      }
      if (answer.writingChoices) {
        writingChoices = answer.writingChoices;
      }
    }

    if (props.answer) {
      let answer = props.answer.answer;
      subStep = answer.subStep;
      if (answer.watchingChoices && answer.watchingChoices.length > 12) {
        watchingChoices = answer.watchingChoices;
      }
    }

    this.state = {
      subStep,
      readingChoice,
      readingChoicesV2,
      writingChoice,
      writingChoices,
      watchingChoices
    };
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      readingChoice: this.state.readingChoice,
      readingChoicesV2: this.state.readingChoicesV2,
      writingChoice: this.state.writingChoice,
      writingChoices: this.state.writingChoices,
      watchingChoices: this.state.watchingChoices
    }
  }

  moveBack() {
    this.props.moveBack(this.getAnswer());
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  render() {
    if (this.state.subStep === SubStep.Watching) {
      return (
        <ThirdStepWatching
          watchingChoices={this.state.watchingChoices}
          onChange={watchingChoices => this.setState({ watchingChoices })}
          moveBack={() => this.setState({ subStep: SubStep.WatchingStart })}
          moveNext={async () => {
            await this.props.saveAnswer(this.getAnswer());
            this.moveNext();
          }} />
      );
    } else if (this.state.subStep === SubStep.WatchingStart) {
      return <ThirdStepWatchStart
        moveNext={() => this.setState({ subStep: SubStep.Watching })}
        moveBack={() => this.setState({ subStep: SubStep.ReadingV2 })} />
    } else if (this.state.subStep === SubStep.WritingB) {
      return <SixStepWritingB
        choices={this.state.writingChoices}
        onChange={writingChoices => this.setState({ writingChoices })}
        moveBack={() => {
          this.props.saveAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.WritingA })
        }}
        moveNext={() => {
          this.props.saveAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.WatchingStart });
        }}
      />
    } else if (this.state.subStep === SubStep.WritingA) {
      return (
        <SixStepWritingA
          writingChoice={this.state.writingChoice}
          setWritingChoice={writingChoice => this.setState({ writingChoice })}
          moveBack={() => {
            this.props.saveAnswer(this.getAnswer());
            if (this.state.readingChoice === ReadingChoice.first || this.state.readingChoice === ReadingChoice.second) {
              this.setState({ subStep: SubStep.ReadingV2 });
            } else {
              this.setState({ subStep: SubStep.ReadingV1 });
            }
          }}
          moveNext={() => {
            if (this.state.writingChoice === WritingChoice.first || this.state.writingChoice === WritingChoice.second) {
              this.setState({ subStep: SubStep.WritingB });
            } else {
              this.setState({ subStep: SubStep.WatchingStart });
            }
            this.props.saveAnswer(this.getAnswer());
          }}
        />
      );
    } else if (this.state.subStep === SubStep.ReadingV2) {
      return (
        <ReadingV2
          readingChoicesV2={this.state.readingChoicesV2}
          onChange={readingChoicesV2 => this.setState({ readingChoicesV2 })}
          moveBack={() => this.setState({ subStep: SubStep.ReadingV1 })}
          moveNext={() => this.moveNext()}
        />
      );
    } else if (this.state.subStep === SubStep.ReadingV1) {
      return (
        <ReadingV1
          readingChoice={this.state.readingChoice}
          onChange={readingChoice => this.setState({ readingChoice })}
          moveBack={() => this.setState({ subStep: SubStep.Welcome })}
          moveNext={() => {
            if (this.state.readingChoice === ReadingChoice.first || this.state.readingChoice === ReadingChoice.second) {
              this.setState({ subStep: SubStep.ReadingV2 })
            } else {
              this.moveNext();
            }
          }}
        />
      );
    }
    return <ThirdStepWelcome
      moveBack={() => this.moveBack()}
      moveNext={() => this.setState({ subStep: SubStep.ReadingV1 })}
    />
  }
}

export default ThirdStep;
