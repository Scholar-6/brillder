import React from "react";
import * as Y from "yjs";
import _ from "lodash";
import { Grid } from "@material-ui/core";

import PairOptionComponent from "./option/pairOption";
import PairAnswerComponent from "./answer/pairAnswer";
import { toRenderJSON } from "services/SharedTypeService";

interface ObservablePairAnswerProps {
  index: number;
  list: Y.Array<any>;
  locked: boolean;
  answer: Y.Map<any>;
  validationRequired: boolean;
  removeFromList(index: number): void;
  checkSameAnswer(): void;
}

const ObservablePairAnswer: React.FC<ObservablePairAnswerProps> = ({
  locked,
  index,
  answer,
  validationRequired,
  list,
  ...props
}) => {
  const [jsonAnswer, setAnswer] = React.useState(toRenderJSON(answer));

  React.useEffect(() => {
    const observer = _.throttle((evt: any) => {
      setAnswer(toRenderJSON(answer))
    }, 200);
    answer.observe(observer);
    return () => {
      answer.unobserve(observer);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Grid key={answer.get("id")} container direction="row" className="answers-container">
      <PairOptionComponent
        index={index} locked={locked} answer={answer}
        validationRequired={validationRequired}
        onBlur={props.checkSameAnswer}
      />
      <PairAnswerComponent
        index={index} length={list.length} locked={locked} answer={answer}
        validationRequired={validationRequired}
        removeFromList={props.removeFromList}
        onBlur={props.checkSameAnswer}
      />
    </Grid>
  );
};

export default ObservablePairAnswer;
