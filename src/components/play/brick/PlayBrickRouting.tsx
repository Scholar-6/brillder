import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { connect } from "react-redux";

import actions from 'redux/actions/brickActions';
import Introduction from './introduction/Introduction';
import Live from './live/Live';
import ProvisionalScore from './provisionalScore/ProvisionalScore';
import Synthesis from './synthesis/Synthesis';

import './brick.scss';
import { Question } from 'components/model/question';


const BrickRouting: React.FC<any> = (props) => {
  if (!props.brick) {
    let brickId = props.match.params.brickId;
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }

  const parsedQuestions: Question[] = [];

  for (const question of props.brick.questions) {
    if (!question.components) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            components: parsedQuestion.components
          } as Question;
          parsedQuestions.push(q);
        }
      } catch (e) {}
    } else {
      parsedQuestions.push(question);
    }
  }

  props.brick.questions = parsedQuestions;
  
  return (
    <Switch>
      <Route exac path="/play/brick/:brickId/intro">
        <Introduction brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/live">
        <Live brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/provisionalScore">
        <ProvisionalScore brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/synthesis">
        <Synthesis brick={props.brick} />
      </Route>
    </Switch>
  );
}


const mapState = (state: any) => {
  return {
    brick: state.brick.brick,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (id:number) => dispatch(actions.fetchBrick(id)),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);