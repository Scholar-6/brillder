
import React from 'react';
import {  Hidden, Grid } from '@material-ui/core';

import './PhoneQuestionPreview.scss';
import QuestionPlay from "components/play/questionPlay/QuestionPlay";
import { isHintEmpty } from 'components/build/questionService/ValidateQuestionService';
import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from 'model/question';
import { SortCategory } from 'components/interfaces/sort';
import EmptyQP1 from './EmptyQP1';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface PhonePreviewProps {
  getQuestionIndex(question: Question): number;
  question: Question;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ question, getQuestionIndex }) => {
  const [questionPreview] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);

  const areComponentsEmpty = () => {
    for (const component of question.components) {
      const {type} = component;
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
          const res = component.list?.find((el:any) => el.value);
          if (res) { return false; }
        } else if (
          question.type === QuestionTypeEnum.ChooseOne ||
          question.type === QuestionTypeEnum.ChooseSeveral
        ) {
          const res = component.list?.find((el:any) => el.value || el.valueFile);
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.MissingWord) {
          const res = component.choices?.find((el: any) => el.answers.find((a: any) => a.value))
          if (res) {
            return false;
          }
        } else if (question.type === QuestionTypeEnum.PairMatch) {
          const res = component.list?.find((el:any) => el.value || el.option || el.valueFile || el.optionFile);
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.Sort) {
          const res = component.categories?.find((cat: SortCategory) => cat.name || cat.answers.find(a => a.value || a.valueFile));
          if (res) { return false; }
        } else if (question.type === QuestionTypeEnum.LineHighlighting) {
          if (component.text || component.lines) { return false; }
        } else if (question.type === QuestionTypeEnum.WordHighlighting) {
          if (component.text || component.words) { return false; }
        }
      }
    }
    return true;
  }
  
  const scrollUp = () => {
    try {
      if (questionPreview.current) {
        questionPreview.current.scrollBy(0, -50);
      }
    } catch {}
  }

  const scrollDown = () => {
    try {
      if (questionPreview.current) {
        let el = questionPreview.current;
        el.scrollBy(0, 50);
      }
    } catch {}
  }

  const renderInnerComponent = () => {
    const questionIndex = getQuestionIndex(question);
    if (questionIndex === 0 && !question.firstComponent?.value && isHintEmpty(question.hint) && areComponentsEmpty()) {
      return <EmptyQP1 />;
    }
    return <QuestionPlay question={question} isPhonePreview={true} answers={[]} />;
  }
  
  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-question-preview-box">
        <Grid container alignContent="center" justify="center" style={{height: '100%'}}>
          <div className="phone-question-preview">
            <div className="centered">
              <SpriteIcon name="arrow-up" className="scroll-arrow" onClick={scrollUp} />
            </div>
            <div className="phone">
              <div className="phone-border">
                <div className="volume volume1"></div>
                <div className="volume volume2"></div>
                <div className="volume volume3"></div>
                <div className="sleep"></div>
                <div className="screen">
                  <div
                    className="custom-component mobile-question-component b-white"
                    ref={questionPreview}
                  >
                    {renderInnerComponent()}
                  </div>
                </div>
              </div>
            </div>
            <div className="centered">
              <SpriteIcon name="arrow-down" className="scroll-arrow" onClick={scrollDown} />
            </div>
          </div>
        </Grid>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
