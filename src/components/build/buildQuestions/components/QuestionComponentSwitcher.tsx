import React from 'react'

import sprite from "assets/img/icons-sprite.svg";
import { QuestionComponentTypeEnum, Hint, QuestionTypeEnum } from 'model/question';
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import GraphComponent from './Graph/Graph'
import HintComponent, { HintState } from 'components/build/baseComponents/Hint/Hint';


export interface SwitchQuestionProps {
  questionType: QuestionTypeEnum;
  type: QuestionComponentTypeEnum;
  index: number;
  questionIndex: number;
  uniqueComponent: any;
  component: any;
  hint: Hint;
  locked: boolean;
  editOnly: boolean;
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
  type, index, component, hint, locked, editOnly, uniqueComponent,
  allDropBoxesEmpty, validationRequired,
  updateComponent, ...props
}) => {
  let InnerComponent = null;

  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    if (data.list && data.list.length) {
      return data.list.length;
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
      if (component.choices) {
        numberOfAnswers = component.choices.length;
      }
    } else if (props.questionType === QuestionTypeEnum.Sort) {
      if (component.categories) {
        numberOfAnswers = 0;
        for (let c of component.categories) {
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
            save={props.saveBrick}
            validationRequired={validationRequired}
            updateComponent={updateComponent}
            openSameAnswerDialog={props.openSameAnswerDialog}
          />
          <HintComponent
            index={props.questionIndex}
            status={hint.status}
            locked={locked}
            editOnly={editOnly}
            component={component}
            questionType={props.questionType}
            value={hint.value}
            list={hint.list}
            count={numberOfAnswers}
            validationRequired={validationRequired}
            save={props.saveBrick}
            onChange={props.setQuestionHint}
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  }
  if (InnerComponent) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
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
          save={props.saveBrick}
          validationRequired={validationRequired}
          updateComponent={updateComponent}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default SwitchQuestionComponent
