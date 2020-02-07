import React from 'react'
import { QuestionComponentTypeEnum, Question } from '../../../model/question'
import DragAndDropBox from '../drag/dragAndDropBox'
import TextComponent from './Text'
import ImageComponent from './Image'
import HintComponent from './Hint'
import QuoteComponent from './Quote'
import SoundComponent from './Sound'
import EquationComponent from './Equation'

export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum
  index: number
  uniqueComponent: any
  component: any
  updateComponent(component:any):void
  swapComponents: Function
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({ type, index, swapComponents, component, updateComponent, uniqueComponent }) => {
  const renderEmptyComponent = () => <span>Drag component here</span>

  switch (type) {
    case QuestionComponentTypeEnum.Text:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={TextComponent} />
    case QuestionComponentTypeEnum.Image:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={ImageComponent} />
    case QuestionComponentTypeEnum.Hint:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={HintComponent} />
    case QuestionComponentTypeEnum.Quote:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={QuoteComponent} />
    case QuestionComponentTypeEnum.Sound:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={SoundComponent} />
    case QuestionComponentTypeEnum.Equation:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={EquationComponent} />
    case QuestionComponentTypeEnum.Component:
      return <DragAndDropBox index={index} value={type} onDrop={swapComponents} data={component} updateComponent={updateComponent} component={uniqueComponent} />
    default:
      return <DragAndDropBox index={index} value={QuestionComponentTypeEnum.None} data={component} onDrop={swapComponents} updateComponent={updateComponent} component={renderEmptyComponent} />
  }
}

export default SwitchQuestionComponent
