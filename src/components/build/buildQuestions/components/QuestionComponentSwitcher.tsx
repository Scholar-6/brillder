import React from 'react';
import Y from "yjs";

import sprite from "assets/img/icons-sprite.svg";
import { QuestionComponentTypeEnum, QuestionTypeEnum } from 'model/question';
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import GraphComponent from './Graph/Graph'
import HintComponent from 'components/build/baseComponents/Hint/Hint';


export interface SwitchQuestionProps {
  questionType: QuestionTypeEnum;
  type: QuestionComponentTypeEnum;
  index: number;
  questionIndex: number;
  uniqueComponent: any;
  component: Y.Map<any>;
  hint: Y.Map<any>;
  locked: boolean;
  editOnly: boolean;
  canRemove: boolean;

  allDropBoxesEmpty: boolean;
  validationRequired: boolean;

  setEmptyType(): void;
  removeComponent(componentIndex: number): void;
  openSameAnswerDialog(): void;

  // phone preview
  componentFocus(): void;
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type, index, component, hint, locked, editOnly, uniqueComponent,
  allDropBoxesEmpty, validationRequired,
  ...props
}) => {
  let InnerComponent = null;

  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    const list = data.get("list") as Y.Array<any>;
    if (list && list.length) {
      return list.length;
    }
    return count;
  }

  if (type === QuestionComponentTypeEnum.None) {
    return <div></div>;
  } else if (type === QuestionComponentTypeEnum.Text) {
    InnerComponent = TextComponent;
  } else if (type === QuestionComponentTypeEnum.Image) {
    InnerComponent = ImageComponent;
  } else if (type === QuestionComponentTypeEnum.Quote) {
    InnerComponent = QuoteComponent;
  } else if (type === QuestionComponentTypeEnum.Sound) {
    InnerComponent = SoundComponent;
  } else if (type === QuestionComponentTypeEnum.Graph)  {
    InnerComponent = GraphComponent;
  } else if (type === QuestionComponentTypeEnum.Component) {
    InnerComponent = uniqueComponent;
    let numberOfAnswers = getNumberOfAnswers(component);
    if (props.questionType === QuestionTypeEnum.MissingWord) {
      if (component.get("choices")) {
        numberOfAnswers = component.toJSON().choices.length;
      }
    } else if (props.questionType === QuestionTypeEnum.Sort) {
      if (component.get("categories")) {
        numberOfAnswers = 0;
        for (let c of component.toJSON().categories) {
          if (c.answers) {
            numberOfAnswers += c.answers.length;
          }
        }
      }
    }

    if (InnerComponent) {
      return (
        <div className="unique-component-wrapper">
          <InnerComponent
            locked={locked}
            editOnly={editOnly}
            data={component}
            hint={hint}
            validationRequired={validationRequired}
            openSameAnswerDialog={props.openSameAnswerDialog}
          />
          <HintComponent
            key={props.questionIndex + "-hint"}
            index={props.questionIndex}
            hint={hint}
            locked={locked}
            editOnly={editOnly}
            component={component}
            questionType={props.questionType}
            count={numberOfAnswers}
            validationRequired={validationRequired}
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  }
  if (InnerComponent) {
    let className = '';
    if (InnerComponent.name === 'ImageComponent') {
      if (validationRequired && !component.get("value")) {
        className += ' invalid-image';
      }
    }
    return (
      <div style={{ position: 'relative', width: '100%' }} className={className}>
        {
          !locked
            &&
            <button className="btn btn-transparent right-top-icon svgOnHover" onClick={props.setEmptyType}>
              <svg className="svg active back-button">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#trash-outline"} className="theme-orange" />
              </svg>
            </button>
        }
        <InnerComponent
          locked={locked}
          index={props.questionIndex}
          editOnly={editOnly}
          data={component}
          onFocus={props.componentFocus}
          validationRequired={validationRequired}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default SwitchQuestionComponent
