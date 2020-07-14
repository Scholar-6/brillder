import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './horizontalShuffleBuild.scss'
import { Grid } from '@material-ui/core';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import { UniqueComponentProps } from '../types';

import sprite from "../../../../../../assets/img/icons-sprite.svg";


const HorizontalShuffleBuildComponent: React.FC<UniqueComponentProps> = ({
  locked, data, validationRequired, save, updateComponent
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

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const changed = (shortAnswer: any, value: string) => {
    if (locked) { return; }
    shortAnswer.value = value;
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

  const renderAnswer = (answer: any, key: number) => {
    let column = (key % 3) + 1;
    return (
      <Grid container item xs={4} key={key}>
        <div className={`horizontal-shuffle-box unique-component horizontal-column-${column}`}>
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
            data={answer.value}
            validationRequired={validationRequired}
            toolbar={['mathType', 'chemType']}
            placeholder={"Enter A" + (key + 1) + "..."}
            onBlur={() => save()}
            onChange={value => changed(answer, value)}
          />
        </div>
      </Grid>
    );
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

  return (
    <div className="horizontal-shuffle-build">
      <div className="component-title">
        <div>Enter Answers below in order.</div>
        <div>These will be randomised in the Play Interface.</div>
      </div>
      <Grid container direction="row" className="answers-container">
        {
          state.list.map((answer: any, i: number) => renderAnswer(answer, i))
        }
      </Grid>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ ANSWER" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
