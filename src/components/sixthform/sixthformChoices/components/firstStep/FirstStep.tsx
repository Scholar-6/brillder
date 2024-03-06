import React, { Component } from "react";
import WelcomePage from "./welcomePage/WelcomePage";
import FirstStepWelcome from "./FirstStepWelcome";
import StepEntusiasmStart from "./StepEntusiasmStart";
import SixStepEntusiasm from "./SixStepEntusiasm";
import StepDreams from "./StepDreams";
import StepDreamsStart from "./StepDreamsStart";

interface FirstQuestionProps {
  answer: any;
  onChoiceChange(answer: any): void;
  moveNext(): void;
}

export enum FirstChoice {
  ALevel = 1,
  Vocational,
  ShowMeAll,
  Other
}

enum SubStep {
  Welcome = 1,
  Start,
  Age,
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
  choice: FirstChoice | null;
  entisiasmChoices: any[];
  dreamChoices: any[];
  subStep: SubStep;
  popup: boolean;
}

class FirstQuestion extends Component<FirstQuestionProps, FirstQuestionState> {
  constructor(props: FirstQuestionProps) {
    super(props);

    let choice = null;

    let entisiasmChoices = [
      {
        type: SixStepSixthChoices.LookingAfterAnimals,
        label: 'looking after animals',
        choice: null
      }, {
        type: SixStepSixthChoices.TakingThingsApart,
        label: 'taking things apart to understand how they work',
        choice: null
      }, {
        type: SixStepSixthChoices.TravellingInForeign,
        label: 'travelling in foreign countries',
        choice: null
      }, {
        type: SixStepSixthChoices.FashionStyle,
        label: 'fashion, style, and people-watching',
        choice: null
      }, {
        type: SixStepSixthChoices.DebatingIdeas,
        label: 'debating ideas and presenting arguments in public',
        choice: null
      }, {
        type: SixStepSixthChoices.CodingAndDeveloping,
        label: 'coding and developing my own software',
        choice: null
      }, {
        type: SixStepSixthChoices.CreatingWebContent,
        label: 'creating web content',
        choice: null
      }, {
        type: SixStepSixthChoices.WorkingOutAndPlaying,
        label: 'working out and playing competitive sport',
        choice: null
      }, {
        type: SixStepSixthChoices.CookingForOther,
        label: 'cooking for other people',
        choice: null
      }, {
        type: SixStepSixthChoices.KeepingUpWith,
        label: 'keeping up with news and events in the world',
        choice: null
      }, {
        type: SixStepSixthChoices.LookingAfterAnimals,
        label: 'looking after young children',
        choice: null
      }, {
        type: SixStepSixthChoices.GoingToTheTheatre,
        label: 'going to the theatre',
        choice: null
      }, {
        type: SixStepSixthChoices.GoingToTheTheatre,
        label: 'going to the cinema',
        choice: null
      }, {
        type: SixStepSixthChoices.ExploringTheOutdoors,
        label: 'exploring the outdoors',
        choice: null
      }, {
        type: SixStepSixthChoices.SolvingPuzzles,
        label: 'solving puzzles and problems',
        choice: null
      }, {
        type: SixStepSixthChoices.EarningSaving,
        label: 'earning, saving and managing my money',
        choice: null
      }, {
        type: SixStepSixthChoices.PlayingMusicalInstruments,
        label: 'playing musical instruments and listening to music',
        choice: null
      }, {
        type: SixStepSixthChoices.PerformingInAShow,
        label: 'performing in or creating a show',
        choice: null
      }, {
        type: SixStepSixthChoices.TrueCrime,
        label: 'true crime and crime dramas',
        choice: null
      }, {
        type: SixStepSixthChoices.LaboratoriesAndExperiments,
        label: 'laboratories and experiments',
        choice: null
      }, {
        type: SixStepSixthChoices.CollectingThings,
        label: 'collecting things from the past (e.g. old coins, prints, antiques)',
        choice: null
      }, {
        type: SixStepSixthChoices.VisitingMuseums,
        label: 'visiting museums and sites of historical interest',
        choice: null
      }, {
        type: SixStepSixthChoices.Birdwatching,
        label: 'Birdwatching and wildlife',
        choice: null
      }, {
        type: SixStepSixthChoices.WatchingAndLearning,
        label: 'Watching and learning about the night sky',
        choice: null
      }, {
        type: SixStepSixthChoices.BuildingContraptions,
        label: 'Building contraptions, machines and toy kits',
        choice: null
      }, {
        type: SixStepSixthChoices.MeetingAndMakingFriends,
        label: 'Meeting and making friends with people from abroad',
        choice: null
      }, {
        type: SixStepSixthChoices.CollectingRocksFossils,
        label: 'Collecting rocks, fossils, minerals and natural curiosities',
        choice: null
      }, {
        type: SixStepSixthChoices.OrganisingParties,
        label: 'Organising parties and events',
        choice: null
      }, {
        type: SixStepSixthChoices.SingingInAChoir,
        label: 'Singing in a choir',
        choice: null
      }, {
        type: SixStepSixthChoices.OrganisingData,
        label: 'Organising data to discover patterns, trends and outliers',
        choice: null
      }, {
        type: SixStepSixthChoices.StudyingHumanBehaviour,
        label: 'Studying human behaviour',
        choice: null
      }, {
        type: SixStepSixthChoices.SellingStuffOnline,
        label: 'Selling stuff online',
        choice: null
      }, {
        type: SixStepSixthChoices.AttendingOrVisiting,
        label: 'Attending or visiting places of worship',
        choice: null
      }, {
        type: SixStepSixthChoices.VolunteeringForACharity,
        label: 'Volunteering for a charity or local event',
        choice: null
      }, {
        type: SixStepSixthChoices.RenovatingAndDoing,
        label: 'Renovating and doing up a place',
        choice: null
      }
    ]

    let dreamChoices = [
      {
        type: SixStepSeventhChoices.BecomeACouncillor,
        label: 'become a councillor or an MP so I could help make important changes to society',
        choice: null
      }, {
        type: SixStepSeventhChoices.BuildMyOwnHouse,
        label: 'build my own house',
        choice: null
      }, {
        type: SixStepSeventhChoices.LiveACompletely,
        label: 'live a completely carbon neutral life',
        choice: null
      }, {
        type: SixStepSeventhChoices.OwnARestaurant,
        label: 'own a restaurant and/or be a successful chef',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkOnAMajor,
        label: 'work on a major science or engineering project (e.g. Cern, NASA, Human Genome)',
        choice: null
      }, {
        type: SixStepSeventhChoices.WriteANovel,
        label: 'write a novel, a play or a film script',
        choice: null
      }, {
        type: SixStepSeventhChoices.LiveAndWork,
        label: 'live and work overseas',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkAsAMedical,
        label: 'work as a medical professional in a disaster zone like a war or flood',
        choice: null
      }, {
        type: SixStepSeventhChoices.HaveAFarm,
        label: 'have a farm or smallholding, growing crops and keeping livestock - enough to be self-sufficient',
        choice: null
      }, {
        type: SixStepSeventhChoices.PlayOrCoach,
        label: 'play or coach sport, or eSport, professionally',
        choice: null
      }, {
        type: SixStepSeventhChoices.InventAnApp,
        label: 'invent an app, a computer game, or create a successful online platform',
        choice: null
      }, {
        type: SixStepSeventhChoices.WorkAtAMajor,
        label: 'work at a major bank or trading firm in the City of London',
        choice: null
      }, {
        type: SixStepSeventhChoices.AsALawyer,
        label: 'As a lawyer, plead a case in the High Court',
        choice: null
      }, {
        type: SixStepSeventhChoices.TakePartIn,
        label: 'Take part in an archaeological find (e.g. a dig )',
        choice: null
      }, {
        type: SixStepSeventhChoices.BringACriminalToJustice,
        label: 'Bring a criminal to justice, either by detective work or as a lawyer in court',
        choice: null
      }, {
        type: SixStepSeventhChoices.PerformAtTheRoyalAlbertHall,
        label: 'perform at the Royal Albert Hall',
        choice: null
      }, {
        type: SixStepSeventhChoices.RunASuccessfulBusiness,
        label: 'run a successful business which I founded myself',
        choice: null
      }, {
        type: SixStepSeventhChoices.ExhibitMyArtwork,
        label: 'exhibit my artwork at an influential gallery, or curate an exhibition of a famous artist',
        choice: null
      }, {
        type: SixStepSeventhChoices.AppearInThePages,
        label: 'appear in the pages of Vogue, either as a designer, a model or a make-up artist',
        choice: null
      }, {
        type: SixStepSeventhChoices.MakeADifference,
        label: 'make a difference in the lives of young children, the elderly or any vulnerable person',
        choice: null
      }, {
        type: SixStepSeventhChoices.ToGainADeeper,
        label: 'to gain a deeper understanding of philosophies and belief systems which shine a light upon our purpose in life',
        choice: null
      }, {
        type: SixStepSeventhChoices.AcquireADeepUnderstanding,
        label: 'acquire a deep understanding of the human mind and what makes people tick',
        choice: null
      }
    ];

    if (props.answer && props.answer.answer) {
      const { answer } = props.answer;
      choice = props.answer.answer.choice;

      if (answer.entisiasmChoices) {
        entisiasmChoices = answer.entisiasmChoices;
      }

      if (answer.dreamChoices) {
        dreamChoices = answer.dreamChoices;
      }
    }

    this.state = {
      choice,
      entisiasmChoices,
      dreamChoices,
      subStep: SubStep.Welcome,
      popup: false
    }
  }

  /*
  renderPopup() {
    return (
      <div className="popup-container">
        <div className="question-popup">
          <div className="font-32 title-flex bold">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.4165 9.66146C14.4165 8.78746 15.1258 8.07812 15.9998 8.07812C16.8738 8.07812 17.5832 8.78746 17.5832 9.66146C17.5832 10.5355 16.8738 11.2448 15.9998 11.2448C15.1258 11.2448 14.4165 10.5355 14.4165 9.66146ZM14.4165 14.4115C14.4165 13.5375 15.1258 12.8281 15.9998 12.8281C16.8738 12.8281 17.5832 13.5375 17.5832 14.4115V22.3281C17.5832 23.2021 16.8738 23.9115 15.9998 23.9115C15.1258 23.9115 14.4165 23.2021 14.4165 22.3281V14.4115ZM15.9997 28.6615C9.01559 28.6615 3.33301 22.9789 3.33301 15.9948C3.33301 9.01071 9.01559 3.32812 15.9997 3.32812C22.9838 3.32812 28.6663 9.01071 28.6663 15.9948C28.6663 22.9789 22.9838 28.6615 15.9997 28.6615ZM15.9998 0.164062C7.25509 0.164062 0.166504 7.25265 0.166504 15.9974C0.166504 24.7421 7.25509 31.8307 15.9998 31.8307C24.743 31.8307 31.8332 24.7421 31.8332 15.9974C31.8332 7.25265 24.743 0.164062 15.9998 0.164062Z" fill="white" />
            </svg>
            Other Types of Sixth Form Courses
          </div>
          <div className="font-25">
            About 5,000 students take IB International Baccalaureate in the UK each year (six subjects). About 6,000 take Scottish Highers (four to six subjects). If you’re an IB or Highers student this process may help you identify your strengths, but it won’t give an exact fit.
          </div>
          <div className="green-btn font-25" onClick={() => {
            this.setState({ popup: false, choice: FirstChoice.Other });
          }}>GOT IT</div>
        </div>
      </div>
    );
  }*/

  setChoice(choice: FirstChoice) {
    this.setState({ choice });
    this.props.onChoiceChange({ choice });
  }

  render() {
    if (this.state.subStep === SubStep.Dreams) {
      return (
        <StepDreams
          choices={this.state.dreamChoices}
          onChange={dreamChoices => this.setState({ dreamChoices })}
          moveBack={() => this.setState({ subStep: SubStep.DreamsStart })}
          moveNext={() => {
            //this.props.saveAnswer(this.getAnswer());
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
        choices={this.state.entisiasmChoices}
        onChange={entisiasmChoices => this.setState({ entisiasmChoices })}
        moveBack={() => this.setState({ subStep: SubStep.EntusiasmStart })}
        moveNext={() => {
          //this.props.saveAnswer(this.getAnswer());
          this.setState({ subStep: SubStep.DreamsStart });
        }}
      />
    } else if (this.state.subStep === SubStep.EntusiasmStart) {
      return <StepEntusiasmStart
        moveBack={() => this.setState({ subStep: SubStep.Start })}
        moveNext={() => this.setState({ subStep: SubStep.Entusiasm })}
      />
    } else if (this.state.subStep === SubStep.Email) {
    } else if (this.state.subStep === SubStep.Name) {
    } else if (this.state.subStep === SubStep.Age) {
    } else if (this.state.subStep === SubStep.Start) {
      return <FirstStepWelcome
        moveNext={() => this.setState({ subStep: SubStep.EntusiasmStart })}
        moveBack={() => this.setState({ subStep: SubStep.Welcome })}
      />
    }

    return <WelcomePage moveNext={() => this.setState({ subStep: SubStep.Start })} />;
    /*
    return (
      <div className="question">
        <img src="/images/choicesTool/MaskGroup.png" alt="step1" className="mask-step-img" />
        <div className="bold font-32 question-text">
          What type of courses are you considering for the sixth form?
        </div>
        <div className="boxes-container font-24">
          <CheckBoxV2
            currentChoice={FirstChoice.ALevel} choice={this.state.choice}
            label="A-level courses only" setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={FirstChoice.Vocational} choice={this.state.choice} 
            label="Vocational courses only (e.g. BTEC, T-level)" setChoice={choice => this.setChoice(choice)} 
          />
          <CheckBoxV2
            currentChoice={FirstChoice.ShowMeAll} choice={this.state.choice}
            label="A-levels and vocational courses" setChoice={choice => this.setChoice(choice)}
          />
          <CheckBoxV2
            currentChoice={FirstChoice.Other} choice={this.state.choice}
            label="Are there other types of sixth form courses?*"
            setChoice={() => this.setState({ choice: FirstChoice.Other, popup: true })}
          />
        </div>
        <BackButtonSix onClick={this.props.moveBack} />
        <button
          className={`absolute-contunue-btn font-24 ${this.state.choice === null ? 'disabled' : ''}`}
          disabled={this.state.choice === null}
          onClick={this.props.moveNext}
        >
          Continue to Step 2
        </button>
        {this.state.popup && this.renderPopup()}
      </div>
    );*/
  }
}

export default FirstQuestion;
