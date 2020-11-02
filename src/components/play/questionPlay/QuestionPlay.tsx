import React from 'react';

import './QuestionPlay.scss';
import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from "model/question";
import CompComponent from '../questionTypes/Comp';
import { ComponentAttempt } from '../model';

import TextLive from '../comp/TextLive';
import QuoteLive from '../comp/QuoteLive';
import ImageLive from '../comp/ImageLive';
import SoundLive from '../comp/SoundLive';
import GraphLive from '../comp/GraphLive';

import ShortAnswer from '../questionTypes/shortAnswer/ShortAnswer';
import ChooseOne from '../questionTypes/choose/chooseOne/ChooseOne';
import ChooseSeveral from '../questionTypes/choose/chooseSeveral/ChooseSeveral';
import VerticalShuffle from '../questionTypes/vericalShuffle/VerticalShuffle';
import HorizontalShuffle from '../questionTypes/horizontalShuffle/HorizontalShuffle';
import PairMatch from '../questionTypes/pairMatch/PairMatch';
import Sort from '../questionTypes/sort/Sort';
import MissingWord from '../questionTypes/missingWord/MissingWord';
import LineHighlighting from '../questionTypes/lineHighlighting/LineHighlighting';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/WordHighlighting';
import { PlayMode } from '../model';


interface QuestionProps {
  isTimeover?: boolean;
  attempt?: ComponentAttempt<any>;
  question: Question;
  isPhonePreview?: boolean;
  answers: any;
  isReview?: boolean;
  isBookPreview?: boolean;
  onAttempted?(): void;

  // only for real play
  mode?: PlayMode;
}

interface QuestionState {
  answerRef: React.RefObject<CompComponent<any, any>>
}

class QuestionLive extends React.Component<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props);

    this.state = {
      answerRef: React.createRef<CompComponent<any, any>>()
    }
  }

  getAnswer(): any {
    return this.state.answerRef.current?.getAnswer();
  }

  getAttempt(isReview: boolean): any {
    return this.state.answerRef.current?.getAttempt(isReview);
  }

  getRewritedAttempt(isReview: boolean): any {
    return this.state.answerRef.current?.getAttempt(isReview);
  }

  render() {
    const { question } = this.props;
    const renderUniqueComponent = (component: any, index: number) => {
      let UniqueComponent = {} as any;
      if (question.type === QuestionTypeEnum.ShortAnswer) {
        UniqueComponent = ShortAnswer;
      } else if (question.type === QuestionTypeEnum.ChooseOne) {
        UniqueComponent = ChooseOne;
      } else if (question.type === QuestionTypeEnum.ChooseSeveral) {
        UniqueComponent = ChooseSeveral;
      } else if (question.type === QuestionTypeEnum.VerticalShuffle) {
        UniqueComponent = VerticalShuffle;
      } else if (question.type === QuestionTypeEnum.HorizontalShuffle) {
        UniqueComponent = HorizontalShuffle;
      } else if (question.type === QuestionTypeEnum.PairMatch) {
        UniqueComponent = PairMatch;
      } else if (question.type === QuestionTypeEnum.Sort) {
        UniqueComponent = Sort;
      } else if (question.type === QuestionTypeEnum.MissingWord) {
        UniqueComponent = MissingWord;
      } else if (question.type === QuestionTypeEnum.LineHighlighting) {
        UniqueComponent = LineHighlighting;
      } else if (question.type === QuestionTypeEnum.WordHighlighting) {
        UniqueComponent = WordHighlightingComponent;
      }

      if (typeof UniqueComponent === "object") {
        return <div key={index}>Not implemented</div>
      }

      return (
        <UniqueComponent
          ref={this.state.answerRef as React.RefObject<any>}
          key={index}
          isTimeover={this.props.isTimeover}
          attempt={this.props.attempt}
          answers={this.props.answers}
          isPreview={this.props.isPhonePreview}
          isBookPreview={this.props.isBookPreview}
          question={question}
          component={component}
          isReview={this.props.isReview}
          onAttempted={this.props.onAttempted}
        />
      );
    }

    const renderComponent = (component: any, index: number) => {
      const { type } = component;
      if (type === QuestionComponentTypeEnum.Text) {
        return <TextLive mode={this.props.mode} key={index} component={component} />
      } else if (type === QuestionComponentTypeEnum.Image) {
        return <ImageLive key={index} component={component} />
      } else if (type === QuestionComponentTypeEnum.Quote) {
        return <QuoteLive mode={this.props.mode} key={index} component={component} />
      } else if (type === QuestionComponentTypeEnum.Sound) {
        return <SoundLive key={index} component={component} />
      } else if (type === QuestionComponentTypeEnum.Graph) {
        return <GraphLive key={index} component={component} />
      } else if (type === QuestionComponentTypeEnum.Component) {
        return renderUniqueComponent(component, index);
      }
      return <div key={index}></div>
    }

    try {
      return (
        <div>
          {
            question.firstComponent?.value &&
              <TextLive mode={this.props.mode} component={question.firstComponent} />
          }
          {
            question.components.map((component, index) => renderComponent(component, index))
          }
        </div>
      );
    } catch {
      return <div>Oops something is not working on this question.</div>
    }
  }
}

export default QuestionLive;
