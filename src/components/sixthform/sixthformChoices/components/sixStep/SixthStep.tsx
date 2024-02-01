import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import CheckBoxV2 from "../CheckBox";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BackButtonSix from "../BackButtonSix";
import SixthStepSeventhTable from "./SeventhTable";
import SixthStepSixthTable from "./SixthTable";
import FifthBTable from "./FifthBTable";
import FourthTable from "./FourthTable";
import ThirdTable from "./ThirdTable";
import SecondTable from "./SecondTable";
import map from "components/map";

interface FirstQuestionProps {
  answer: any;
  history: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
  moveBack(answer: any): void;
}

export enum SixthSubStep {
  Start,
  sixA,
  sixB,
  second,
  third,
  fourth,
  fifthA,
  fifthB,
  sixth,
  seventh,
  final
}

export enum ReadingChoiceV2 {
  Fiction = 1,
  Science,
  Sport,
  Music,
  Travel,
  Nature,
  History,
  Biography,
  Art,
  Power,
  Religion,
  Other
}

export enum ReadingChoice {
  first = 1,
  second,
  third,
  fourth,
  fifth,
}

export enum WritingChoice {
  first,
  second,
  third,
  fourth,
  fifth,
  sixth
}

export enum SixStepFourthChoices {
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

export enum FirstChoice {
  ALevel = 1,
  Vocational,
  ShowMeAll,
  Other
}

interface SixStepState {
  readingChoice: FirstChoice | null;
  writingChoice: FirstChoice | null;
  readingChoicesV2: ReadingChoiceV2[];
  secondChoices: any[];
  thirdChoices: any[];
  fourthChoices: any[];
  fifthBChoices: any[];
  sixthChoices: any[];
  seventhChoices: any[];
  subStep: SixthSubStep;
}

class SixthStep extends Component<FirstQuestionProps, SixStepState> {
  constructor(props: FirstQuestionProps) {
    super(props);

    let readingChoice = null;
    let writingChoice = null;

    if (props.answer && props.answer.answer) {
      const {answer} = props.answer;
      readingChoice = answer.readingChoice;
      writingChoice = answer.writingChoice;
    }

    let secondChoices = [
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
    ]

    let thirdChoices = [
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
        label: 'Music, Folk',
        choice: null
      }, {
        label: 'Music, Jazz & Big Band',
        choice: null
      }, {
        label: 'Music, Classical ',
        choice: null
      }
    ]

    let fourthChoices = [
      {
        type: SixStepFourthChoices.InTheClassroom,
        label: 'In the classroom, I enjoy contributing ideas and showing what I know.',
        choice: null
      }, {
        type: SixStepFourthChoices.ICantStand,
        label: 'I can’t stand pretentious people who waffle on about stuff which isn’t relevant.',
        choice: null
      }, {
        type: SixStepFourthChoices.AtHome,
        label: 'At home, my family talk a lot about what’s going on in the world and we have interesting discussions.',
        choice: null
      }, {
        type: SixStepFourthChoices.WithMyFriends,
        label: 'With my friends I mainly gossip and enjoy the chance to banter and have fun.',
        choice: null
      }, {
        type: SixStepFourthChoices.MyFriends,
        label: 'My friends put forward new ideas and challenge my thinking in ways I value.',
        choice: null
      }, {
        type: SixStepFourthChoices.IPreferPractical,
        label: 'I prefer practical, problem-solving subjects like Maths because there’s less drivel and more solid answers.',
        choice: null
      }, {
        type: SixStepFourthChoices.ILove,
        label: 'I love the chance to put an argument in a proper debate, and I’m good at undermining other people’s arguments.',
        choice: null
      }, {
        type: SixStepFourthChoices.ImNot,
        label: 'I’m not a confident communicator - my strengths are in other areas.',
        choice: null
      }, {
        type: SixStepFourthChoices.ILikeTalking,
        label: 'I like talking in depth with others about music, books or about documentaries, plays and films we’ve seen.',
        choice: null
      }, {
        type: SixStepFourthChoices.IPreferToListen,
        label: 'I prefer to listen carefully and chip in only when something really needs to be said.',
        choice: null
      }, {
        type: SixStepFourthChoices.IReallyAdmire,
        label: 'I really admire people who can communicate effectively in foreign languages.',
        choice: null
      }
    ]

    let fifthBChoices = [
      {
        name: 'Fiction',
        description: 'writing stories or imaginative descriptions',
        choice: null
      }, {
        name: 'Essays',
        description: 'assembling evidence and arguments',
        choice: null
      }, {
        name: 'Poetry',
        description: 'poems, verse, rap or song lyrics',
        choice: null
      }, {
        name: 'Theatre Pieces',
        description: 'plays, devised drama and comedy sketches',
        choice: null
      }, {
        name: 'Proposals, Projects & Reports',
        description: 'pitching ideas, writing up research or experiments',
        choice: null
      }, {
        name: 'Articles & Reviews',
        description: 'for blogs, magazines or newspapers',
        choice: null
      }, {
        name: 'Diary & Correspondence',
        description: 'Keeping up with penpals, or writing a journal',
        choice: null
      }
    ];

    let sixthChoices = [
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
        label: 'performing in a show',
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

    let seventhChoices = [
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
        type: SixStepSeventhChoices.IPreferPractical,
        label: 'I prefer practical, problem-solving subjects like Maths because there’s less drivel and more solid answers.',
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

    this.state = {
      readingChoice,
      writingChoice,
      readingChoicesV2: [],
      secondChoices,
      thirdChoices,
      fourthChoices,
      fifthBChoices,
      seventhChoices,
      sixthChoices,
      subStep: SixthSubStep.Start,
    }
  }

  setReadingChoice(readingChoice: FirstChoice) {
    this.setState({ readingChoice });
  }

  setWritingChoice(writingChoice: FirstChoice) {
    this.setState({ writingChoice });
  }


  getAnswer() {
    return {
      subStep: this.state.subStep,
      readingChoice: this.state.readingChoice,
      writingChoice: this.state.writingChoice,
      readingChoicesV2: this.state.readingChoicesV2,
      secondChoices: this.state.secondChoices,
      thirdChoices: this.state.thirdChoices,
      fourthChoices: this.state.fourthChoices,
      fifthBChoices: this.state.fifthBChoices,
      seventhChoices: this.state.seventhChoices,
      sixthChoices: this.state.sixthChoices,
    }
  }

  renderReadingChoiceV2(label: string, currentChoice: ReadingChoiceV2) {
    const choiceR1 = this.state.readingChoicesV2.find(c => c === currentChoice);
    return (
      <CheckBoxV2
        currentChoice={currentChoice}
        choice={choiceR1 as any}
        label={label}
        setChoice={choice => {
          let choices = this.state.readingChoicesV2;
          let index = choices.findIndex(c => c === choice);
          if (index >= 0) {
            choices.splice(index, 1);
          } else {
            if (choices.length <= 3) {
              choices.push(choice);
            }
          }
          this.setState({ readingChoicesV2: this.state.readingChoicesV2 });
        }}
      />
    );
  }

  render() {
    if (this.state.subStep === SixthSubStep.final) {
      return (
        <div className="question question-6 question-6-final">
          <div className="background-confetti-sixthform">
            <SpriteIcon name="confetti-sixthform" className="confeti-sixthform" />
          </div>
          <div className="background-opacity-s6" />
          <div className="abolute-final-s5">
            <div className="flex-center">
              <svg className="success-icon" viewBox="0 0 104 118" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.9542 17.0131C31.669 18.482 31.8129 20.72 33.2867 22.0102C34.7556 23.3004 36.9936 23.1516 38.2838 21.6827C39.574 20.2089 39.4202 17.9758 37.9514 16.6856C36.4825 15.3954 34.2445 15.5443 32.9542 17.0131ZM50.3027 29.5679L39.7527 65.2077L55.6621 31.6124L50.3027 29.5679ZM75.7448 4.77091C76.7919 3.57994 76.6728 1.75879 75.4769 0.711725C74.2809 -0.335337 72.4597 -0.211318 71.4176 0.979652C70.3706 2.17558 70.4897 3.99184 71.6856 5.0389C72.8815 6.08596 74.6977 5.96685 75.7448 4.77091ZM43.3355 68.1752L79.7296 32.8728L73.5366 27.444L43.3355 68.1752ZM91.287 66.6369C89.9968 68.1057 90.1506 70.3437 91.6194 71.629C93.0883 72.9192 95.3264 72.7704 96.6166 71.3015C97.9018 69.8326 97.7529 67.5946 96.2841 66.3044C94.8102 65.0141 92.5722 65.163 91.287 66.6369ZM48.6998 73.0483L78.762 59.8781L76.0277 54.8363L48.6998 73.0483ZM102.978 37.1603C101.872 36.1927 100.194 36.3068 99.2318 37.4085C98.2641 38.5101 98.3733 40.1924 99.4799 41.1551C100.582 42.1227 102.259 42.0086 103.226 40.907C104.194 39.8004 104.085 38.128 102.978 37.1603Z" fill="#C43C30" />
                <path d="M81.3233 24.7168L83.492 30.8155L87.0103 25.3817L93.4812 25.2031L89.4021 20.1762L91.2333 13.9682L85.194 16.2906L79.8595 12.6334L80.2068 19.0943L75.0807 23.0444L81.3233 24.7168ZM23.5663 45.5488L27.1591 44.7201L29.8784 47.2161L30.206 43.539L33.4216 41.7277L30.0273 40.2837L29.2978 36.6661L26.8712 39.45L23.209 39.0282L25.1046 42.1942L23.5663 45.5488ZM61.1017 12.0726L60.268 5.65625L55.6778 10.2216L49.321 9.03069L52.2438 14.8019L49.1473 20.4838L55.5389 19.4864L59.9851 24.1857L61.0124 17.7942L66.8581 15.0203L61.1017 12.0726ZM22.7177 58.6197L19.9884 65.7357L31.7691 66.5446L22.7177 58.6197ZM70.9073 76.8713L69.0266 73.6954L67.652 77.1194L64.0494 77.9283L66.8829 80.2954L66.5405 83.9675L69.6667 82.0074L73.0511 83.4663L72.1529 79.8884L74.5845 77.1145L70.9073 76.8713ZM93.8286 48.6403L88.8017 48.7892L85.8292 44.735L84.4199 49.5584L79.6412 51.1315L83.7947 53.965L83.8095 58.9919L87.7943 55.9152L92.578 57.4535L90.8859 52.7194L93.8286 48.6403ZM37.2674 71.3631L18.331 70.0629L14.7581 79.3674L49.1027 81.7345L37.2674 71.3631ZM0 117.856L11.5673 111.563L2.64989 110.948L0 117.856ZM4.30731 106.631L18.8024 107.628L34.3843 99.1474L7.88019 97.3212L4.30731 106.631ZM13.1106 83.6946L9.53767 92.999L41.6243 95.2073L55.7274 87.5305L54.6059 86.5479L13.1106 83.6946Z" fill="#FFB11D" />
              </svg>
            </div>
            <div className="flex-center">
              <div className="bold font-40 question-text">
                Well done!
              </div>
            </div>
            <div className="flex-center">
              <div className="font-20">
                You’ve successfully completed the Course Selector Questionnaire.<br /> Kindly check your email for your detailed report and results.
              </div>
            </div>
            <button className="absolute-contunue-btn font-24" onClick={() => {
              // exit
              this.props.history.push(map.SixthformOutcome);
            }}>Exit</button>
          </div>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.seventh) {
      return (
        <div className="question question-6 question-6-seventh">
          <div className="bold font-32 question-text">
            <div>
              Dreams, Ambitions and Values
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Your ideas about the future reflect your priorities, interests<br />
                and what you feel may be possible. Some of the goals below<br />
                may seem exceptional, but none are impossible.
              </div>
            </div>
          </div>
          <div className="font-16">
            Be honest with yourself. Most answers below will be “not really” - they might sound like nice ideas but you have never given them serious thought.<br />
            If a scenario touches something close to you that you find genuinely exciting, put “definitely”.
          </div>
          <SixthStepSeventhTable seventhChoices={this.state.seventhChoices} onChoiceChange={() => {
            this.setState({ seventhChoices: this.state.seventhChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixth })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.final });
          }}>Finish Course Selector</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixth) {
      return (
        <div className="question question-6 question-6-sixth">
          <div className="bold font-32 question-text">
            <div>
              Enthusiasms, Passions and Interests
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Please be assured that we NEVER give your data to companies which<br />
                might try to sell you stuff. The reason we are asking this is because<br />
                sometimes the things you love doing complement what you might study.
              </div>
            </div>
          </div>
          <div className="font-16">
            Decide how true the following statements are as they apply to you.
          </div>
          <SixthStepSixthTable seventhChoices={this.state.sixthChoices} onChoiceChange={() => {
            this.setState({ sixthChoices: this.state.sixthChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fifthB })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.seventh });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fifthB) {
      return (
        <div className="question question-6 question-6-fifthB">
          <div className="bold font-32 question-text">
            <div>
              Writing
            </div>
          </div>
          <div className="font-16">
            For each type of writing, say how much of it you do.
          </div>
          <FifthBTable seventhChoices={this.state.fifthBChoices} onChoiceChange={() => {
            this.setState({ fifthBChoices: this.state.fifthBChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fifthA })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.sixth });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fifthA) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Writing
            </div>
          </div>
          <div className="font-16">
            Which of the following statements best describes your attitude to writing?
          </div>
          <div className="boxes-container start font-16">
            <CheckBoxV2
              currentChoice={WritingChoice.first} choice={this.state.writingChoice}
              label="Writing well is something I take pride in and hugely enjoy."
              setChoice={this.setWritingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={WritingChoice.second} choice={this.state.writingChoice}
              label="I am confident that I’m a good written communicator and I like writing."
              setChoice={this.setWritingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={WritingChoice.third} choice={this.state.writingChoice}
              label="The only time I write at length is for schoolwork. I don’t object to it but I don’t relish it."
              setChoice={this.setWritingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={WritingChoice.fourth} choice={this.state.writingChoice}
              label="I’m not a natural communicator on paper: writing is a chore I’d rather do without."
              setChoice={this.setWritingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={WritingChoice.fifth} choice={this.state.writingChoice}
              label="Travel, Geography and Other Cultures"
              setChoice={this.setWritingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={WritingChoice.sixth} choice={this.state.writingChoice}
              label="I hate writing and much prefer subjects have little or no need for it."
              setChoice={this.setWritingChoice.bind(this)}
            />
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.fourth })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.fifthB });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.fourth) {
      return (
        <div className="question question-6 question-6-fourth">
          <div className="bold font-32 question-text">
            <div>
              Speaking
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                We talk about what we’re interested in, and the way we engage in<br />
                discussion and take opportunities to speak reflects our character.
              </div>
            </div>
          </div>
          <div className="font-16">
            Decide how true the following statements are about the types of conversation you have and the way you use opportunities to speak.
          </div>
          <FourthTable seventhChoices={this.state.fourthChoices} onChoiceChange={() => {
            this.setState({ fourthChoices: this.state.fourthChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.third })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.fifthA });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.third) {
      return (
        <div className="question question-6 question-6-third">
          <div className="bold font-32 question-text">
            <div>
              Listening
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                The average teemager spends more than two hours per<br />
                day streaming music or podcasts, or listening to radio.
              </div>
            </div>
          </div>
          <div className="font-16">
            How often do you listen to the following?
          </div>
          <ThirdTable seventhChoices={this.state.thirdChoices} onChoiceChange={() => {
            this.setState({ thirdChoices: this.state.thirdChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.second })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.fourth });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.second) {
      return (
        <div className="question question-6 question-6-second">
          <div className="bold font-32 question-text">
            <div>
              Watching TV, Video & Social Media
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                What you choose to watch reflects your interests and, to some<br />
                extent, your capacity to challenge yourself with content which might<br />
                seek to inform or educate as well as simply entertain.
              </div>
            </div>
          </div>
          <div className="font-16">
            There is all sorts of content out there, and all sorts of ways to watch it. How often do you watch the following:
          </div>
          <SecondTable seventhChoices={this.state.secondChoices} onChoiceChange={() => {
            this.setState({ secondChoices: this.state.secondChoices });
          }} />
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixB })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.third });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixB) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Reading
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Reading habits can be an indication of what types of subjects you’ll<br />
                enjoy studying. Some very able students don’t read much, but a deep-<br />
                rooted love of reading is a good indicator of academic aptitude.
              </div>
            </div>
          </div>
          <div className="font-16">
            What sort of reading do you enjoy most?	Select up to FOUR
          </div>
          <Grid container direction="row">
            <Grid item xs={6}>
              <div className="boxes-container start font-16">
                {this.renderReadingChoiceV2("Fiction", ReadingChoiceV2.Fiction)}
                {this.renderReadingChoiceV2("Science & Technology", ReadingChoiceV2.Science)}
                {this.renderReadingChoiceV2("Sport & Coaching", ReadingChoiceV2.Sport)}
                {this.renderReadingChoiceV2("Music & Poetry", ReadingChoiceV2.Music)}
                {this.renderReadingChoiceV2("Travel, Geography and Other Cultures", ReadingChoiceV2.Travel)}
                {this.renderReadingChoiceV2("Nature & Environment", ReadingChoiceV2.Nature)}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="boxes-container end font-16">
                {this.renderReadingChoiceV2("History", ReadingChoiceV2.History)}
                {this.renderReadingChoiceV2("Biography / Autobiographies", ReadingChoiceV2.Biography)}
                {this.renderReadingChoiceV2("Art, Design and Architecture", ReadingChoiceV2.Art)}
                {this.renderReadingChoiceV2("Power, Money, Government & Politics", ReadingChoiceV2.Power)}
                {this.renderReadingChoiceV2("Religion, Philosophy & Self Improvement", ReadingChoiceV2.Religion)}
                {this.renderReadingChoiceV2("Other", ReadingChoiceV2.Other)}
              </div>
            </Grid>
          </Grid>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.sixA })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.second });
          }}>Continue</button>
        </div>
      );
    } else if (this.state.subStep === SixthSubStep.sixA) {
      return (
        <div className="question question-6">
          <div className="bold font-32 question-text">
            <div>
              Reading
            </div>
            <div className="hover-area font-14">
              <SpriteIcon name="help-circle-r1" className="info-icon" />
              <div className="hover-content regular">
                <div className="triangle-popup" />
                Reading habits can be an indication of what types of subjects you’ll<br />
                enjoy studying. Some very able students don’t read much, but a deep-<br />
                rooted love of reading is a good indicator of academic aptitude.
              </div>
            </div>
          </div>
          <div className="font-16">
            Which of the following statements best describes your attitude to reading?”
          </div>
          <div className="boxes-container font-16">
            <CheckBoxV2
              currentChoice={ReadingChoice.first} choice={this.state.readingChoice}
              label="I absolutely love reading and devour all sorts of books." setChoice={this.setReadingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.second} choice={this.state.readingChoice}
              label="I do read for pleasure and enjoy books if they interest me." setChoice={this.setReadingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.third} choice={this.state.readingChoice}
              label="I read if I have to - if a book is set at school - and usually don’t mind unless the book is really boring."
              setChoice={this.setReadingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.fourth} choice={this.state.readingChoice}
              label="I get very little pleasure from reading and I don’t enjoy reading for school."
              setChoice={this.setReadingChoice.bind(this)}
            />
            <CheckBoxV2
              currentChoice={ReadingChoice.fifth} choice={this.state.readingChoice}
              label="I hate reading and hardly ever touch a book."
              setChoice={this.setReadingChoice.bind(this)}
            />
          </div>
          <BackButtonSix onClick={() => this.setState({ subStep: SixthSubStep.Start })} />
          <button className="absolute-contunue-btn font-24" onClick={() => {
            console.log('save answer');
            this.props.saveAnswer(this.getAnswer());
            this.setState({ subStep: SixthSubStep.sixB });
          }}>Continue</button>
        </div>
      );
    }
    return (
      <div className="question question-6">
        <div className="bold font-32 question-text">
          This part is about YOU
        </div>
        <div className="font-16">
          It’s the most fun and, in many ways, the most important part of the process.
        </div>
        <div className="font-16">
          We do not pretend that we can ask a few questions and know all about you just because we use an algorithm and some AI. But taking your interests and how you think and feel about a variety of questions is relevant to the courses you choose. Success in the sixth form certainly comes more easily if your courses fit your character, your strengths and weaknesses and your natural preferences.
        </div>
        <div className="font-16">
          Each of your answers in this final part helps us to evaluate your interests and instincts, the type of intelligence you possess and your character.
        </div>
        <SpriteIcon name="sixthform-sixth-description" className="big-svg-description" />
        <BackButtonSix onClick={() => this.props.moveBack(this.getAnswer())} />
        <button className="absolute-contunue-btn font-24" onClick={() => {
          this.setState({ subStep: SixthSubStep.sixA });
        }}>Let’s start!</button>
      </div>
    );
  }
}

export default SixthStep;