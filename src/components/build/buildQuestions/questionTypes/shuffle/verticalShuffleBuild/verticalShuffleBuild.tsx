import React, { useEffect } from 'react'

import './verticalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import QuestionImageDropzone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import RemoveItemButton from '../../components/RemoveItemButton';
import RemoveButton from '../../components/RemoveButton';
import { stripHtml } from 'components/build/questionService/ConvertService';
import QuillEditorContainer from 'components/baseComponents/quill/QuillEditorContainer';
import SoundRecord from '../../sound/SoundRecord';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import ShuffleText from '../components/ShuffleText';


export interface VerticalShuffleBuildProps extends UniqueComponentProps { }

export const getDefaultVerticalShuffleAnswer = () => {
  const newAnswer = () => ({ value: "" });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const newAnswer = () => ({ value: "" });

  if (!data.list) {
    data.list = getDefaultVerticalShuffleAnswer().list;
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

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
    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.value = "";
      if (fileName) {
        answer.valueFile = fileName;
      }
      answer.answerType = QuestionValueType.Image;
      update();
      save();
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

    let className = 'vertical-answer-box unique-component';
    if (answer.answerType === QuestionValueType.Image) {
      className += ' big-answer';
    } else {
      className += ' vertical-string';
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if ((answer.answerType === QuestionValueType.String || answer.answerType === QuestionValueType.None) && !stripHtml(answer.value)) {
        isValid = false;
      }
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div className="verical-sound unique-component" key={i}>
          <div className="index-circle-container">
            <div className="index-circle">{i + 1}</div>
          </div>
          <RemoveButton onClick={() => changed(answer, '')} />
          <SoundRecord
            locked={locked}
            answer={answer}
            save={setSound}
            clear={() => onTextChanged(answer, '')}
          />
        </div>
      );
    } else if (answer.answerType === QuestionValueType.Image) {
      return (
        <div className={className} key={i}>
          <RemoveItemButton index={i} length={state.list.length} onClick={removeFromList} />
          <div className="index-circle-container">
            <div className="index-circle">{i + 1}</div>
          </div>
          {answer.answerType === QuestionValueType.Image && <RemoveButton onClick={() => changed(answer, '')} />}
          <QuestionImageDropzone
            answer={answer as any}
            type={answer.answerType || QuestionValueType.None}
            locked={locked}
            fileName={answer.valueFile}
            update={setImage}
          />
        </div>
      );
    }


    return (
      <div className={className} key={i}>
        <RemoveItemButton index={i} length={state.list.length} onClick={removeFromList} />
        {answer.value && <div className="index-circle-container"><div className="index-circle">{i + 1}</div></div>}
        <QuestionImageDropzone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          locked={locked}
          fileName={answer.valueFile}
          update={setImage}
        />
        <QuillEditorContainer
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
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build unique-component">
      <div className="component-title">
        <div className="flex-center">
          <SpriteIcon name="hero-sort-descending" />
          <div>Enter Answers in the correct order from top to bottom.</div>
        </div>
        <ShuffleText />
      </div>
      {
        state.list.map((answer: any, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="Add an answer" />
    </div>
  )
}

export default VerticalShuffleBuildComponent
