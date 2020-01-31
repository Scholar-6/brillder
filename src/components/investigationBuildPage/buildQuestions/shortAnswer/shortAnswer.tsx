import React from 'react';
import { Grid } from '@material-ui/core';

import './shortAnswer.scss';
import Dustbin from '../components/DragDustbin';
import { Question, QuestionComponentTypeEnum } from '../../../model/question';
import DraggableShortAnswer from './draggableAnswer';

type CardProps = {
  activeStep: number,
  question: Question,
  swapComponents: Function,
}

const HorizontalLinearStepper = ({ activeStep, question, swapComponents }: CardProps) => {
  const renderDropBox = (component: any, index: number) => {

    switch (component.type) {
      case QuestionComponentTypeEnum.Text:
        return (
          <div className="box">
            <p>Text Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Image:
        return (
          <div className="box">
            <p>Image Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Hint:
        return (
          <div className="box">
            <p>Hint Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Quote:
        return (
          <div className="box">
            <p>Quote Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Sound:
        return (
          <div className="box">
            <p>Sound Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Equation:
        return (
          <div className="box">
            <p>Equation Component</p>
          </div>
        )
      case QuestionComponentTypeEnum.Component:
        return (
          <DraggableShortAnswer index={index} value="" onDrop={swapComponents} />
        )
      default:
        return <Dustbin index={index} />
    }
  }

  return (
    <div className="short-answer">
      {
        question.components.map((comp, i) => {
          return (
            <Grid key={i} container direction="row" className="drop-box">
              {
                renderDropBox(comp, i)
              }
            </Grid>
          )
        })
      }
    </div>
  );
}

export default HorizontalLinearStepper;
