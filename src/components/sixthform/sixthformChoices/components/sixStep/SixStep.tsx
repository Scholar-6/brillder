import React, { Component } from "react";

import FifthStepWelcome from "./SixStepWelcome";
import SixStepFinal from "./SixStepFinal";
import StepDreams from "./StepDreams";
import StepDreamsStart from "./StepDreamsStart";

enum SubStep {
  welcome,
  DreamsStart,
  Dreams,
  final,
}

enum SixStepSeventhChoices {
  BecomeACouncillor,
  BuildMyOwnHouse,
  LiveACompletely,
  OwnARestaurant,
  WorkOnAMajor,
  IPreferPractical,
  WriteANovel,
  LiveAndWork,
  WorkAsAMedical,
  HaveAFarm,
  PlayOrCoach,
  InventAnApp,
  WorkAtAMajor,
  AsALawyer,
  TakePartIn,
  BringACriminalToJustice,
  PerformAtTheRoyalAlbertHall,
  RunASuccessfulBusiness,
  ExhibitMyArtwork,
  AppearInThePages,
  MakeADifference,
  ToGainADeeper,
  AcquireADeepUnderstanding
}

interface Props {
  history: any;
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

interface State {
  subStep: SubStep;
  dreamChoices: any[];
}

class SixStep extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let subStep = SubStep.welcome;

    let dreamChoices = [
      {
        type: SixStepSeventhChoices.BecomeACouncillor,
        label: '“become a councillor or an MP so I could help make important changes to society”',
        choice: null
      }, {
        type: SixStepSeventhChoices.BuildMyOwnHouse,
        label: '“build my own house”',
        choice: null
      }, {
        type: SixStepSeventhChoices.LiveACompletely,
        label: '“live a completely carbon neutral life”',
        choice: null
      }, {
        type: SixStepSeventhChoices.OwnARestaurant,
        label: '“own a restaurant and/or be a successful chef”',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkOnAMajor,
        label: '“work on a major science or engineering project (e.g. Cern, NASA, Human Genome)”',
        choice: null
      }, {
        type: SixStepSeventhChoices.WriteANovel,
        label: '“write a novel, a play or a film script”',
        choice: null
      }, {
        type: SixStepSeventhChoices.LiveAndWork,
        label: '“live and work overseas”',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkAsAMedical,
        label: '“work as a medical professional in a disaster zone like a war or flood”',
        choice: null
      }, {
        type: SixStepSeventhChoices.HaveAFarm,
        label: '“have a farm or smallholding, growing crops and keeping livestock - enough to be self-sufficient”',
        choice: null
      }, {
        type: SixStepSeventhChoices.PlayOrCoach,
        label: '“play or coach sport, or eSport, professionally”',
        choice: null
      }, {
        type: SixStepSeventhChoices.InventAnApp,
        label: '“invent an app, a computer game, or create a successful online platform”',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkAtAMajor,
        label: '“work at a major bank or trading firm <br /> in the City of London”',
        choice: null
      }, {
        type: SixStepSeventhChoices.AsALawyer,
        label: '“as a lawyer, plead a case in the High Court”',
        choice: null
      }, {
        type: SixStepSeventhChoices.TakePartIn,
        label: '“take part in an archaeological find (e.g. a dig )”',
        choice: null
      }, {
        type: SixStepSeventhChoices.BringACriminalToJustice,
        label: '“bring a criminal to justice, either by detective work or as a lawyer in court”',
        choice: null
      }, {
        type: SixStepSeventhChoices.PerformAtTheRoyalAlbertHall,
        label: '“perform at the Royal Albert Hall”',
        choice: null
      }, {
        type: SixStepSeventhChoices.RunASuccessfulBusiness,
        label: '“run a successful business which I founded myself”',
        choice: null
      }, {
        type: SixStepSeventhChoices.ExhibitMyArtwork,
        label: '“exhibit my artwork at an influential gallery, or curate an exhibition of a famous artist”',
        choice: null
      }, {
        type: SixStepSeventhChoices.AppearInThePages,
        label: '“appear in the pages of Vogue, either as a designer, a model or a make-up artist”',
        choice: null
      }, {
        type: SixStepSeventhChoices.MakeADifference,
        label: '“make a difference in the lives of young children, the elderly or any vulnerable person”',
        choice: null
      }, {
        type: SixStepSeventhChoices.ToGainADeeper,
        label: '“to gain a deeper understanding of<br/> philosophies and belief systems which shine a light upon our purpose in life”',
        choice: null
      }, {
        type: SixStepSeventhChoices.AcquireADeepUnderstanding,
        label: '“acquire a deep understanding of the human mind and what makes people tick”',
        choice: null
      }
    ];

    if (props.answer) {
      const { answer } = props.answer;
      if (answer.subStep) {
        subStep = answer.subStep;
      }
      if (answer.dreamChoices) {
        dreamChoices = answer.dreamChoices;
      }
    }

    this.state = {
      subStep,
      dreamChoices,
    }
  }

  getAnswer() {
    return {
      subStep: this.state.subStep,
      dreamChoices: this.state.dreamChoices,
    }
  }

  render() {
    if (this.state.subStep === SubStep.final) {
      return <SixStepFinal history={this.props.history} />
    } else if (this.state.subStep === SubStep.Dreams) {
      return (
        <StepDreams
          choices={this.state.dreamChoices}
          onChange={dreamChoices => this.setState({ dreamChoices })}
          moveBack={() => this.setState({ subStep: SubStep.DreamsStart })}
          moveNext={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SubStep.final });
          }}
        />
      );
    } else if (this.state.subStep === SubStep.DreamsStart) {
      return <StepDreamsStart
        moveBack={() => this.setState({ subStep: SubStep.welcome })}
        moveNext={() => this.setState({ subStep: SubStep.Dreams })}
      />
    }

    return (
      <FifthStepWelcome
        moveNext={() => this.setState({ subStep: SubStep.DreamsStart })}
        moveBack={() => this.props.moveBack(this.getAnswer())}
      />
    )
  }
}

export default SixStep;
