import React from "react";
import * as Y from "yjs";
import { Grid } from "@material-ui/core";

import "./horizontalShuffleBuild.scss";
import { UniqueComponentProps } from "../../types";
import { generateId, showSameAnswerPopup } from "../../service/questionBuild";

import AddAnswerButton from "components/build/baseComponents/addAnswerButton/AddAnswerButton";
import ObservableAnswer from "../../components/ObservableAnswer";

export const getDefaultHorizontalShuffleAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () =>
    new Y.Map(Object.entries({ value: new Y.Text(), id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
};

const HorizontalShuffleBuildComponent: React.FC<UniqueComponentProps> = ({
  locked,
  data,
  validationRequired,
  openSameAnswerDialog,
}) => {
  const newAnswer = () =>
    new Y.Map(Object.entries({ value: new Y.Text(), id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  };

  if (!list) {
    getDefaultHorizontalShuffleAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const removeFromList = (index: number) => {
    if (locked) {
      return;
    }
    list.delete(index);
  };

  return (
    <div className="horizontal-shuffle-build">
      <div className="component-title">
        Enter Answers in the correct order from left to right.
        <br />
        These will be randomised in the Play Interface.
      </div>
      <Grid container direction="row" className="answers-container">
        {list.map((answer: any, i: number) => (
          <ObservableAnswer
            isHorizontal={true}
            locked={locked}
            answer={answer}
            validationRequired={validationRequired}
            index={i}
            list={list}
            removeFromList={removeFromList}
            checkSameAnswer={() =>
              showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog)
            }
          />
        ))}
      </Grid>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="+ ANSWER"
      />
    </div>
  );
};

export default React.memo(HorizontalShuffleBuildComponent);
