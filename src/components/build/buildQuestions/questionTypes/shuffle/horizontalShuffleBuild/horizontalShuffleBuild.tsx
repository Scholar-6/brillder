import React from 'react'
import { Grid } from '@material-ui/core';

import './horizontalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import RemoveItemButton from '../../components/RemoveItemButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';
import { stripHtml } from 'components/build/questionService/ConvertService';

export const getDefaultHorizontalShuffleAnswer = () => {
  const newAnswer = () => ({ value: "" });
  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const HorizontalShuffleBuildComponent: React.FC<UniqueComponentProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog
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

  const changed = (answer: any, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
    update();
    save();
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

    let className = `horizontal-shuffle-box unique-component horizontal-column-${column}`;

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if (answer.answerType === QuestionValueType.String && !stripHtml(answer.value)) {
        isValid = false;
      }
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    return (
      <Grid container item xs={4} key={i}>
        <div className={className}>
          <RemoveItemButton index={i} length={state.list.length} onClick={removeFromList} />
          <QuillEditor
            disabled={locked}
            data={answer.value}
            validate={validationRequired}
            toolbar={['latex']}
            isValid={isValid}
            placeholder={"Enter A" + (i + 1) + "..."}
            onBlur={() => {
              showSameAnswerPopup(i, state.list, openSameAnswerDialog);
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
        Enter Answers in the correct order from left to right.<br/>
        These will be randomised in the Play Interface.
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
