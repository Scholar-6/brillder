import React, { useEffect } from 'react'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import sprite from "../../../../../../assets/img/icons-sprite.svg";
import './verticalShuffleBuild.scss'
import { UniqueComponentProps } from '../types';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';


export interface VerticalShuffleBuildProps extends UniqueComponentProps {
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent
}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({ value: "" });

  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const changed = (answer: any, value: string) => {
    if (locked) { return; }
    answer.value = value;
    update();
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push({ value: "" });
    update();
    save();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
    save();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="vertical-answer-box" key={key}>
        {
          (state.list.length > 3)
            ? <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(key)}>
              <svg className="svg active back-button">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#trash-outline"} className="theme-orange" />
              </svg>
            </button>
            : ""
        }
        <DocumentWirisCKEditor
          disabled={locked}
          editOnly={editOnly}
          data={answer.value}
          validationRequired={validationRequired}
          toolbar={['mathType', 'chemType']}
          placeholder={"Enter Answer " + (key + 1) + "..."}
          onBlur={() => save()}
          onChange={value => changed(answer, value)}
        />
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build unique-component">
      <div className="component-title">
        <div>Enter Answers below in order.</div>
        <div>These will be randomised in the Play Interface.</div>
      </div>
      {
        state.list.map((answer: any, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ ANSWER" />
    </div>
  )
}

export default VerticalShuffleBuildComponent
