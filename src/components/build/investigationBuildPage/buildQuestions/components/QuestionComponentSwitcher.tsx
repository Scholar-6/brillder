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
  locked: boolean
  componentCount: number
  updateComponent(component: any, index: number): void
  swapComponents: Function
  setQuestionHint(hintState: HintState): void
  removeComponent(componentIndex: number): void
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type, index, component, hint, locked, componentCount,
  swapComponents,
  setQuestionHint,
  updateComponent,
  uniqueComponent,
  removeComponent
}) => {

  const renderEmptyComponent = () => 
    <Grid container style={{height:'100%', position: 'relative'}} justify="center" alignContent="center">
      {
        (componentCount > 3) ? <DeleteIcon className="right-top-drop-icon" onClick={() => {removeComponent(index)}} /> : ""
      }
      <span className="drop-box-text" style={{color: '#838384', textAlign: 'justify'}}>
        Drag Component Here
      </span>
    </Grid>

  const cleanComponent = () => {
    updateComponent({ type: 0 }, index);
  }

  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    if (data.list && data.list.length) {
      return data.list.length;
    }
    return count;
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
    let numberOfAnswers = getNumberOfAnswers(component);
    if (uniqueComponent.name === "MissingWordComponent") {
      if (component.choices) {
        numberOfAnswers = component.choices.length;
      }
    } else if (uniqueComponent.name === "CategoriseBuildComponent") {
      if (component.categories) {
        numberOfAnswers = component.categories.length;
      }
    }
    return (
      <div className="unique-component-wrapper">
        <DragAndDropBox
          locked={locked}
          index={index}
          value={value}
          data={component}
          onDrop={swapComponents}
          cleanComponent={() => {}}
          updateComponent={updateComponent}
          component={innerComponent} />
        <HintComponent status={hint.status} locked={locked} value={hint.value} list={hint.list} count={numberOfAnswers} onChange={setQuestionHint}/>
      </div>
    )
  }
  if (innerComponent !== renderEmptyComponent) {
    return (
      <div style={{position: 'relative', width: '100%'}}>
        <DeleteIcon className="right-top-icon" style={{right: '2px', top: '7px'}} onClick={cleanComponent} />
        <DragAndDropBox
          locked={locked}
          index={index}
          value={value}
          data={component}
          onDrop={swapComponents}
          cleanComponent={cleanComponent}
          updateComponent={updateComponent}
          component={innerComponent} />
      </div>
    );
  }
  return (
    <DragAndDropBox
      locked={locked}
      index={index}
      value={value}
      data={component}
      onDrop={swapComponents}
      cleanComponent={cleanComponent}
      updateComponent={updateComponent}
      component={innerComponent} />
  );
}

export default SwitchQuestionComponent
