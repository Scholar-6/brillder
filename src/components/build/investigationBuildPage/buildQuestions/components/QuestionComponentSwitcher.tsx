import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

import { QuestionComponentTypeEnum, Hint } from 'components/model/question';
import DragAndDropBox from '../drag/dragAndDropBox'
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import EquationComponent from './Equation/Equation'
import HintComponent, { HintState } from '../../../baseComponents/Hint/Hint';
import { Grid } from '@material-ui/core';


export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum
  index: number
  uniqueComponent: any
  component: any
  hint: Hint
  updateComponent(component: any, index: number): void
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
  uniqueComponent
}) => {

  const renderEmptyComponent = () => 
    <Grid container style={{height:'100%'}} justify="center" alignContent="center">
      <span className="drop-box-text" style={{color: '#838384', textAlign: 'justify'}}>
        D &nbsp; R &nbsp; A &nbsp; G &nbsp; &nbsp; C &nbsp; O &nbsp; M &nbsp; P &nbsp; O &nbsp; N &nbsp; E &nbsp; N &nbsp; T &nbsp; &nbsp; H &nbsp; E &nbsp; R &nbsp; E
        </span>
    </Grid>

  const cleanComponent = () => {
    updateComponent({ type: 0 }, index);
  }

  let innerComponent = renderEmptyComponent as any;
  let value = type;
  if (type === QuestionComponentTypeEnum.Text) {
    innerComponent = TextComponent;
  } else if (type === QuestionComponentTypeEnum.Image) {
    innerComponent = ImageComponent;
  } else if (type === QuestionComponentTypeEnum.Quote) {
    innerComponent = QuoteComponent;
  } else if (type === QuestionComponentTypeEnum.Sound) {
    innerComponent = SoundComponent;
  } else if (type === QuestionComponentTypeEnum.Equation) {
    innerComponent = EquationComponent;
  } else if (type === QuestionComponentTypeEnum.Component) {
    innerComponent = uniqueComponent;
    return (
      <div className="unique-component-wrapper">
        <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} cleanComponent={() => {}} updateComponent={updateComponent} component={innerComponent} />
        <HintComponent status={hint.status} value={hint.value} onChange={setQuestionHint}/>
      </div>
    )
  }
  if (innerComponent !== renderEmptyComponent) {
    return (
      <div style={{position: 'relative', width: '100%'}}>
        <DeleteIcon className="right-top-icon" style={{right: '2px', top: '7px'}} onClick={cleanComponent} />
        <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} cleanComponent={cleanComponent} updateComponent={updateComponent} component={innerComponent} />
      </div>
    );
  }
  return (
    <DragAndDropBox index={index} value={value} data={component} onDrop={swapComponents} cleanComponent={cleanComponent} updateComponent={updateComponent} component={innerComponent} />
  );
}

export default SwitchQuestionComponent
