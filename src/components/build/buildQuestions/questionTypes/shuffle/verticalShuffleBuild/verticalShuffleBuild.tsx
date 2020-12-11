import React, { useEffect } from 'react'

import './verticalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import QuestionImageDropzone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import RemoveItemButton from '../../components/RemoveItemButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface VerticalShuffleBuildProps extends UniqueComponentProps { }

export const getDefaultVerticalShuffleAnswer = () => {
  const newAnswer = () => ({ value: "" });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog
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
      answer.valueFile = fileName;
      answer.answerType = QuestionValueType.Image;
      update();
      save();
    }

    let className = 'vertical-answer-box unique-component';
    if (answer.answerType === QuestionValueType.Image) {
      className += ' big-answer';
    }

    return (
      <div className={className} key={i}>
        <RemoveItemButton index={i} length={state.list.length} onClick={removeFromList} />
        <QuestionImageDropzone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          locked={locked}
          fileName={answer.valueFile}
          update={setImage}
        />
        <QuillEditor
          disabled={locked}
          data={answer.value}
          validate={validationRequired}
          toolbar={['latex']}
          placeholder={"Enter Answer " + (i + 1) + "..."}
          onBlur={() => {
            showSameAnswerPopup(i, state.list, openSameAnswerDialog);
          }}
          onChange={value => changed(answer, value)}
        />
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build unique-component">
      <div className="component-title">
        Enter Answers in the correct order from top to bottom.<br/>
        These will be randomised in the Play Interface.
      </div>
      {
        state.list.map((answer: any, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="+ ANSWER" />
    </div>
  )
}

export default VerticalShuffleBuildComponent
