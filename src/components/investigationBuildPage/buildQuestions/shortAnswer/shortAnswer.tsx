import React from 'react';
import { Grid } from '@material-ui/core';

import './shortAnswer.scss';
import { Question, QuestionComponentTypeEnum } from '../../../model/question';
import DraggableShortAnswer from './draggableAnswer';
import DragAndDropBox from '../components/DragAndDropBox';

type CardProps = {
  activeStep: number,
  question: Question,
  swapComponents: Function,
}

const HorizontalLinearStepper = ({ activeStep, question, swapComponents }: CardProps) => {
  const renderEmptyComponent = () => <span>Drag component here</span>

  const renderTextComponent = () => {
    return (
      <div className="box">
        <p>Text Component</p>
      </div>
    )
  }

  const renderImageComponent = () => {
    return (
      <div className="box">
        <p>Image Component</p>
      </div>
    )
  }

  const renderHintComponent = () => {
    return (
      <div className="box">
        <p>Hint Component</p>
      </div>
    )
  }

  const renderQuoteComponent = () => {
    return (
      <div className="box">
        <p>Quote Component</p>
      </div>
    )
  }

  const renderSoundComponent = () => {
    return (
      <p>Sound Component</p>
    )
  }

  const renderEquationComponent = () => {
    return (
      <p>Equation Component</p>
    )
  }

  const renderDropBox = (component: any, index: number) => {

    switch (component.type) {
      case QuestionComponentTypeEnum.Text:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderTextComponent} />
      case QuestionComponentTypeEnum.Image:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderImageComponent} />
      case QuestionComponentTypeEnum.Hint:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderHintComponent} />
      case QuestionComponentTypeEnum.Quote:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderQuoteComponent} />
      case QuestionComponentTypeEnum.Sound:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderSoundComponent} />
      case QuestionComponentTypeEnum.Equation:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={renderEquationComponent} />
      case QuestionComponentTypeEnum.Component:
        return <DragAndDropBox index={index} value={component.type} onDrop={swapComponents} component={DraggableShortAnswer} />
      default:
        return <DragAndDropBox index={index} value={QuestionComponentTypeEnum.None} onDrop={swapComponents} component={renderEmptyComponent} />
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
