import React, { Component } from "react";

import ThirdStepWatchStart from "./ThirdStepWatchStart";
import ThirdStepWelcome from "./ThirdStepWelcome";
import ThirdStepWatching from "./ThirdStepWatching";
import ReadingV2 from "./ReadingV2";
import ReadingV1, { ReadingChoice } from "./ReadingV1";
import SixStepWritingA, { WritingChoice } from './SixStepWritingA';
import SixStepWritingB from "./SixStepWritingB";
import FourthStepListening from "./FourthStepListening";
import FourthStepListenStart from "./FourthStepListenStart";
import FifthStepSpeaking from "./FifthStepSpeaking";
import FifthStepSpeakingStart from "./FifthStepSpeakingStart";

enum SubStep {
  Welcome,
  ReadingV1,
  ReadingV2,
  WritingA,
  WritingB,
  WatchingStart,
  Watching,
  ListenStart,
  Listening,
  SpeakingStart,
  Speaking,
}

export enum SpeakingChoices {
  InTheClassroom = 1,
  ICantStand,
  AtHome,
  WithMyFriends,
  MyFriends,
  IPreferPractical,
  ILove,
  ImNot,
  ILikeTalking,
  IPreferToListen,
  IReallyAdmire
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
  listeningChoices: any[];
  speakingChoices: any[];
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

    let listeningChoices = [
      {
        label: 'Current Affairs, News & Talk (e.g. Radio Four)',
        choice: null
      }, {
        label: 'Podcasts (e.g. Joe Rogan)',
        choice: null
      }, {
        label: 'Sport & Sport Talk (e.g. Radio Five)',
        choice: null
      }, {
        label: 'Audiobooks (e.g. Audible)',
        choice: null
      }, {
        label: 'Comedy and Drama (e.g. Radio Four)',
        choice: null
      }, {
        label: 'Mainstream Music (Rock, Rap, Pop & Chart)',
        choice: null
      }, {
        label: 'Music, Folk or Jazz',
        choice: null
      }, {
        label: 'Music, Classical ',
        choice: null
      }
    ];

    let speakingChoices = [
      {
        type: SpeakingChoices.InTheClassroom,
        label: '“In the classroom, I enjoy contributing ideas<br/> and showing what I know.”',
        choice: null
      }, {
        type: SpeakingChoices.ICantStand,
        label: '“I can’t stand pretentious people who waffle on<br/> about stuff which isn’t relevant.”',
        choice: null
      }, {
        type: SpeakingChoices.AtHome,
        label: '“At home, my family talk a lot about what’s going on<br/> in the world and we have interesting discussions.”',
        choice: null
      }, {
        type: SpeakingChoices.WithMyFriends,
        label: '“With my friends I mainly gossip and enjoy<br/> the chance to banter and have fun.”',
        choice: null
      }, {
        type: SpeakingChoices.MyFriends,
        label: '“My friends put forward new ideas and challenge<br/> my thinking in ways I value.”',
        choice: null
      }, {
        type: SpeakingChoices.IPreferPractical,
        label: `
          “I prefer practical, problem-solving subjects like Maths<br/>
          because there’s less drivel and more solid answers.”
        `,
        choice: null
      }, {
        type: SpeakingChoices.ILove,
        label: '“I love the chance to put an argument in<br/> a proper debate, and I’m good at undermining<br/> other people’s arguments.”',
        choice: null
      }, {
        type: SpeakingChoices.ImNot,
        label: '“I’m not a confident communicator - my strengths<br/> are in other areas.”',
        choice: null
      }, {
        type: SpeakingChoices.ILikeTalking,
        label: '“I like talking in depth with others about music,<br/> books or about documentaries, plays and films we’ve seen.”',
        choice: null
      }, {
        type: SpeakingChoices.IPreferToListen,
        label: '“I prefer to listen carefully and chip in only when<br/> something really needs to be said.”',
        choice: null
      }, {
        type: SpeakingChoices.IReallyAdmire,
        label: '“I really admire people who can communicate<br/> effectively in foreign languages.”',
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
      if (answer.writingChoice) {
        writingChoice = answer.writingChoice;
      }

      if (answer.writingChoices) {
        writingChoices = answer.writingChoices;
      }

      if (answer.listeningChoices) {
        listeningChoices = answer.listeningChoices;
      }
      if (answer.speakingChoices) {
        speakingChoices = answer.speakingChoices;
      }
    }

    this.state = {
      subStep,
      readingChoice,
      readingChoicesV2,
      writingChoice,
      writingChoices,
      watchingChoices,
      listeningChoices,
      speakingChoices
    };
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      readingChoice: this.state.readingChoice,
      readingChoicesV2: this.state.readingChoicesV2,
      writingChoice: this.state.writingChoice,
      writingChoices: this.state.writingChoices,
      watchingChoices: this.state.watchingChoices,
      listeningChoices: this.state.listeningChoices,
      speakingChoices: this.state.speakingChoices
    }
  }

  moveBack() {
    this.props.moveBack(this.getAnswer());
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  render() {
    if (this.state.subStep === SubStep.Speaking) {
      return <FifthStepSpeaking
        speakingChoices={this.state.speakingChoices}
        onChange={speakingChoices => this.setState({ speakingChoices })}
        moveBack={() => this.setState({ subStep: SubStep.SpeakingStart })}
        moveNext={() => this.props.moveNext(this.getAnswer())}
      />
    } else if (this.state.subStep === SubStep.SpeakingStart) {
      return <FifthStepSpeakingStart
        moveBack={() => this.setState({ subStep: SubStep.Listening })}
        moveNext={() => this.setState({ subStep: SubStep.SpeakingStart })}
      />
    } else if (this.state.subStep === SubStep.Listening) {
      return (
        <FourthStepListening
          listeningChoices={this.state.listeningChoices}
          onChange={listeningChoices => this.setState({ listeningChoices })}
          moveBack={() => this.setState({ subStep: SubStep.ListenStart })}
          moveNext={async () => {
            await this.props.saveAnswer(this.getAnswer());
            this.moveNext();
          }} />
      );
    } else if (this.state.subStep === SubStep.ListenStart) {
      return <FourthStepListenStart
        moveNext={() => this.setState({ subStep: SubStep.Listening })}
        moveBack={() => this.setState({ subStep: SubStep.Watching })}
      />
    } else if (this.state.subStep === SubStep.Watching) {
      return (
        <ThirdStepWatching
          watchingChoices={this.state.watchingChoices}
          onChange={watchingChoices => this.setState({ watchingChoices })}
          moveBack={() => this.setState({ subStep: SubStep.WatchingStart })}
          moveNext={async () => {
            await this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.ListenStart });
          }} />
      );
    } else if (this.state.subStep === SubStep.WatchingStart) {
      return <ThirdStepWatchStart
        moveNext={() => this.setState({ subStep: SubStep.Watching })}
        moveBack={() => {
          if (this.state.writingChoice === WritingChoice.first || this.state.writingChoice === WritingChoice.second) {
            this.setState({ subStep: SubStep.WritingB });
          } else {
            this.setState({ subStep: SubStep.WritingA });
          }
        }} />
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
          moveNext={() => this.setState({ subStep: SubStep.WritingA })}
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
