import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core';

import './pairMatchBuild.scss'
import { Answer } from './types';
import { UniqueComponentProps } from '../types';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import PairAnswerComponent from './answer/pairAnswer';
import PairOptionComponent from './option/pairOption';
import { showSameAnswerPopup } from '../service/questionBuild';
import ShuffleText from '../shuffle/components/ShuffleText';
import { ReactSortable } from 'react-sortablejs';
import DeleteDialog from 'components/build/baseComponents/dialogs/DeleteDialog';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface PairMatchBuildProps extends UniqueComponentProps { }

export const getDefaultPairMatchAnswer = () => {
  const newAnswer = () => ({ option: "", value: "" });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog, removeHintAt
}) => {
  const newAnswer = () => ({ option: "", value: "" });

  if (!data.list) {
    data.list = getDefaultPairMatchAnswer().list;
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [sortableKey, setSortableKey] = React.useState(3);

  const [state, setState] = React.useState(data);
  const [removingIndex, setRemovingIndex] = React.useState(-1);

  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

  const flip = (answer: Answer) => {
    console.log(answer);
    const tempObj = Object.assign({}, answer);

    answer.optionType = tempObj.answerType;
    answer.answerType = tempObj.optionType;

    answer.option = tempObj.value;
    answer.value = tempObj.option;

    answer.valueSoundFile = tempObj.optionSoundFile;
    answer.optionSoundFile = tempObj.valueSoundFile;

    answer.valueFile = tempObj.optionFile;
    answer.optionFile = tempObj.valueFile;

    answer.imageCaption = tempObj.imageOptionCaption;
    answer.imageOptionCaption = tempObj.imageCaption;

    answer.imageOptionSource = tempObj.imageSource;
    answer.imageSource = tempObj.imageOptionSource;

    answer.valueSoundCaption = tempObj.optionSoundCaption;
    answer.optionSoundCaption = tempObj.valueSoundCaption;

    update();
    save();
    setSortableKey(sortableKey+1);
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push(newAnswer());
    update();
    save();
  }

  const realRemoving = () => {
    state.list.splice(removingIndex, 1);
    removeHintAt(removingIndex);
    update();
    save();
    setRemovingIndex(-1);
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    setRemovingIndex(index);
  }

  const renderAnswer = (answer: Answer, i: number) => {
    return (
      <Grid key={i} container direction="row" className="answers-container">
        <div className="flip-button" onClick={() => flip(answer)}>
          <SpriteIcon name="hero-horizontal-switch" />
          <div className="css-custom-tooltip bold">Flip Content</div>
        </div>
        <PairOptionComponent
          index={i} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
          update={update} save={save}
        />
        <PairAnswerComponent
          index={i} length={data.list.length} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
          removeFromList={removeFromList} update={update} save={save}
          onBlur={() => showSameAnswerPopup(i, state.list, openSameAnswerDialog)}
        />
        <div className="move-container">
          <SpriteIcon name="feather-move" />
          <div className="css-custom-tooltip bold">Drag to rearrange pairs</div>
        </div>
      </Grid>
    );
  }

  return (
    <div className="pair-match-build">
      <div className="component-title">
        <div>Enter Pairs below so that Option 1 matches Answer 1 and so on.</div>
        <ShuffleText />
      </div>
      <ReactSortable
        list={state.list}
        animation={150}
        key={sortableKey}
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={newList => setState({ ...state, list: newList })}
      >
        {state.list.map((answer: Answer, i: number) => renderAnswer(answer, i))}
      </ReactSortable>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="Add a pair"
      />
      <DeleteDialog
        isOpen={removingIndex >= 0}
        title="Permanently delete<br />this answer?"
        index={removingIndex}
        submit={realRemoving}
        close={() => setRemovingIndex(-1)}
      />
    </div>
  )
}

export default PairMatchBuildComponent
