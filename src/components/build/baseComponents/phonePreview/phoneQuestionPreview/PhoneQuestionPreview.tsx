
import React from 'react';
import { Hidden, Grid } from '@material-ui/core';

import './PhoneQuestionPreview.scss';
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { isHintEmpty } from 'components/build/questionService/ValidateQuestionService';
import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from 'model/question';
import { SortCategory } from 'components/interfaces/sort';
import EmptyQP1 from './EmptyQP1';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import BasePhonePreview from 'components/baseComponents/BasePhonePreview';


export interface PhonePreviewProps {
  question: Question;
  focusIndex: number;
  // navigation
  nextQuestion(): void;
  prevQuestion(): void;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ question, ...props }) => {
  const canGoBack = true;

  const [questionPreview] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);

  //#region Scroll
  const [canScroll, setScroll] = React.useState(false);

  const checkScroll = () => {
    const { current } = questionPreview;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          setScroll(true);
        }
      } else {
        if (canScroll) {
          setScroll(false);
        }
      }
    }
  }

  const scrollUp = () => {
    try {
      if (questionPreview.current) {
        questionPreview.current.scrollBy(0, -50);
      }
    } catch { }
  }

  const scrollDown = () => {
    try {
      if (questionPreview.current) {
        let el = questionPreview.current;
        el.scrollBy(0, 50);
      }
    } catch { }
  }
  //#endregion

  const areComponentsEmpty = () => {
    for (const component of question.components) {
      const { type } = component;
      if (
        type === QuestionComponentTypeEnum.Text ||
        type === QuestionComponentTypeEnum.Quote ||
        type === QuestionComponentTypeEnum.Image ||
        type === QuestionComponentTypeEnum.Sound
      ) {
        if (component.value) {
          return false;
        }
      } else if (type === QuestionComponentTypeEnum.Graph) {
        if (component.graphSettings || component.graphState) {
          return false;
        }
      }

      // unique question component
      if (type === QuestionComponentTypeEnum.Component) {
        if (
          question.type === QuestionTypeEnum.ShortAnswer ||
          question.type === QuestionTypeEnum.VerticalShuffle ||
          question.type === QuestionTypeEnum.HorizontalShuffle
        ) {
          const res = component.list?.find((el: any) => el.value);
          if (res) { return false; }
        } else if (
          question.type === QuestionTypeEnum.ChooseOne ||
          question.type === QuestionTypeEnum.ChooseSeveral
        ) {
          const res = component.list?.find((el: any) => el.value || el.valueFile);
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.MissingWord) {
          const res = component.choices?.find((el: any) => el.answers.find((a: any) => a.value))
          if (res) {
            return false;
          }
        } else if (question.type === QuestionTypeEnum.PairMatch) {
          const res = component.list?.find((el: any) => el.value || el.option || el.valueFile || el.optionFile);
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.Sort) {
          const res = component.categories?.find((cat: SortCategory) => cat.name || cat.answers.find(a => a.value || a.valueFile));
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.LineHighlighting) {
          if (component.lines && component.lines.length > 0) { return false; }
          if (component.text) { return false; }
        } else if (question.type === QuestionTypeEnum.WordHighlighting) {
          if (component.words && component.words.length > 0) { return false; }
          if (component.text) { return false; }
        }
      }
    }
    return true;
  }

  const renderInnerComponent = () => {
    if (!question || !question.type) {
      return <EmptyQP1 />;
    }
    if (!question.firstComponent?.value && isHintEmpty(question.hint) && areComponentsEmpty()) {
      return <EmptyQP1 />;
    }
    setTimeout(() => { checkScroll() }, 100);
    return <QuestionPlay question={question} isPreview={true} focusIndex={props.focusIndex} answers={[]} />;
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-question-preview-box">
        <Grid container alignContent="center" justify="center" style={{ height: '100%' }}>
          <div className="centered pointer phone-toolbar">
            <SpriteIcon name="arrow-left" className={`scroll-arrow ${!canGoBack && 'disabled'}`} onClick={props.prevQuestion} />
            {canGoBack && <div className="css-custom-tooltip left-tooltip">Previous</div>}
          </div>
          <div className="phone-question-preview">
            <div className="centered phone-toolbar">
              <SpriteIcon name="arrow-up" className={`scroll-arrow ${!canScroll && 'disabled'}`} onClick={scrollUp} />
              <div className="css-custom-tooltip upper-tooltip">Scroll Up</div>
            </div>
            <BasePhonePreview>
              <div className="custom-component mobile-question-component b-white" ref={questionPreview}>
                {renderInnerComponent()}
              </div>
            </BasePhonePreview>
            <div className="centered phone-toolbar">
              <SpriteIcon name="arrow-down" className={`scroll-arrow ${!canScroll && 'disabled'}`} onClick={scrollDown} />
              <div className="css-custom-tooltip bottom-tooltip">Scroll Down</div>
            </div>
          </div>
          <div className="centered pointer phone-toolbar">
            <SpriteIcon name="arrow-right" className="scroll-arrow" onClick={props.nextQuestion} />
            <div className="css-custom-tooltip right-tooltip">Next</div>
          </div>
        </Grid>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
