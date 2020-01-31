import React from 'react'
import { QuestionComponentTypeEnum } from '../../../model/question'
import DragAndDropBox from '../drag/dragAndDropBox'
import TextComponent from './Text'
import ImageComponent from './Image'
import HintComponent from './Hint'
import QuoteComponent from './Quote'
import SoundComponent from './Sound'
import EquationComponent from './Equation'

export interface DragAndBoxProps {
  index: number
  type: QuestionComponentTypeEnum
  uniqueComponent: any
  onDrop: Function
  component: Function
}

const SwitchQuestionComponent: React.FC<any> = ({ type, index, swapComponents, uniqueComponent }) => {
  const renderEmptyComponent = () => <span>Drag component here</span>
  console.log(55, type);

  switch (type) {
    case QuestionComponentTypeEnum.Text:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={TextComponent} />
    case QuestionComponentTypeEnum.Image:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={ImageComponent} />
    case QuestionComponentTypeEnum.Hint:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={HintComponent} />
    case QuestionComponentTypeEnum.Quote:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={QuoteComponent} />
    case QuestionComponentTypeEnum.Sound:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={SoundComponent} />
    case QuestionComponentTypeEnum.Equation:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={EquationComponent} />
    case QuestionComponentTypeEnum.Component:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} component={uniqueComponent} />
    default:
      return <DragAndDropBox index={index} value={QuestionComponentTypeEnum.None} onDrop={swapComponents} component={renderEmptyComponent} />
  }
}

export default SwitchQuestionComponent
