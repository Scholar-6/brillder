import React from 'react'
import { Grid } from '@material-ui/core';

import './horizontalShuffleBuild.scss'
import { UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

export const getDefaultHorizontalShuffleAnswer = () => {
  const newAnswer = () => ({ value: "" });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const HorizontalShuffleBuildComponent: React.FC<UniqueComponentProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const newAnswer = () => ({ value: "" });

  if (!data.list) {
    data.list = getDefaultHorizontalShuffleAnswer().list;
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
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

  const renderAnswer = (answer: any, i: number) => {
    let column = (i % 3) + 1;
    return (
      <Grid container item xs={4} key={i}>
        <div className={`horizontal-shuffle-box unique-component horizontal-column-${column}`}>
          {
            (state.list.length > 3)
              ? <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(i)}>
                <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
              </button>
              : ""
          }
          <DocumentWirisCKEditor
            disabled={locked}
            editOnly={editOnly}
            data={answer.value}
            validationRequired={validationRequired}
            toolbar={['latex', 'chemType']}
            placeholder={"Enter A" + (i + 1) + "..."}
            onBlur={() => {
              showSameAnswerPopup(i, state.list, openSameAnswerDialog);
              save();
            }}
            onChange={value => changed(answer, value)}
          />
        </div>
      </Grid>
    );
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
        height="auto"
        label="+ ANSWER" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
