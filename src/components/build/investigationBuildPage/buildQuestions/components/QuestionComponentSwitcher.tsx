import React from 'react'

import HintComponent, { HintState } from '../../../base-components/Hint/Hint';

import { QuestionComponentTypeEnum, Hint } from 'components/model/question';
import DragAndDropBox from '../drag/dragAndDropBox'
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import EquationComponent from './Equation/Equation'


export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum
  index: number
  uniqueComponent: any
  component: any
  hint: Hint
  updateComponent(component: any): void
  swapComponents: Function
  setQuestionHint(hintState: HintState): void
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type,
  index,
  component,
  hint,
  swapComponents,
  setQuestionHint,
  updateComponent,
  uniqueComponent }) => {

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
    return (
      <div className="unique-component-wrapper">
        <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} updateComponent={updateComponent} component={innerComponent} />
        <HintComponent status={hint.status} value={hint.value} onChange={setQuestionHint}/>
      </div>
    )
  }
  return (
    <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} updateComponent={updateComponent} component={innerComponent} />
  )
}

export default SwitchQuestionComponent
