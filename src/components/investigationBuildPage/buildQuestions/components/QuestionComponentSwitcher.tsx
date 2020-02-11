import React from 'react'
import { QuestionComponentTypeEnum } from '../../../model/question'
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

  let innerComponent = renderEmptyComponent as any;
  let value = type;
  if (type == QuestionComponentTypeEnum.Text) {
    innerComponent = TextComponent;
  } else if (type == QuestionComponentTypeEnum.Image) {
    innerComponent = ImageComponent;
  } else if (type == QuestionComponentTypeEnum.Quote) {
    innerComponent = QuoteComponent;
  } else if (type == QuestionComponentTypeEnum.Sound) {
    innerComponent = SoundComponent;
  } else if (type == QuestionComponentTypeEnum.Equation) {
    innerComponent = EquationComponent;
  } else if (type == QuestionComponentTypeEnum.Component) {
    innerComponent = uniqueComponent;
  }
  return (
    <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} updateComponent={updateComponent} component={innerComponent} />
  )
}

export default SwitchQuestionComponent
