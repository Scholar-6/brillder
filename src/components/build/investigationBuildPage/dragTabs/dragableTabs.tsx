import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';
import { ReactSortable } from "react-sortablejs";

import './DragableTabs.scss';
import DragTab from './dragTab';
import LastTab from './lastTab';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: '100%',
      flexWrap: 'nowrap',
      margin: '0 !important',
      transform: 'translateZ(0)',
    },
    gridListTile: {
      'text-align': 'center'
    }
  }),
);

interface Question {
  id: number,
  active: boolean,
  type: number
}

interface DragTabsProps {
  questions: Question[],
  createNewQuestion: Function,
  moveQuestions: Function,
  setQuestions(questions: any): void
  selectQuestion: Function,
  removeQuestion: Function
} 

const DragableTabs: React.FC<DragTabsProps> = ({
  questions, createNewQuestion, moveQuestions, selectQuestion,
  removeQuestion, setQuestions,
}) => {

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = questions[dragIndex]
    moveQuestions(dragIndex, hoverIndex, dragCard);
  }

  const renderQuestionTab = (questions: Question[], question: Question, index: number, comlumns: number) => {
    let titleClassNames = "drag-tile-container";
    let cols = 2;
    if (question.active) {
      titleClassNames += " active";
      cols = 3;
    }

    let nextQuestion = questions[index + 1];
    if (nextQuestion && nextQuestion.active) {
      titleClassNames += " pre-active";
    }

    let width = (100 * 2) / (comlumns - 3);

    return (
      <GridListTile className={titleClassNames} key={index} cols={cols} style={{display:'inline-block', width: `${width}%`}}>
        <div className="drag-tile">
          <DragTab
            index={index}
            id={question.id}
            active={question.active}
            moveCard={moveCard}
            selectQuestion={selectQuestion}
            removeQuestion={removeQuestion}
          />
        </div>
      </GridListTile>
    )
  }

  const classes = useStyles();

  let columns = (questions.length * 2) + 3;

  const addQuestion = () => {
    createNewQuestion();
  }

  console.log(questions);

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={columns}>
        <ReactSortable
          list={questions}
          style={{width: '100%', padding: 0, height: '100%'}}
          group="cloning-group"
          setList={setQuestions}>
          {
            questions.map((question, i) => renderQuestionTab(questions, question, i, columns))
          }
        </ReactSortable>
        <GridListTile onClick={addQuestion} className={"drag-tile-container"} cols={2}>
          <Grid className={"drag-tile"} container alignContent="center" justify="center">
            <LastTab columns={columns}></LastTab>
          </Grid>
        </GridListTile>
      </GridList>
    </div>
  )
}

export default DragableTabs