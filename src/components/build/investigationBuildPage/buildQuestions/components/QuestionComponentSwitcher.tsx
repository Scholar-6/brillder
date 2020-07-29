import React from 'react'

import sprite from "../../../../../assets/img/icons-sprite.svg";
import { QuestionComponentTypeEnum, Hint } from 'model/question';
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import DropBox from './DropBox';
import HintComponent, { HintState } from '../../../baseComponents/Hint/Hint';


export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum;
  index: number;
  questionIndex: number;
  uniqueComponent: any;
  component: any;
  hint: Hint;
  locked: boolean;
  canRemove: boolean;

  allDropBoxesEmpty: boolean;
  validationRequired: boolean;

  saveBrick(): void;
  setEmptyType(): void;
  updateComponent(component: any, index: number): void;
  setQuestionHint(hintState: HintState): void;
  removeComponent(componentIndex: number): void;
  openSameAnswerDialog(): void;
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type, index, component, hint, locked, uniqueComponent,
  allDropBoxesEmpty, validationRequired,
  updateComponent, ...props
}) => {
  let InnerComponent = DropBox as any;

  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    if (data.list && data.list.length) {
      return data.list.length;
    }
    return count;
  }

  const setComponentType = (type: number) => {
    component.type = type;
    updateComponent(component, index);
    props.saveBrick();
  }

  if (type === QuestionComponentTypeEnum.None) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {
          props.canRemove
            ?
            <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => props.removeComponent(index)}>
              <svg className="svg active back-button">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#trash-outline"} className="theme-orange" />
              </svg>
            </button>
            : ""
        }
        <DropBox locked={locked} onDrop={setComponentType} />
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
          save={props.saveBrick}
          validationRequired={validationRequired}
          updateComponent={updateComponent}
          openSameAnswerDialog={props.openSameAnswerDialog}
        />
        <HintComponent
          index={props.questionIndex}
          status={hint.status}
          locked={locked}
          value={hint.value}
          list={hint.list}
          count={numberOfAnswers}
          validationRequired={validationRequired}
          save={props.saveBrick}
          onChange={props.setQuestionHint}
        />
      </div>
    )
  }
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {
        !locked
          ?
          <button className="btn btn-transparent right-top-icon svgOnHover" onClick={props.setEmptyType}>
            <svg className="svg active back-button">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#trash-outline"} className="theme-orange" />
            </svg>
          </button>
          : ""
      }
      <InnerComponent
        locked={locked}
        data={component}
        save={props.saveBrick}
        validationRequired={validationRequired}
        updateComponent={updateComponent}
      />
    </div>
  );
}

export default SwitchQuestionComponent
