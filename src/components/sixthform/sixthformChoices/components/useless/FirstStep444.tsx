import React, { Component } from "react";
import WelcomePage from "../firstStep/welcomePage/WelcomePage";
import FirstStepWelcome from "../firstStep/FirstStepWelcome";
import StepEntusiasmStart from "../thirdStep/StepEntusiasmStart";
import SixStepEntusiasm from "../thirdStep/StepEntusiasm";
import StepDreams from "../sixStep/StepDreams";
import StepDreamsStart from "../sixStep/StepDreamsStart";
import Step1Name from "./Step1Name";
import Step1Email from "./Step1Email";

interface FirstQuestionProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(): void;
}

enum SubStep {
  Welcome = 1,
  Start,
  Name,
  Email,
  EntusiasmStart,
  Entusiasm,
  DreamsStart,
  Dreams
}

export enum SixStepSixthChoices {
  LookingAfterAnimals = 1,
  TakingThingsApart,
  TravellingInForeign,
  FashionStyle,
  DebatingIdeas,
  CodingAndDeveloping,
  CreatingWebContent,
  WorkingOutAndPlaying,
  CookingForOther,
  KeepingUpWith,
  LookingAfterYoung,
  GoingToTheTheatre,
  GoingToTheCinema,
  ExploringTheOutdoors,
  SolvingPuzzles,
  EarningSaving,
  PlayingMusicalInstruments,
  PerformingInAShow,
  TrueCrime,
  LaboratoriesAndExperiments,
  CollectingThings,
  VisitingMuseums,
  Birdwatching,
  WatchingAndLearning,
  BuildingContraptions,
  MeetingAndMakingFriends,
  CollectingRocksFossils,
  OrganisingParties,
  SingingInAChoir,
  OrganisingData,
  StudyingHumanBehaviour,
  SellingStuffOnline,
  AttendingOrVisiting,
  VolunteeringForACharity,
  RenovatingAndDoing
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

interface FirstQuestionState {
  enthusiasmChoices: any[];
  dreamChoices: any[];
  subStep: SubStep;
  email: string;
  firstName: string;
  lastName: string;
  nameCorrected: boolean;
  emailCorrected: boolean;
  popup: boolean;
}

class FirstQuestion extends Component<FirstQuestionProps, FirstQuestionState> {
  constructor(props: FirstQuestionProps) {
    super(props);

    let enthusiasmChoices = [
      {
        type: SixStepSixthChoices.LookingAfterAnimals,
        label: '“looking after animals”',
        choice: null
      }, {
        type: SixStepSixthChoices.TakingThingsApart,
        label: '“taking things apart to understand how they work”',
        choice: null
      }, {
        type: SixStepSixthChoices.TravellingInForeign,
        label: '“travelling in foreign countries”',
        choice: null
      }, {
        type: SixStepSixthChoices.FashionStyle,
        label: '“fashion, style, and people-watching”',
        choice: null
      }, {
        type: SixStepSixthChoices.DebatingIdeas,
        label: '“debating ideas and presenting arguments in public”',
        choice: null
      }, {
        type: SixStepSixthChoices.CodingAndDeveloping,
        label: '“coding and developing my own software”',
        choice: null
      }, {
        type: SixStepSixthChoices.CreatingWebContent,
        label: '“creating web content”',
        choice: null
      }, {
        type: SixStepSixthChoices.WorkingOutAndPlaying,
        label: '“working out and playing competitive sport”',
        choice: null
      }, {
        type: SixStepSixthChoices.CookingForOther,
        label: '“cooking for other people”',
        choice: null
      }, {
        type: SixStepSixthChoices.KeepingUpWith,
        label: '“keeping up with news and events in the world”',
        choice: null
      }, {
        type: SixStepSixthChoices.LookingAfterAnimals,
        label: '“looking after young children”',
        choice: null
      }, {
        type: SixStepSixthChoices.GoingToTheTheatre,
        label: '“going to the theatre”',
        choice: null
      }, {
        type: SixStepSixthChoices.GoingToTheTheatre,
        label: '“going to the cinema”',
        choice: null
      }, {
        type: SixStepSixthChoices.ExploringTheOutdoors,
        label: '“exploring the outdoors”',
        choice: null
      }, {
        type: SixStepSixthChoices.SolvingPuzzles,
        label: '“solving puzzles and problems”',
        choice: null
      }, {
        type: SixStepSixthChoices.EarningSaving,
        label: '“earning, saving and managing my money”',
        choice: null
      }, {
        type: SixStepSixthChoices.PlayingMusicalInstruments,
        label: '“playing musical instruments<br /> and listening to music”',
        choice: null
      }, {
        type: SixStepSixthChoices.PerformingInAShow,
        label: '“performing in or creating a show”',
        choice: null
      }, {
        type: SixStepSixthChoices.TrueCrime,
        label: '“true crime and crime dramas”',
        choice: null
      }, {
        type: SixStepSixthChoices.LaboratoriesAndExperiments,
        label: '“laboratories and experiments”',
        choice: null
      }, {
        type: SixStepSixthChoices.CollectingThings,
        label: '“collecting things from the past<br/> (e.g. old coins, prints, antiques)”',
        choice: null
      }, {
        type: SixStepSixthChoices.VisitingMuseums,
        label: '“visiting museums and sites of historical interest”',
        choice: null
      }, {
        type: SixStepSixthChoices.Birdwatching,
        label: '“birdwatching and wildlife”',
        choice: null
      }, {
        type: SixStepSixthChoices.WatchingAndLearning,
        label: '“watching and learning about the night sky”',
        choice: null
      }, {
        type: SixStepSixthChoices.BuildingContraptions,
        label: '“building contraptions, machines and toy kits”',
        choice: null
      }, {
        type: SixStepSixthChoices.MeetingAndMakingFriends,
        label: '“meeting and making friends with<br/> people from abroad”',
        choice: null
      }, {
        type: SixStepSixthChoices.CollectingRocksFossils,
        label: '“collecting rocks, fossils, minerals<br/> and natural curiosities”',
        choice: null
      }, {
        type: SixStepSixthChoices.OrganisingParties,
        label: '“organising parties and events”',
        choice: null
      }, {
        type: SixStepSixthChoices.SingingInAChoir,
        label: '“singing in a choir”',
        choice: null
      }, {
        type: SixStepSixthChoices.OrganisingData,
        label: '“organising data to discover patterns,<br/> trends and outliers”',
        choice: null
      }, {
        type: SixStepSixthChoices.StudyingHumanBehaviour,
        label: '“studying human behaviour”',
        choice: null
      }, {
        type: SixStepSixthChoices.SellingStuffOnline,
        label: '“selling stuff online”',
        choice: null
      }, {
        type: SixStepSixthChoices.AttendingOrVisiting,
        label: '“attending or visiting places of worship”',
        choice: null
      }, {
        type: SixStepSixthChoices.VolunteeringForACharity,
        label: '“volunteering for a charity or local event”',
        choice: null
      }, {
        type: SixStepSixthChoices.RenovatingAndDoing,
        label: '“renovating and doing up a place”',
        choice: null
      }
    ]

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

    let subStep = SubStep.Welcome;

    let firstName = '';
    let lastName = '';
    let nameCorrected = false;
    let email = '';
    let emailCorrected = false;

    if (props.answer && props.answer.answer) {
      const { answer } = props.answer;

      if (answer.enthusiasmChoices) {
        enthusiasmChoices = answer.enthusiasmChoices;
      }

      if (answer.dreamChoices) {
        //dreamChoices = answer.dreamChoices;
      }

      if (answer.firstName) {
        firstName = answer.firstName;
      }
      if (answer.lastName) {
        lastName = answer.lastName;
      }
      if (answer.nameCorrected) {
        nameCorrected = answer.nameCorrected;
      }

      if (answer.email) {
        email = answer.email;
      }
      if (answer.emailCorrected) {
        emailCorrected = answer.emailCorrected;
      }

      if (answer.subStep) {
        subStep = answer.subStep;
      }
    }


    this.state = {
      email,
      firstName,
      lastName,
      nameCorrected,
      emailCorrected,
      enthusiasmChoices,
      dreamChoices,
      subStep,
      popup: false
    }
  }

  getAnswer() {
    return {
      email: this.state.email,
      emailCorrected: this.state.emailCorrected,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      nameCorrected: this.state.nameCorrected,
      subStep: this.state.subStep,
      dreamChoices: this.state.dreamChoices,
      enthusiasmChoices: this.state.enthusiasmChoices,
    }
  }

  render() {
    if (this.state.subStep === SubStep.Dreams) {
      return (
        <StepDreams
          choices={this.state.dreamChoices}
          onChange={dreamChoices => this.setState({ dreamChoices })}
          moveBack={() => this.setState({ subStep: SubStep.DreamsStart })}
          moveNext={() => {
            this.props.saveAnswer(this.getAnswer());
            this.props.moveNext();
          }}
        />
      );
    } else if (this.state.subStep === SubStep.DreamsStart) {
      return <StepDreamsStart
        moveBack={() => this.setState({ subStep: SubStep.Entusiasm })}
        moveNext={() => this.setState({ subStep: SubStep.Dreams })}
      />
    } else if (this.state.subStep === SubStep.Entusiasm) {
      return <SixStepEntusiasm
        choices={this.state.enthusiasmChoices}
        onChange={enthusiasmChoices => this.setState({ enthusiasmChoices })}
        moveBack={() => {
          this.props.saveAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.EntusiasmStart });
        }}
        moveNext={() => {
          this.props.saveAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.DreamsStart });
        }}
      />
    } else if (this.state.subStep === SubStep.EntusiasmStart) {
      return <StepEntusiasmStart
        moveBack={() => this.setState({ subStep: SubStep.Email })}
        moveNext={() => this.setState({ subStep: SubStep.Entusiasm })}
      />
    } else if (this.state.subStep === SubStep.Email) {
      const saveEmailAnswer = (email: string, emailCorrected: boolean) => {
        this.setState({ email, emailCorrected });
        const answer = this.getAnswer();
        answer.email = email;
        answer.emailCorrected = emailCorrected;
        this.props.saveAnswer(answer);
      }
      return <Step1Email
        email={this.state.email}
        emailCorrected={this.state.emailCorrected}
        moveNext={(email, emailCorrected) => {
          this.setState({ subStep: SubStep.EntusiasmStart });
          saveEmailAnswer(email, emailCorrected);
        }}
        moveBack={(email, emailCorrected) => {
          this.setState({ subStep: SubStep.Name });
          saveEmailAnswer(email, emailCorrected);
        }}
      />
    } else if (this.state.subStep === SubStep.Name) {
      const saveNameAnswer = (firstName: string, lastName: string, nameCorrected: boolean) => {
        this.setState({ firstName, lastName, nameCorrected });
        const answer = this.getAnswer();
        answer.firstName = firstName;
        answer.lastName = lastName;
        answer.nameCorrected = nameCorrected;
        this.props.saveAnswer(answer);
      }
      return <Step1Name
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        nameCorrected={this.state.nameCorrected}
        moveNext={(firstName, lastName, nameCorrected) => {
          this.setState({ subStep: SubStep.Email });
          saveNameAnswer(firstName, lastName, nameCorrected);
        }}
        moveBack={(firstName, lastName, nameCorrected) => {
          this.setState({ subStep: SubStep.Start });
          saveNameAnswer(firstName, lastName, nameCorrected);
        }}
      />
    } else if (this.state.subStep === SubStep.Start) {
      return <FirstStepWelcome
        moveNext={() => this.setState({ subStep: SubStep.Name })}
        moveBack={() => this.setState({ subStep: SubStep.Welcome })}
      />
    }

    return <WelcomePage moveNext={() => this.setState({ subStep: SubStep.Start })} />;
  }
}

export default FirstQuestion;
