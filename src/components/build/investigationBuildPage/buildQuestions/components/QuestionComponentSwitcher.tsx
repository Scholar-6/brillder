import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

import { QuestionComponentTypeEnum, Hint, QuestionTypeEnum } from 'model/question';
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import EquationComponent from './Equation/Equation'
import DropBox from './DropBox';
import HintComponent, { HintState } from '../../../baseComponents/Hint/Hint';


export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum
  index: number
  questionIndex: number
  uniqueComponent: any
  component: any
  hint: Hint
  locked: boolean
  canRemove: boolean
  updateComponent(component: any, index: number): void
  setQuestionHint(hintState: HintState): void
  removeComponent(componentIndex: number): void
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type, index, component, hint, locked, updateComponent, uniqueComponent, ...props
}) => {
  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    if (data.list && data.list.length) {
      return data.list.length;
    }
    return count;
  }

  const setComponentType = (type:number) => {
    component.type = type;
    updateComponent(component, index);
  }

  const setEmptyType = () => {
    component.type = QuestionTypeEnum.None;
    component.value = "";
    updateComponent(component, index);
  }

  let InnerComponent = DropBox as any;

  if (type === QuestionComponentTypeEnum.None) {
    return (
      <div style={{position: 'relative', width: '100%'}}>
        {
          props.canRemove
          ?
            <DeleteIcon
              className="right-top-icon"
              style={{right: '2px', top: '7px'}}
              onClick={() => props.removeComponent(index)} />
          : ""
        }
        <DropBox
          locked={locked}
          onDrop={setComponentType} />
      </div>
    );
  } else if (type === QuestionComponentTypeEnum.Text) {
    InnerComponent = TextComponent;
  } else if (type === QuestionComponentTypeEnum.Image) {
    InnerComponent = ImageComponent;
  } else if (type === QuestionComponentTypeEnum.Quote) {
    InnerComponent = QuoteComponent;
  } else if (type === QuestionComponentTypeEnum.Sound) {
    InnerComponent = SoundComponent;
  } else if (type === QuestionComponentTypeEnum.Equation) {
    InnerComponent = EquationComponent;
  } else if (type === QuestionComponentTypeEnum.Component) {
    InnerComponent = uniqueComponent;
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
        <InnerComponent
          locked={locked}
          data={component}
          updateComponent={updateComponent} />
        <HintComponent
          index={props.questionIndex}
          status={hint.status}
          locked={locked}
          value={hint.value}
          list={hint.list}
          count={numberOfAnswers}
          onChange={props.setQuestionHint}/>
      </div>
    )
  }
  return (
    <div style={{position: 'relative', width: '100%'}}>
      {
        !locked
        ?
          <DeleteIcon
            className="right-top-icon"
            style={{right: '2px', top: '7px'}}
            onClick={setEmptyType} />
        : ""
      }
      <InnerComponent
        locked={locked}
        data={component}
        updateComponent={updateComponent} />
    </div>
  );
}

export default SwitchQuestionComponent
