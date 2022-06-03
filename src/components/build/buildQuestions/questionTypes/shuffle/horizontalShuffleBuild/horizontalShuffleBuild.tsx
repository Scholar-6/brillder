import React from 'react'
import { Grid } from '@material-ui/core';
import { ReactSortable } from 'react-sortablejs';

import './horizontalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import RemoveItemButton from '../../components/RemoveItemButton';
import { stripHtml } from 'components/build/questionService/ConvertService';
import RemoveButton from '../../components/RemoveButton';
import SoundRecord from '../../sound/SoundRecord';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import ShuffleText from '../components/ShuffleText';
import QuillHorizontalEditorContainer from 'components/baseComponents/quill/QuillHorizontalContainerEditor';


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

    const setSound = (soundFile: string, caption: string) => {
      if (locked) { return; }
      answer.value = '';
      answer.valueFile = '';
      answer.soundFile = soundFile;
      answer.soundCaption = caption;
      answer.answerType = QuestionValueType.Sound;
      update();
      save();
    }

    const onTextChanged = (answer: any, value: string) => {
      if (locked) { return; }
      answer.value = value;
      answer.valueFile = "";
      answer.soundFile = "";
      answer.answerType = QuestionValueType.String;
      update();
      save();
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <Grid container item xs={4} key={i}>
          <div className="horizontal-sound unique-component" key={i}>
            <RemoveButton onClick={() => changed(answer, '')} />
            <SoundRecord
              locked={locked}
              answer={answer}
              save={setSound}
              clear={() => onTextChanged(answer, '')}
            />
            <div className="move-container">
              <SpriteIcon name="feather-move" />
              <div className="css-custom-tooltip bold">Drag to rearrange</div>
            </div>
          </div>
        </Grid>
      );
    }

    return (
      <div key={i}>
        <div className={className + " horizontal-string"}>
          <RemoveItemButton index={i} length={state.list.length} onClick={removeFromList} />
          <QuillHorizontalEditorContainer
            locked={locked}
            object={answer}
            fieldName="value"
            validationRequired={validationRequired}
            toolbar={['latex']}
            isValid={isValid}
            placeholder={"Answer " + (i + 1)}
            onBlur={() => {
              showSameAnswerPopup(i, state.list, openSameAnswerDialog);
            }}
            onChange={value => changed(answer, value)}
          />
          <SoundRecord
            locked={locked}
            answer={answer}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
          <div className="move-container">
            <SpriteIcon name="feather-move" />
            <div className="css-custom-tooltip bold">Drag to rearrange</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="horizontal-shuffle-build">
      <div className="component-title">
        <div className="flex-center">
          <SpriteIcon name="feather-arrow-right" />
          <div>Enter Answers in the correct order from left to right.</div>
        </div>
        <ShuffleText />
      </div>
      <ReactSortable
        list={state.list}
        animation={150}
        className="answer-container"
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={newList => {
          const newState = { ...state, list: newList };
          setState(Object.assign({}, newState));
          updateComponent(newState);
          save();
        }}
      >
        {
          state.list.map((answer: any, i: number) => renderAnswer(answer, i))
        }
      </ReactSortable>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="Add an answer" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
