import React, { Component } from "react";
import { Dialog } from "@material-ui/core";

import BackButtonSix from "../BackButtonSix";
import FifthStepA from "./FifthStepA";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import FifthStepWelcome from "./FifthStepWelcome";
import FifthStepB from "./FifthStepB";
import FifthStepSpeaking from "./FifthStepSpeaking";

enum SubStep {
  welcome,
  sub5a,
  sub5b,
  sub5c,
  speaking,
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

interface FifthProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface FifthStepState {
  subStep: SubStep;
  aAnswer: any;
  abAnswer: any;
  careers: any[];
  overflowOpen: boolean;
  speakingChoices: any[];
}

class FifthStep extends Component<FifthProps, FifthStepState> {
  constructor(props: FifthProps) {
    super(props);

    let subStep = SubStep.welcome;

    let speakingChoices = [
      {
        type: SpeakingChoices.InTheClassroom,
        label: 'In the classroom, I enjoy contributing ideas and showing what I know.',
        choice: null
      }, {
        type: SpeakingChoices.ICantStand,
        label: 'I can’t stand pretentious people who waffle on about stuff which isn’t relevant.',
        choice: null
      }, {
        type: SpeakingChoices.AtHome,
        label: 'At home, my family talk a lot about what’s going on in the world and we have interesting discussions.',
        choice: null
      }, {
        type: SpeakingChoices.WithMyFriends,
        label: 'With my friends I mainly gossip and enjoy the chance to banter and have fun.',
        choice: null
      }, {
        type: SpeakingChoices.MyFriends,
        label: 'My friends put forward new ideas and challenge my thinking in ways I value.',
        choice: null
      }, {
        type: SpeakingChoices.IPreferPractical,
        label: 'I prefer practical, problem-solving subjects like Maths because there’s less drivel and more solid answers.',
        choice: null
      }, {
        type: SpeakingChoices.ILove,
        label: 'I love the chance to put an argument in a proper debate, and I’m good at undermining other people’s arguments.',
        choice: null
      }, {
        type: SpeakingChoices.ImNot,
        label: 'I’m not a confident communicator - my strengths are in other areas.',
        choice: null
      }, {
        type: SpeakingChoices.ILikeTalking,
        label: 'I like talking in depth with others about music, books or about documentaries, plays and films we’ve seen.',
        choice: null
      }, {
        type: SpeakingChoices.IPreferToListen,
        label: 'I prefer to listen carefully and chip in only when something really needs to be said.',
        choice: null
      }, {
        type: SpeakingChoices.IReallyAdmire,
        label: 'I really admire people who can communicate effectively in foreign languages.',
        choice: null
      }
    ];

    let aAnswer = null;
    let abAnswer = null;

    let careers = [{
      jobName: 'Accountant, Auditor',
      advisory: ['Maths'],
      handy: ['Economics', 'Accounting', 'Statistics']
    }, {
      jobName: 'Actuary',
      essential: ['Maths'],
      handy: ['Statistics', 'Further Maths']
    }, {
      jobName: 'Architect',
      advisory: ['Art & Design', 'Maths'],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Banking, Investment & Finance',
      essential: ['Maths'],
      advisory: ['Economics'],
      handy: ['Statistics', 'Business', 'Further Maths']
    }, {
      jobName: 'Biotechnologist',
      essential: ['Biology'],
      advisory: ['Maths', 'Chemistry'],
      handy: ['Further Maths', 'Physics']
    }, {
      jobName: 'Chemical Engineer',
      essential: ['Maths', 'Chemistry'],
      advisory: ['Physics'],
      handy: ['Further Maths']
    }, {
      jobName: 'Dentistry',
      essential: ['Chemistry'],
      advisory: ['Biology', 'Maths'],
      handy: ['Physics']
    }, {
      jobName: 'Engineering',
      essential: ['Maths', 'Physics'],
      advisory: [],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Insurance (Underwriting)',
      essential: [],
      advisory: ['Maths', 'Accounting'],
      handy: ['Statistics']
    }, {
      jobName: 'Materials Scientist',
      essential: ['Physics', 'Maths'],
      advisory: ['Chemistry'],
      handy: ['Further Maths', 'Design & Technology']
    }, {
      jobName: 'Medicine',
      essential: ['Biology', 'Chemistry'],
      advisory: ['Maths'],
      handy: ['Physics', 'Further Maths']
    }, {
      jobName: 'Museum Curator',
      essential: [],
      advisory: ['History', 'Art & Design'],
      handy: ['History of Art', 'Ancient History']
    }, {
      jobName: 'Naval Architect',
      essential: ['Maths', 'Physics'],
      advisory: [],
      handy: ['Engineering', 'Design & Technology']
    }, {
      jobName: 'Urban Planner',
      essential: [],
      advisory: ['Maths', 'Geography'],
      handy: ['Economics', 'Politics']
    }, {
      jobName: 'Veterinary Science',
      essential: ['Chemistry'],
      advisory: ['Biology'],
      handy: ['Physics', 'Maths']
    }, {
      jobName: 'Zoologist',
      essential: ['Biology'],
      advisory: ['Chemistry', 'Physics', 'Maths'],
      handy: ['Environmental Science']
    }, {
      jobName: 'None are for me',
      description: 'I could be ruling out, or making very difficult, the above career paths by choosing other A levels, and I’m happy with that.'
    }];

    if (props.answer) {
      const { answer } = props.answer;
      if (answer.aAnswer) {
        aAnswer = answer.aAnswer;
      }
      if (answer.abAnswer) {
        abAnswer = answer.abAnswer;
      }
      if (answer.subStep) {
        subStep = answer.subStep;
      }
      if (answer.careers) {
        careers = answer.careers;
      }
      if (answer.speakingChoices) {
        speakingChoices = answer.speakingChoices;
      }
    }

    this.state = {
      subStep,
      aAnswer,
      abAnswer,
      careers,
      speakingChoices,
      overflowOpen: false
    }
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      aAnswer: this.state.aAnswer,
      abAnswer: this.state.abAnswer,
      careers: this.state.careers,
      speakingChoices: this.state.speakingChoices
    }
  }

  render() {
    if (this.state.subStep === SubStep.speaking) {
      return <FifthStepSpeaking
        speakingChoices={this.state.speakingChoices}
        onChange={speakingChoices => this.setState({ speakingChoices })}
        moveBack={() => this.setState({ subStep: SubStep.sub5c })}
        moveNext={() => this.props.moveNext(this.getAnswer())}
      />
    } else if (this.state.subStep === SubStep.sub5c) {
      return (
        <div className="question">
          <img src="/images/choicesTool/FifthStepR15.png" className="third-step-img fifth-step-img-r15"></img>
          <div className="bold font-32 question-text-4">
            Careers with A-level Requirements
          </div>
          <div className="font-16">
            The following careers favour specific A-levels, usually because relevant degree courses require them.<br />
            Most of you will probably select “None are for me”, but be aware of what you might be ruling out.
          </div>
          <div className="drag-container-5c">
            <div className="subjects-table subjects-table-5c">
              <div className="top-row title-r22 bold font-16">
                Choose up to three careers you’re currently interested in.
              </div>
              <div className="table-head bold font-16">
                <div className="checkbox-column" />
                <div className="first-column table-5c-column center-y">Jobs</div>
                <div className="second-column table-5c-column center-column header-label">
                  <div>Essential</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">it’s almost impossible to get a degree course offer without these subjects</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="third-column table-5c-column center-column header-label">
                  <div>Advisory</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">these subjects reinforce an application with relevant skills</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
                <div className="fourth-column table-5c-column center-column header-label">
                  <div>Handy</div>
                  <div className="hover-area font-14">
                    <SpriteIcon name="help-icon-v4" className="info-icon" />
                    <div className="hover-content">if you meet the essential and advisory criteria, these are optional suggestions</div>
                    <div className="hover-arrow-bottom" />
                  </div>
                </div>
              </div>
              <div className="table-body-5c">
                {this.state.careers.map((career, i) => {
                  if (career.jobName === 'None are for me') {
                    return (
                      <div key={i} className="table-5c-body-row font-14" onClick={() => {
                        let careerCopy = Object.assign({}, career);
                        this.state.careers.map(c => c.active = false);
                        career.active = !careerCopy.active;
                        this.setState({ careers: this.state.careers });
                      }}>
                        <div className="checkbox-column flex-center">
                          <SpriteIcon name={career.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                        </div>
                        <div className="table-5c-column value-column-5c first">
                          {career.jobName}
                        </div>
                        <div className="table-5c-column value-column-5c-big font-12">
                          I could be ruling out, or making very difficult, the above career paths by choosing other A levels, and I’m happy with that.
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="table-5c-body-row font-14" onClick={() => {
                      this.state.careers.find(c => c.jobName === 'None are for me').active = false;
                      let activeCount = this.state.careers.filter(c => c.active).length;
                      if (activeCount >= 3 && !career.active) {
                        this.setState({ overflowOpen: true });
                      } else {
                        career.active = !career.active;
                      }
                      this.setState({ careers: this.state.careers });
                    }}>
                      <div className="checkbox-column flex-center">
                        <SpriteIcon name={career.active === true ? 'radio-btn-active' : 'radio-btn-blue'} className="absolute-correct-check" />
                      </div>
                      <div className="table-5c-column value-column-5c border-right first">
                        {career.jobName}
                      </div>
                      <div className="table-5c-column value-column-5c border-right">
                        <div>
                          {career.essential && career.essential.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                      <div className="table-5c-column value-column-5c border-right">
                        <div>
                          {career.advisory && career.advisory.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                      <div className="table-5c-column value-column-5c last">
                        <div>
                          {career.handy && career.handy.map((subject: any, j: number) => <div key={j}>{subject}</div>)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {this.state.overflowOpen && <Dialog className='too-many-dialog' open={true} onClose={() => this.setState({ overflowOpen: false })}>
            Oops! You’ve tried to pick too many.
            <div className="btn" onClick={() => this.setState({ overflowOpen: false })}>Close</div>
          </Dialog>}
          <BackButtonSix onClick={() => this.setState({ subStep: SubStep.sub5b })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.setState({ subStep: SubStep.speaking });
          }}>Continue</button>
        </div >
      );
    } else if (this.state.subStep === SubStep.sub5b) {
      return (
        <FifthStepB
          abAnswer={this.state.abAnswer}
          onChange={answer => this.setState({ abAnswer: answer })}
          moveNext={answer => {
            this.props.saveAnswer(answer);
            this.setState({ subStep: SubStep.sub5c, abAnswer: answer });
          }}
          moveBack={abAnswer => {
            let answer = this.getAnswer();
            answer.abAnswer = abAnswer;
            this.setState({ subStep: SubStep.sub5a, abAnswer: answer });
          }}
        />
      );
    } else if (this.state.subStep === SubStep.sub5a) {
      return (
        <FifthStepA
          careers={this.state.aAnswer}
          onChange={answer => this.setState({ aAnswer: answer })}
          moveNext={answer => {
            console.log('aAnswer', answer);
            this.props.saveAnswer(answer);
            this.setState({ subStep: SubStep.sub5b, aAnswer: answer });
          }}
          moveBack={aAnswer => {
            console.log('aAnswer', aAnswer);
            let answer = this.getAnswer();
            answer.aAnswer = aAnswer;
            this.setState({ subStep: SubStep.welcome, aAnswer: answer });
          }}
        />
      );
    }

    return (
      <FifthStepWelcome
        moveNext={() => this.setState({ subStep: SubStep.sub5a })}
        moveBack={() => this.props.moveBack(this.getAnswer())}
      />
    )
  }
}

export default FifthStep;
